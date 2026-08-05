import { getPayload } from "@/lib/payloadClient";

export async function GET(req: Request) {
  try {
    const payload = await getPayload();

    const db = payload.db as any;
    const productsCollection = db.collections["products"];

    const { user } = await payload.auth({
      headers: req.headers,
    });

    if (!user || user.role !== "admin") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const [
      totalProducts,
      newProducts,
      featuredProducts,
      discountedProducts,
      activity,
    ] = await Promise.all([
      payload.count({
        collection: "products",
      }),

      payload.count({
        collection: "products",
        where: {
          isNewest: {
            equals: true,
          },
        },
      }),

      payload.count({
        collection: "products",
        where: {
          important: {
            equals: true,
          },
        },
      }),

      payload.count({
        collection: "products",
        where: {
          ShowInDiscountSection: {
            equals: true,
          },
        },
      }),

      productsCollection.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            products: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),
    ]);

    return Response.json({
      stats: {
        totalProducts: totalProducts.totalDocs,
        newProducts: newProducts.totalDocs,
        featuredProducts: featuredProducts.totalDocs,
        discountedProducts: discountedProducts.totalDocs,
      },

      activity: activity.map((item: any) => ({
        date: item._id,
        products: item.products,
      })),
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        message: "Failed to fetch product dashboard stats",
      },
      {
        status: 500,
      },
    );
  }
}
