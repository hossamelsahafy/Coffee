import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPayload } from "@/lib/payloadClient";
import { revalidatePath } from "next/cache";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const payload = await getPayload();

    const { user } = await payload.auth({
      headers: req.headers,
    });

    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const result = await payload.find({
      collection: "orders",
      where: {
        and: [
          {
            id: {
              equals: id,
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
    });

    const order = result.docs[0];
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.payment?.status === "paid") {
      revalidatePath("/users/dashboard/orders");
      return NextResponse.json({ success: true });
    }

    const paymentIntentId = order.payment?.stripePaymentIntentId;
    if (paymentIntentId) {
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === "succeeded") {
        await payload.update({
          collection: "orders",
          id: id,
          data: {
            payment: {
              status: "paid",
              stripePaymentIntentId: paymentIntent.id,
            },
            status: "processing",
            paidAt: new Date(),
          },
        });

        revalidatePath("/users/dashboard/orders");

        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
