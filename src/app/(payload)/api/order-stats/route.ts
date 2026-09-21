import { getPayload } from "@/lib/payloadClient";
import { convertHistoricalAmount } from "@/lib/currency/ConvertHistoricalAmount";

type CurrencySnapshot = {
  baseCurrency?: string;
  rates?: Record<string, number>;
  capturedAt?: string;
};

type OrderProduct = {
  _id: string;
  categoryData?: {
    _id: string;
    title?: string;
    titleAr?: string;
  };
};

function normalizeCurrency(value?: string) {
  return value?.trim().toUpperCase();
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

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

    if (!ordersCollection) {
      throw new Error("Orders Mongo collection is not available.");
    }

    const siteSettings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
    });

    const targetCurrency = normalizeCurrency(
      siteSettings?.currency?.baseCurrency,
    );

    if (!targetCurrency) {
      return Response.json(
        {
          message: "Base currency is not configured.",
        },
        { status: 400 },
      );
    }

    const historicalRateCache = new Map<string, number>();

    const orders = await ordersCollection.aggregate([
      {
        $match: {
          payment: {
            $exists: true,
          },
        },
      },

      {
        $project: {
          _id: 1,

          createdAt: 1,
          paidAt: 1,

          total: 1,

          currency: 1,
          baseCurrency: 1,
          currencySnapshot: 1,

          status: 1,

          payment: 1,

          items: 1,
        },
      },

      {
        $sort: {
          createdAt: 1,
        },
      },

      {
        $lookup: {
          from: "products",

          let: {
            productIds: "$items.product",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$productIds"],
                },
              },
            },

            {
              $lookup: {
                from: "categories",

                localField: "category",

                foreignField: "_id",

                as: "categoryData",
              },
            },

            {
              $unwind: {
                path: "$categoryData",

                preserveNullAndEmptyArrays: true,
              },
            },
          ],

          as: "orderProducts",
        },
      },
    ]);

    const totalOrders = orders.length;

    let totalPaidOnStripe = 0;
    let totalPaidOnCash = 0;

    const ordersByStatus = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    const ordersByPaymentMethod = {
      cash: 0,
      stripe: 0,
    };

    const activityMap = new Map<
      string,
      {
        date: string;
        orders: number;
        Revenue: number;
      }
    >();

    const categorySpendMap = new Map<
      string,
      {
        id: string;
        title: string;
        titleAr: string;
        value: number;
      }
    >();

    for (const order of orders) {
      const status = order?.status;

      if (status && status in ordersByStatus) {
        ordersByStatus[status as keyof typeof ordersByStatus] += 1;
      }

      const paymentMethod = order?.payment?.method;

      if (paymentMethod && paymentMethod in ordersByPaymentMethod) {
        ordersByPaymentMethod[
          paymentMethod as keyof typeof ordersByPaymentMethod
        ] += 1;
      }

      const paymentStatus = order?.payment?.status;

      const isRevenueOrder =
        paymentStatus === "paid" || paymentStatus === "cash_on_delivery";

      if (!isRevenueOrder || order?.status === "cancelled") {
        continue;
      }

      const amount = Number(order?.total);

      if (!Number.isFinite(amount)) {
        continue;
      }

      const fromCurrency = normalizeCurrency(order?.currency);

      const orderBaseCurrency = normalizeCurrency(order?.baseCurrency);

      if (!fromCurrency || !orderBaseCurrency) {
        console.error("Order is missing currency information.", {
          orderId: String(order?._id),
          fromCurrency,
          orderBaseCurrency,
        });

        continue;
      }

      const dateSource = order?.paidAt || order?.createdAt;

      if (!dateSource) {
        continue;
      }

      const date = new Date(dateSource).toISOString().split("T")[0];

      const snapshot = order?.currencySnapshot as CurrencySnapshot | undefined;

      let convertedOrderAmount: number;

      try {
        convertedOrderAmount = await convertHistoricalAmount({
          amount,

          fromCurrency,

          targetCurrency,

          snapshot,

          orderBaseCurrency,

          date,

          historicalRateCache,
        });
      } catch (error) {
        console.error("Failed to convert order amount.", {
          orderId: String(order?._id),
          date,
          amount,
          fromCurrency,
          targetCurrency,
          error,
        });

        continue;
      }

      if (!Number.isFinite(convertedOrderAmount)) {
        continue;
      }

      if (paymentMethod === "stripe" && paymentStatus === "paid") {
        totalPaidOnStripe += convertedOrderAmount;
      }

      if (
        paymentMethod === "cash" &&
        (paymentStatus === "paid" || paymentStatus === "cash_on_delivery")
      ) {
        totalPaidOnCash += convertedOrderAmount;
      }

      const existingActivity = activityMap.get(date);

      if (existingActivity) {
        existingActivity.orders += 1;

        existingActivity.Revenue += convertedOrderAmount;
      } else {
        activityMap.set(date, {
          date,

          orders: 1,

          Revenue: convertedOrderAmount,
        });
      }

      if (!Array.isArray(order?.items)) {
        continue;
      }

      const productsMap = new Map<string, OrderProduct>(
        (order?.orderProducts || []).map((product: any) => [
          String(product._id),

          {
            _id: String(product._id),

            categoryData: product.categoryData
              ? {
                  _id: String(product.categoryData._id),

                  title: product.categoryData.title,

                  titleAr: product.categoryData.titleAr,
                }
              : undefined,
          },
        ]),
      );

      for (const item of order.items) {
        const product = productsMap.get(String(item?.product));

        if (!product) {
          continue;
        }

        const category = product.categoryData;

        if (!category) {
          continue;
        }

        const categoryId = String(category._id);

        const itemPrice = Number(item?.price || 0);

        const quantity = Number(item?.quantity || 1);

        if (!Number.isFinite(itemPrice) || !Number.isFinite(quantity)) {
          continue;
        }

        const itemTotal = itemPrice * quantity;

        if (!Number.isFinite(itemTotal)) {
          continue;
        }

        let convertedItemTotal: number;

        try {
          convertedItemTotal = await convertHistoricalAmount({
            amount: itemTotal,

            fromCurrency,

            targetCurrency,

            snapshot,

            orderBaseCurrency,

            date,

            historicalRateCache,
          });
        } catch (error) {
          console.error("Failed to convert category amount.", {
            orderId: String(order?._id),
            categoryId,

            date,

            itemTotal,

            fromCurrency,

            targetCurrency,

            error,
          });

          continue;
        }

        if (!Number.isFinite(convertedItemTotal)) {
          continue;
        }

        const existingCategory = categorySpendMap.get(categoryId);

        if (existingCategory) {
          existingCategory.value += convertedItemTotal;
        } else {
          categorySpendMap.set(categoryId, {
            id: categoryId,

            title: category.title || "Uncategorized",

            titleAr: category.titleAr || category.title || "غير مصنف",

            value: convertedItemTotal,
          });
        }
      }
    }

    const stripeTotal = roundMoney(totalPaidOnStripe);

    const cashTotal = roundMoney(totalPaidOnCash);

    const totalPaymentReceived = roundMoney(stripeTotal + cashTotal);

    const activity = Array.from(activityMap.values())
      .map((item) => ({
        date: item.date,

        orders: item.orders,

        Revenue: roundMoney(item.Revenue),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const categorySpend = Array.from(categorySpendMap.values())
      .map((category) => ({
        id: category.id,

        title: category.title,

        titleAr: category.titleAr,

        value: roundMoney(category.value),
      }))
      .sort((a, b) => b.value - a.value);

    return Response.json({
      currency: targetCurrency,

      stats: {
        totalOrders,

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
