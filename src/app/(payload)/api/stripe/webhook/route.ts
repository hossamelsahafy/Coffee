import Stripe from "stripe";
import { getPayload } from "@/lib/payloadClient";

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
