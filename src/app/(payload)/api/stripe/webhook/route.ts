import Stripe from "stripe";
import { getPayload } from "@/lib/payloadClient";
import {
  paymentSuccessSubject,
  paymentSuccessHTML,
} from "@/lib/Emails/PaidConfirmationEmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return new Response("Invalid signature", {
      status: 400,
    });
  }

  try {
    const payload = await getPayload();

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          return new Response("Missing orderId", {
            status: 400,
          });
        }

        const order = await payload.findByID({
          collection: "orders",
          id: orderId,
          depth: 0,
        });

        if (!order) {
          return new Response("Order not found", {
            status: 404,
          });
        }

        const alreadyPaid =
          order.payment?.status === "paid" &&
          String(order.payment?.stripePaymentIntentId) ===
            String(paymentIntent.id);

        if (alreadyPaid) {
          break;
        }

        await payload.update({
          collection: "orders",
          id: orderId,
          data: {
            payment: {
              status: "paid",
              method: "stripe",
              stripePaymentIntentId: paymentIntent.id,
            },
            status: "processing",
            paidAt: new Date(),
          },
        });

        try {
          await payload.sendEmail({
            to: order.customer.email,
            subject: paymentSuccessSubject(order.orderNumber),
            html: paymentSuccessHTML({
              firstName: order.customer.firstName,
              orderNumber: order.orderNumber,
              total: order.total,
              paymentMethod: "stripe",
              isAdmin: false,
            }),
          });
        } catch (emailError) {}

        try {
          await payload.sendEmail({
            to: process.env.ADMIN_EMAIL!,
            subject: `Admin Alert – Payment Received #${order.orderNumber}`,
            html: paymentSuccessHTML({
              orderNumber: order.orderNumber,
              total: order.total,
              paymentMethod: "stripe",
              isAdmin: true,
            }),
          });
        } catch (emailError) {}

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        console.log(
          "Stripe webhook:",
          event.id,
          event.type,
          paymentIntent.id,
          orderId,
        );

        if (!orderId) {
          break;
        }

        const order = await payload.findByID({
          collection: "orders",
          id: orderId,
          depth: 0,
        });

        if (!order) {
          break;
        }

        if (order.payment?.status === "paid") {
          break;
        }

        const alreadyFailed =
          order.payment?.status === "failed" &&
          String(order.payment?.stripePaymentIntentId) ===
            String(paymentIntent.id);

        if (!alreadyFailed) {
          const updatedOrder = await payload.update({
            collection: "orders",
            id: orderId,
            data: {
              payment: {
                status: "failed",
                method: "stripe",
                stripePaymentIntentId: paymentIntent.id,
              },
            },
            overrideAccess: true,
          });
          console.log("🟢 WEBHOOK UPDATED ORDER:", {
            id: updatedOrder.id,
            status: updatedOrder.status,
            paymentStatus: updatedOrder.payment?.status,
          });
        }
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        console.log(
          "Stripe webhook:",
          event.id,
          event.type,
          paymentIntent.id,
          orderId,
        );

        if (!orderId) {
          break;
        }

        const order = await payload.findByID({
          collection: "orders",
          id: orderId,
          depth: 0,
        });

        if (!order) {
          break;
        }

        if (order.payment?.status === "paid") {
          break;
        }

        const alreadyPending =
          order.payment?.status === "pending" &&
          String(order.payment?.stripePaymentIntentId) ===
            String(paymentIntent.id);
        console.log("🔴 WEBHOOK ABOUT TO UPDATE ORDER:", {
          orderId,
          paymentIntentId: paymentIntent.id,
        });

        if (!alreadyPending) {
          await payload.update({
            collection: "orders",
            id: orderId,
            data: {
              payment: {
                status: "pending",
                method: "stripe",
                stripePaymentIntentId: paymentIntent.id,
              },
            },
          });
        } else {
        }

        break;
      }

      default:
        break;
    }

    return Response.json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    return new Response("Webhook processing failed", {
      status: 500,
    });
  }
}
