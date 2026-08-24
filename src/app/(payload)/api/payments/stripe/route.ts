import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPayload } from "@/lib/payloadClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const payload = await getPayload();

    const { user } = await payload.auth({
      headers: req.headers,
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await req.json();
    const orderId = body?.orderId;

    if (!orderId) {
      return NextResponse.json(
        {
          error: "orderId is required",
        },
        {
          status: 400,
        },
      );
    }

    // Make sure this order belongs to the authenticated user.
    const result = await payload.find({
      collection: "orders",
      where: {
        and: [
          {
            id: {
              equals: orderId,
            },
          },
          {
            user: {
              equals: user.id,
            },
          },
        ],
      },
      limit: 1,
      depth: 0,
    });

    const order = result.docs[0];

    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    // Cash orders cannot use Stripe.
    if (order.payment?.method === "cash") {
      return NextResponse.json(
        {
          error: "Payment method must be Stripe",
        },
        {
          status: 400,
        },
      );
    }

    // Already paid.
    if (order.payment?.status === "paid") {
      return NextResponse.json(
        {
          error: "Order is already paid",
        },
        {
          status: 400,
        },
      );
    }

    const amount = Math.round(Number(order.total) * 100);

    let paymentIntent: Stripe.PaymentIntent | null = null;

    const existingPaymentIntentId = order.payment?.stripePaymentIntentId;

    // ============================================================
    // TRY TO REUSE EXISTING PAYMENT INTENT
    // ============================================================
    if (existingPaymentIntentId) {
      try {
        const existing = await stripe.paymentIntents.retrieve(
          existingPaymentIntentId,
        );

        if (existing.status !== "canceled" && existing.status !== "succeeded") {
          paymentIntent = existing;

          // Update amount if necessary.
          if (existing.amount !== amount) {
            paymentIntent = await stripe.paymentIntents.update(existing.id, {
              amount,
            });
          }
        }
      } catch (error) {
        console.error("Could not retrieve existing PaymentIntent:", error);
      }
    }

    // ============================================================
    // CREATE NEW PAYMENT INTENT
    // ============================================================
    if (!paymentIntent) {
      paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",

        metadata: {
          orderId: String(order.id),
          userId: String(user.id),
        },

        automatic_payment_methods: {
          enabled: true,
        },
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Stripe endpoint error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
