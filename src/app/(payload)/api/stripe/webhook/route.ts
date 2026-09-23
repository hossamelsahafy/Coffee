import Stripe from "stripe";
import { getPayload } from "@/lib/payloadClient";
import {
  paymentSuccessSubject,
  paymentSuccessHTML,
} from "@/lib/Emails/PaidConfirmationEmail";
import { emitOrderUpdated } from "@/lib/OrderEvents";

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
      // =========================================================
      // PAYMENT SUCCEEDED
      // =========================================================
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

        const updatedOrder = await payload.update({
          collection: "orders",
          id: orderId,
          data: {
            payment: {
              status: "paid",
              method: "stripe",
              stripePaymentIntentId: paymentIntent.id,
            },
            status: "processing",
            paidAt: new Date().toISOString(),
          },
          overrideAccess: true,
        });

        const userId =
          typeof updatedOrder.user === "object"
            ? updatedOrder.user.id
            : updatedOrder.user;

        if (userId) {
          emitOrderUpdated(String(userId), updatedOrder);
        }

        if (typeof order.total !== "number") {
          console.error("Order total is missing:", order.id);
          break;
        }
        try {
          await payload.sendEmail({
            to: order.customer?.email ?? undefined,
            subject: paymentSuccessSubject(order.orderNumber),
            html: paymentSuccessHTML({
              firstName: order.customer?.firstName ?? undefined,
              orderNumber: order.orderNumber,
              total: order.total,
              paymentMethod: "stripe",
              isAdmin: false,
            }),
          });
        } catch (emailError) {
          console.error(
            "Failed to send payment success email to customer:",
            emailError,
          );
        }

        // Admin email
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
        } catch (emailError) {
          console.error(
            "Failed to send payment success email to admin:",
            emailError,
          );
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

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

        if (alreadyFailed) {
          break;
        }

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

        const userId =
          typeof updatedOrder.user === "object"
            ? updatedOrder.user.id
            : updatedOrder.user;

        if (userId) {
          emitOrderUpdated(String(userId), updatedOrder);
        }

        break;
      }
      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

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

        if (alreadyPending) {
          break;
        }

        const updatedOrder = await payload.update({
          collection: "orders",
          id: orderId,
          data: {
            payment: {
              status: "pending",
              method: "stripe",
              stripePaymentIntentId: paymentIntent.id,
            },
          },
          overrideAccess: true,
        });

        const userId =
          typeof updatedOrder.user === "object"
            ? updatedOrder.user.id
            : updatedOrder.user;

        if (userId) {
          emitOrderUpdated(String(userId), updatedOrder);
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
