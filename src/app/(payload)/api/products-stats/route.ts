import { getPayload } from "@/lib/payloadClient";

export async function GET(req: Request) {
  try {
    const payload = await getPayload();

    const db = payload.db as any;
    const productsCollection = db.collections["products"];
    const ordersCollection = db.collections["orders"];

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
      mostOrderedAggregate,
    ] = await Promise.all([
      payload.count({ collection: "products" }),

      payload.count({
        collection: "products",
        where: { isNewest: { equals: true } },
      }),

      payload.count({
        collection: "products",
        where: { important: { equals: true } },
      }),

      payload.count({
        collection: "products",
        where: { ShowInDiscountSection: { equals: true } },
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
            products: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      ordersCollection.aggregate([
        { $unwind: "$items" },

        {
          $group: {
            _id: {
              productId: "$items.product",
              optionValue: {
                $ifNull: [
                  "$items.selectedOption.value",
                  {
                    $ifNull: [
                      "$items.choice.value",
                      { $ifNull: ["$items.optionValue", "$items.variant"] },
                    ],
                  },
                ],
              },
            },
            totalQuantitySold: {
              $sum: {
                $cond: [{ $gt: ["$items.quantity", 0] }, "$items.quantity", 1],
              },
            },
            totalRevenue: {
              $sum: {
                $multiply: [
                  { $ifNull: ["$items.price", 0] },
                  {
                    $cond: [
                      { $gt: ["$items.quantity", 0] },
                      "$items.quantity",
                      1,
                    ],
                  },
                ],
              },
            },
            directItemImageUrl: {
              $first: {
                $ifNull: ["$items.selectedOption.imageUrl", "$items.imageUrl"],
              },
            },
            directItemMediaId: {
              $first: {
                $ifNull: ["$items.selectedOption.image", "$items.image"],
              },
            },
          },
        },

        { $sort: { totalQuantitySold: -1 } },

        { $limit: 4 },

        {
          $lookup: {
            from: "products",
            localField: "_id.productId",
            foreignField: "_id",
            as: "productDoc",
          },
        },
        { $unwind: "$productDoc" },

        {
          $lookup: {
            from: "media",
            localField: "directItemMediaId",
            foreignField: "_id",
            as: "mediaDoc",
          },
        },

        {
          $project: {
            _id: "$productDoc._id",
            title: "$productDoc.title",
            titleAr: "$productDoc.titleAr",
            choiceType: "$productDoc.choices.choiceType",
            choiceTypeAr: "$productDoc.choices.choiceTypeAr",
            selectedVariant: "$_id.optionValue",
            totalQuantitySold: 1,
            totalRevenue: 1,
            variantImage: {
              $ifNull: [
                { $arrayElemAt: ["$mediaDoc.url", 0] },
                "$directItemImageUrl",
              ],
            },
            fallbackOptions: "$productDoc.choices.options",
          },
        },
      ]),
    ]);

    const mostOrderedProducts = mostOrderedAggregate.map((item: any) => {
      let finalImage = item.variantImage;

      if (!finalImage && Array.isArray(item.fallbackOptions)) {
        const matchedOption = item.fallbackOptions.find(
          (opt: any) =>
            opt.value === item.selectedVariant ||
            opt.valueAr === item.selectedVariant,
        );

        if (matchedOption) {
          finalImage =
            matchedOption.ImageSource === "Url"
              ? matchedOption.imageUrl
              : matchedOption.image?.url || null;
        }
      }

      return {
        id: item._id,
        title: item.title,
        titleAr: item.titleAr || item.title,
        choiceType: item.choiceType || "Option",
        choiceTypeAr: item.choiceTypeAr || "النوع",
        selectedVariant: item.selectedVariant || "Default",
        totalQuantitySold: item.totalQuantitySold,
        totalRevenue: item.totalRevenue,
        image: finalImage || null,
      };
    });

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

      mostOrderedProducts,
    });
  } catch (err) {
    console.error("Product stats API error:", err);

    return Response.json(
      { message: "Failed to fetch product dashboard stats" },
      { status: 500 },
    );
  }
}
