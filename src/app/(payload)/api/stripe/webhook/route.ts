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

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const payload = await getPayload();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;

      const orderId = paymentIntent.metadata.orderId;
      const order = await payload.findByID({
        collection: "orders",
        id: orderId,
      });

      await payload.update({
        collection: "orders",
        id: orderId,
        data: {
          payment: {
            status: "paid",
            stripePaymentIntentId: paymentIntent.id,
          },
          status: "processing",
          paidAt: new Date(),
        },
      });
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

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;

      await payload.update({
        collection: "orders",
        id: paymentIntent.metadata.orderId,
        data: {
          payment: {
            status: "failed",
          },
        },
      });

      break;
    }
  }

  return Response.json({ received: true });
}
