import { getPayload } from "@/lib/payloadClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await getPayload();

    const { user } = await payload.auth({
      headers: req.headers,
    });

    if (!user) {
      return NextResponse.json(
        {
          error: {
            en: "Unauthorized",
            ar: "غير مصرح لك",
          },
        },
        { status: 401 },
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        {
          error: {
            en: "Product ID is required",
            ar: "معرف المنتج مطلوب",
          },
        },
        { status: 400 },
      );
    }

    const existing = await payload.find({
      collection: "product-views",
      where: {
        and: [
          {
            user: {
              equals: user.id,
            },
          },
          {
            product: {
              equals: productId,
            },
          },
        ],
      },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length) {
      const doc = existing.docs[0];

      const updated = await payload.update({
        collection: "product-views",
        id: doc.id,
        data: {
          views: doc.views + 1,
          lastViewed: new Date().toISOString(),
        },
        overrideAccess: true,
      });

      return NextResponse.json({
        success: true,
        action: "updated",
        doc: updated,
      });
    }

    const created = await payload.create({
      collection: "product-views",
      data: {
        user: user.id,
        product: productId,
        views: 1,
        lastViewed: new Date().toISOString(),
      },
      overrideAccess: true,
    });

    return NextResponse.json({
      success: true,
      action: "created",
      doc: created,
    });
  } catch (error) {
    console.error("Track Product View Error:", error);

    return NextResponse.json(
      {
        error: {
          en: "Something went wrong",
          ar: "حدث خطأ ما",
        },
      },
      { status: 500 },
    );
  }
}
