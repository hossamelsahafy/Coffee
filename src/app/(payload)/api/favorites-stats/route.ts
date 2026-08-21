import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    const { searchParams } = new URL(request.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "12", 10), 1);
    const skip = (page - 1) * limit;

    const favoritesModel = payload.db.collections["favorites"];

    const paginatedGroupedProducts = await favoritesModel
      .aggregate([
        {
          $project: {
            createdAt: 1,
            updatedAt: 1,
            user: 1,
            extractedProductId: {
              $cond: {
                if: { $eq: [{ $type: "$product" }, "object"] },
                then: { $toString: "$product.value" },
                else: { $toString: "$product" },
              },
            },
          },
        },
        {
          $match: {
            extractedProductId: { $ne: "null", $exists: true },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: "$extractedProductId",
            favoriteCount: { $sum: 1 },
            latestFavoriteId: { $first: "$_id" },
            latestCreatedAt: { $first: "$createdAt" },
            latestUpdatedAt: { $first: "$updatedAt" },
            latestUser: { $first: "$user" },
          },
        },
        {
          $facet: {
            metadata: [{ $count: "totalUniqueProducts" }],
            docs: [
              { $sort: { favoriteCount: -1, latestCreatedAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
          },
        },
      ])
      .exec();

    const resultFacet = paginatedGroupedProducts[0] || {};
    const totalUniqueProducts =
      resultFacet.metadata?.[0]?.totalUniqueProducts || 0;
    const pageDocs = resultFacet.docs || [];

    const pageProductIds = pageDocs.map((item: any) => item._id);

    // 2. Fetch product details for page items from Payload
    const productsMap: Record<string, any> = {};

    if (pageProductIds.length > 0) {
      const productsResult = await payload.find({
        collection: "products",
        where: {
          id: { in: pageProductIds },
        },
        limit: pageProductIds.length,
        depth: 2,
      });

      for (const product of productsResult.docs) {
        productsMap[String(product.id)] = product;
      }
    }

    // 3. Combine grouped metrics into a single response object per product
    const favoritedProducts = pageDocs.map((doc: any) => {
      const strProductId = doc._id;

      return {
        id: doc.latestFavoriteId,
        createdAt: doc.latestCreatedAt,
        updatedAt: doc.latestUpdatedAt,
        user: doc.latestUser,
        favoriteCount: doc.favoriteCount,
        product: productsMap[strProductId] || null,
      };
    });

    // 4. Compute overall stats and activity timeline
    const globalStatsResult = await favoritesModel
      .aggregate([
        {
          $facet: {
            totals: [
              {
                $project: {
                  extractedProductId: {
                    $cond: {
                      if: { $eq: [{ $type: "$product" }, "object"] },
                      then: { $toString: "$product.value" },
                      else: { $toString: "$product" },
                    },
                  },
                },
              },
              {
                $match: {
                  extractedProductId: { $ne: "null", $exists: true },
                },
              },
              {
                $group: {
                  _id: null,
                  totalFavorites: { $sum: 1 },
                },
              },
            ],
            activity: [
              {
                $match: {
                  $or: [
                    { createdAt: { $exists: true, $ne: null } },
                    { updatedAt: { $exists: true, $ne: null } },
                  ],
                },
              },
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: { $ifNull: ["$createdAt", "$updatedAt"] },
                    },
                  },
                  favorites: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
              {
                $project: {
                  _id: 0,
                  date: "$_id",
                  favorites: 1,
                },
              },
            ],
          },
        },
      ])
      .exec();

    const stats = globalStatsResult[0] || {};
    const totalFavorites = stats.totals?.[0]?.totalFavorites || 0;
    const activity = stats.activity || [];

    const totalPages = Math.ceil(totalUniqueProducts / limit) || 1;

    return NextResponse.json({
      docs: favoritedProducts,
      page,
      totalPages,
      totalDocs: totalUniqueProducts,
      limit,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      stats: {
        totalFavorites,
        uniqueProductsFavorited: totalUniqueProducts,
      },
      activity,
    });
  } catch (error) {
    console.error("Error fetching grouped favorites stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites stats" },
      { status: 500 },
    );
  }
}
