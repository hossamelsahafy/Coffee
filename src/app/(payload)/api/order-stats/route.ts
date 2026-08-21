import { getPayload } from "@/lib/payloadClient";

export async function GET(req: Request) {
  try {
    const payload = await getPayload();

    const db = payload.db as any;
    const ordersCollection = db.collections["orders"];

    const { user } = await payload.auth({
      headers: req.headers,
    });

    if (!user || user.role !== "admin") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const [
      totalOrders,
      totalPaidOnStripe,
      totalPaidOnCash,
      orderActivity,
      paymentActivity,
      statusCountsAggregate,
      paymentMethodCountsAggregate,
      categorySpendAggregate,
    ] = await Promise.all([
      payload.count({
        collection: "orders",
      }),

      ordersCollection.aggregate([
        {
          $match: {
            "payment.method": "stripe",
            "payment.status": "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $ifNull: ["$total", 0],
              },
            },
          },
        },
      ]),

      ordersCollection.aggregate([
        {
          $match: {
            "payment.method": "cash",
            "payment.status": {
              $in: ["paid", "cash_on_delivery"],
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $ifNull: ["$total", 0],
              },
            },
          },
        },
      ]),

      ordersCollection.aggregate([
        {
          $match: {
            createdAt: {
              $exists: true,
              $ne: null,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            orders: {
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

      ordersCollection.aggregate([
        {
          $match: {
            "payment.status": {
              $in: ["paid", "cash_on_delivery"],
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: { $ifNull: ["$paidAt", "$createdAt"] },
              },
            },
            Revenue: {
              $sum: {
                $ifNull: ["$total", 0],
              },
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),

      ordersCollection.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      ordersCollection.aggregate([
        {
          $group: {
            _id: "$payment.method",
            count: { $sum: 1 },
          },
        },
      ]),

      ordersCollection.aggregate([
        { $unwind: "$items" },

        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "productDoc",
          },
        },
        { $unwind: "$productDoc" },

        {
          $lookup: {
            from: "categories",
            localField: "productDoc.category",
            foreignField: "_id",
            as: "categoryDoc",
          },
        },
        { $unwind: "$categoryDoc" },

        {
          $group: {
            _id: "$categoryDoc._id",
            title: { $first: "$categoryDoc.title" },
            titleAr: { $first: "$categoryDoc.titleAr" },
            value: {
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
          },
        },

        { $sort: { value: -1 } },
      ]),
    ]);

    const stripeTotal = totalPaidOnStripe[0]?.total ?? 0;
    const cashTotal = totalPaidOnCash[0]?.total ?? 0;
    const totalPaymentReceived = stripeTotal + cashTotal;

    const ordersByStatus = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    statusCountsAggregate.forEach((item: { _id: string; count: number }) => {
      if (item._id && item._id in ordersByStatus) {
        ordersByStatus[item._id as keyof typeof ordersByStatus] = item.count;
      }
    });

    const ordersByPaymentMethod = {
      cash: 0,
      stripe: 0,
    };

    paymentMethodCountsAggregate.forEach(
      (item: { _id: string; count: number }) => {
        if (item._id && item._id in ordersByPaymentMethod) {
          ordersByPaymentMethod[
            item._id as keyof typeof ordersByPaymentMethod
          ] = item.count;
        }
      },
    );

    const activityMap = new Map<
      string,
      { date: string; orders: number; Revenue: number }
    >();

    for (const item of orderActivity) {
      activityMap.set(item._id, {
        date: item._id,
        orders: item.orders,
        Revenue: 0,
      });
    }

    for (const item of paymentActivity) {
      const existing = activityMap.get(item._id);

      if (existing) {
        existing.Revenue = item.Revenue;
      } else {
        activityMap.set(item._id, {
          date: item._id,
          orders: 0,
          Revenue: item.Revenue,
        });
      }
    }

    const activity = Array.from(activityMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const categorySpend = categorySpendAggregate.map((cat: any) => ({
      id: cat._id,
      title: cat.title || "Uncategorized",
      titleAr: cat.titleAr || cat.title || "غير مصنف",
      value: cat.value || 0,
    }));

    return Response.json({
      stats: {
        totalOrders: totalOrders.totalDocs,
        totalPaidOnStripe: stripeTotal,
        totalPaidOnCash: cashTotal,
        totalPaymentReceived,
        ordersByStatus,
        ordersByPaymentMethod,
      },
      activity,
      categorySpend,
    });
  } catch (err) {
    console.error("Order dashboard stats error:", err);

    return Response.json(
      {
        message: "Failed to fetch order dashboard stats",
      },
      {
        status: 500,
      },
    );
  }
}
