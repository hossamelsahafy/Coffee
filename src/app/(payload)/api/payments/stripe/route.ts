import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPayload } from "@/lib/payloadClient";
import getStripeAmount from "@/lib/GetStripeCurrency";
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
    const currencyCode = order.currency.trim().toLowerCase();

    if (!currencyCode) {
      return NextResponse.json(
        {
          error: "Order currency is not configured.",
        },
        {
          status: 400,
        },
      );
    }

    const stripeAccountCountry = process.env.STRIPE_ACCOUNT_COUNTRY;

    if (!stripeAccountCountry) {
      return NextResponse.json(
        {
          error: "Stripe account country is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    const countrySpec = await stripe.countrySpecs.retrieve(
      stripeAccountCountry.toUpperCase(),
    );

    const supportedCurrencies = countrySpec.supported_payment_currencies;

    if (!supportedCurrencies.includes(currencyCode)) {
      return NextResponse.json(
        {
          error: `The currency ${currencyCode.toUpperCase()} is not supported by your Stripe account country.`,
        },
        {
          status: 400,
        },
      );
    }

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
    if (order.status === "Cancelled") {
      return NextResponse.json(
        {
          error: "Order Was Cancelled You Can't Pay For That Order",
        },
        {
          status: 400,
        },
      );
    }
    const amount = getStripeAmount(Number(order.total), currencyCode);

    let paymentIntent: Stripe.PaymentIntent | null = null;

    const existingPaymentIntentId = order.payment?.stripePaymentIntentId;
    if (existingPaymentIntentId) {
      try {
        const existing = await stripe.paymentIntents.retrieve(
          existingPaymentIntentId,
        );

        if (
          existing.status !== "canceled" &&
          existing.status !== "succeeded" &&
          existing.currency === currencyCode
        ) {
          paymentIntent = existing;

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

    if (!paymentIntent) {
      paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: currencyCode,

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
