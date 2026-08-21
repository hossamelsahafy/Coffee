import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const { searchParams } = new URL(request.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);

    const limit = Math.max(parseInt(searchParams.get("limit") || "12", 10), 1);

    const paginatedViews = await payload.find({
      collection: "product-views",
      page,
      limit,
      sort: "-updatedAt",
      depth: 0,
    });

    const pageProductIds = Array.from(
      new Set(
        paginatedViews.docs
          .map((doc) => {
            if (!doc.product) return null;

            return typeof doc.product === "object"
              ? (doc.product as any)?.id
              : doc.product;
          })
          .filter(Boolean)
          .map(String),
      ),
    );

    const productsMap: Record<string, any> = {};

    if (pageProductIds.length > 0) {
      const productsResult = await payload.find({
        collection: "products",
        where: {
          id: {
            in: pageProductIds,
          },
        },
        limit: pageProductIds.length,
        depth: 2,
      });

      productsResult.docs.forEach((product) => {
        productsMap[String(product.id)] = product;
      });
    }

    const viewedProducts = paginatedViews.docs.map((doc) => {
      const productId =
        typeof doc.product === "object"
          ? (doc.product as any)?.id
          : doc.product;

      return {
        id: doc.id,
        views: typeof doc.views === "number" ? doc.views : 1,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        user: doc.user,
        product: productId ? productsMap[String(productId)] || null : null,
      };
    });

    const viewsModel = payload.db.collections["product-views"];

    const aggregationResult = await viewsModel
      .aggregate([
        {
          $facet: {
            totals: [
              {
                $group: {
                  _id: null,

                  totalViews: {
                    $sum: {
                      $cond: [
                        {
                          $isNumber: "$views",
                        },
                        "$views",
                        1,
                      ],
                    },
                  },

                  uniqueProducts: {
                    $addToSet: "$product",
                  },
                },
              },

              {
                $project: {
                  _id: 0,

                  totalViews: 1,

                  uniqueProductsViewed: {
                    $size: {
                      $filter: {
                        input: "$uniqueProducts",
                        as: "product",
                        cond: {
                          $ne: ["$$product", null],
                        },
                      },
                    },
                  },
                },
              },
            ],

            /**
             * -----------------------------------------------
             * Views activity grouped by day
             * -----------------------------------------------
             */
            activity: [
              {
                $match: {
                  createdAt: {
                    $exists: true,
                    $ne: null,
                  },
                },
              },

              /**
               * Make sure every document has a numeric
               * view count.
               *
               * Missing/non-numeric views = 1
               */
              {
                $set: {
                  calculatedViews: {
                    $cond: [
                      {
                        $isNumber: "$views",
                      },
                      "$views",
                      1,
                    ],
                  },
                },
              },

              /**
               * Group views by date
               */
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$createdAt",
                    },
                  },

                  views: {
                    $sum: "$calculatedViews",
                  },
                },
              },

              /**
               * Oldest → newest
               */
              {
                $sort: {
                  _id: 1,
                },
              },

              /**
               * Return the same shape as the old API
               */
              {
                $project: {
                  _id: 0,

                  date: "$_id",

                  views: 1,
                },
              },
            ],
          },
        },
      ])
      .exec();

    const stats = aggregationResult[0] || {};

    const totals = stats.totals?.[0] || {
      totalViews: 0,
      uniqueProductsViewed: 0,
    };

    const activity = stats.activity || [];

    return NextResponse.json({
      docs: viewedProducts,

      page: paginatedViews.page,
      totalPages: paginatedViews.totalPages,
      totalDocs: paginatedViews.totalDocs,
      limit: paginatedViews.limit,

      hasPrevPage: paginatedViews.hasPrevPage,
      hasNextPage: paginatedViews.hasNextPage,

      prevPage: paginatedViews.prevPage,
      nextPage: paginatedViews.nextPage,

      stats: {
        totalViews: totals.totalViews,
        uniqueProductsViewed: totals.uniqueProductsViewed,
      },

      activity,
    });
  } catch (error) {
    console.error("Error fetching product views stats:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch product views stats",
      },
      {
        status: 500,
      },
    );
  }
}
