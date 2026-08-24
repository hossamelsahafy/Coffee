import { NextResponse } from "next/server";
import { getPayload } from "@/lib/payloadClient";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const payload = await getPayload();

    const { user } = await payload.auth({
      headers: req.headers,
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await payload.find({
      collection: "orders",
      where: {
        and: [{ id: { equals: id } }, { user: { equals: user.id } }],
      },
      limit: 1,
      depth: 0,
    });

    const order = result.docs[0];

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: order.payment?.status === "paid",
      status: order.payment?.status ?? "pending",
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
