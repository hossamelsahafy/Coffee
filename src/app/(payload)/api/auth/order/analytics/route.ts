import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { Types } from "mongoose";
import { convertHistoricalAmount } from "@/lib/currency/ConvertHistoricalAmount";

type CurrencySnapshot = {
  baseCurrency?: string;
  rates?: Record<string, number>;
  capturedAt?: string;
};

type OrderAnalyticsResult = {
  date: string;
  spent: number;
  orders: number;
};

type CategoryAnalyticsResult = {
  category: {
    id: string;
    title?: string;
  };
  value: number;
};
type OrderProduct = {
  _id: Types.ObjectId | string;
  categoryData?: {
    _id: Types.ObjectId | string;
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

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config });

    const { user } = await payload.auth({
      headers: req.headers,
    });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const targetCurrency = normalizeCurrency(
      searchParams.get("currency") || undefined,
    );

    const locale = searchParams.get("locale") === "ar" ? "ar" : "en";

    if (!targetCurrency) {
      return NextResponse.json(
        { message: "Currency is required." },
        { status: 400 },
      );
    }

    const ordersCollection = payload.db.collections.orders;

    if (!ordersCollection) {
      throw new Error("Orders Mongo collection is not available.");
    }

    const customerId = new Types.ObjectId(String(user.id));

    const orders = await ordersCollection.aggregate([
      {
        $match: {
          user: customerId,
          "payment.status": "paid",
          status: { $ne: "cancelled" },
          paidAt: {
            $exists: true,
            $ne: null,
          },
        },
      },

      {
        $project: {
          _id: 1,
          paidAt: 1,
          total: 1,

          currency: 1,
          baseCurrency: 1,
          currencySnapshot: 1,

          payment: 1,

          items: 1,
        },
      },

      {
        $sort: {
          paidAt: 1,
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

    const historicalRateCache = new Map<string, number>();

    const chartMap = new Map<string, OrderAnalyticsResult>();

    const categoryMap = new Map<string, CategoryAnalyticsResult>();

    let totalOrders = 0;
    let cashOrders = 0;
    let stripeOrders = 0;

    for (const order of orders) {
      const paidAt = order?.paidAt;

      if (!paidAt) {
        continue;
      }

      const date = new Date(paidAt).toISOString().split("T")[0];

      const amount = Number(order?.total);

      if (!Number.isFinite(amount)) {
        continue;
      }

      const fromCurrency = normalizeCurrency(order?.currency);

      const orderBaseCurrency = normalizeCurrency(order?.baseCurrency);

      if (!fromCurrency || !orderBaseCurrency) {
        continue;
      }

      totalOrders += 1;

      if (order?.payment?.method === "cash") {
        cashOrders += 1;
      }

      if (order?.payment?.method === "stripe") {
        stripeOrders += 1;
      }

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

      const currentChart = chartMap.get(date) || {
        date,
        spent: 0,
        orders: 0,
      };

      currentChart.spent += convertedOrderAmount;
      currentChart.orders += 1;

      chartMap.set(date, currentChart);

      if (!Array.isArray(order?.items)) {
        continue;
      }

      const productsMap = new Map<string, OrderProduct>(
        (order.orderProducts || []).map((product: OrderProduct) => [
          String(product._id),
          product,
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

        const categoryId = category?._id ? String(category._id) : null;

        if (!categoryId) {
          continue;
        }

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
          console.error("Failed to convert category item amount.", {
            orderId: String(order?._id),
            date,
            categoryId,
            fromCurrency,
            targetCurrency,
            error,
          });

          continue;
        }

        if (!Number.isFinite(convertedItemTotal)) {
          continue;
        }

        const categoryTitle =
          locale === "ar"
            ? category?.titleAr || category?.title
            : category?.title || category?.titleAr;

        const currentCategory = categoryMap.get(categoryId);

        if (currentCategory) {
          currentCategory.value += convertedItemTotal;
        } else {
          categoryMap.set(categoryId, {
            category: {
              id: categoryId,
              title: categoryTitle,
            },
            value: convertedItemTotal,
          });
        }
      }
    }

    const chart = Array.from(chartMap.values()).map((item) => ({
      date: item.date,
      spent: roundMoney(item.spent),
      orders: item.orders,
    }));

    const totalSpent = roundMoney(
      chart.reduce((sum, item) => sum + item.spent, 0),
    );

    const categories = Array.from(categoryMap.values()).map((category) => ({
      category: category.category,
      value: roundMoney(category.value),
    }));

    return NextResponse.json({
      currency: targetCurrency,

      chart,

      categories,

      summary: {
        totalSpent,
        totalOrders,
        cashOrders,
        stripeOrders,
      },
    });
  } catch (error) {
    console.error("Orders analytics endpoint error:", error);

    return NextResponse.json(
      {
        message: "Failed to calculate order analytics.",
      },
      { status: 500 },
    );
  }
}
