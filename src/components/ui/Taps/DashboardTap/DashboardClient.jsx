"use client";
import React, { useMemo, useState } from "react";
import { ChartAreaInteractive } from "@/components/ui/Taps/DashboardTap/ChartAreaInteractive";
import ContentLayout from "@/components/shared/Dashboard/ContentLayout";
import TrackOrderData from "@/components/ui/Taps/TrackOrderTap/TrackOrderData";
import { useTranslations } from "next-intl";
import { CategorySpendChart } from "@/components/ui/Taps/DashboardTap/CategorySpendChart";
import { MostViewedProducts } from "@/components/ui/Taps/DashboardTap/MostViewedProducts";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";
import ProductModal from "@/components/shared/Model/ProductModal";
import { useUser } from "@/Context/userContext";
import SlugMethods from "@/actions/SlugMethods";

const DashboardClient = ({ locale, data, MostViwedProducts }) => {
  const t = useTranslations("DashboardData");
  const title = t("title");
  const subtitle = t("subtitle");
  const MyAccount = t("MyAccount");
  const [productList, setProductList] = useState(MostViwedProducts || []);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [openModel, setOpenModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState({
    message: null,
    type: "",
  });
  const { user } = useUser();

  const toggleFavorite = async (productId, currentIsFavorite) => {
    if (!user) {
      setToast({
        message:
          locale === "ar"
            ? "يجب تسجيل الدخول لإضافة المنتجات إلى المفضلة"
            : "You need to login to add products to favorites",
        type: "error",
      });
      return;
    }

    if (loadingProductId === productId) return;
    const nextState = !currentIsFavorite;

    setProductList((prev) =>
      prev.map((item) => {
        const prodId = item.product?.id || item.id;
        if (prodId === productId) {
          if (item.product) {
            return {
              ...item,
              product: { ...item.product, isFavorite: nextState },
            };
          }
          return { ...item, isFavorite: nextState };
        }
        return item;
      }),
    );

    setLoadingProductId(productId);

    try {
      if (nextState) {
        await SlugMethods("favorites", "POST", { product: productId });
        setToast({
          message:
            locale === "ar"
              ? "تمت إضافة المنتج إلى المفضلة"
              : "Product added to favorites",
          type: "success",
        });
      } else {
        await SlugMethods(
          `favorites?where[product][equals]=${productId}`,
          "DELETE",
        );
        setToast({
          message:
            locale === "ar"
              ? "تمت إزالة المنتج من المفضلة"
              : "Product removed from favorites",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Favorite toggle failed:", error);
      setProductList((prev) =>
        prev.map((item) => {
          const prodId = item.product?.id || item.id;
          if (prodId === productId) {
            if (item.product) {
              return {
                ...item,
                product: { ...item.product, isFavorite: currentIsFavorite },
              };
            }
            return { ...item, isFavorite: currentIsFavorite };
          }
          return item;
        }),
      );
      setToast({
        message:
          locale === "ar"
            ? "حدث خطأ أثناء التحديث"
            : "Failed to update favorites",
        type: "error",
      });
    } finally {
      setLoadingProductId(null);
    }
  };
  const chartData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];

    const map = {};

    const formatDate = (dateStr) => {
      if (!dateStr) return null;
      return new Date(dateStr).toISOString().split("T")[0];
    };

    data.forEach((order) => {
      if (order.createdAt && order.status !== "cancelled") {
        const orderDate = formatDate(order.createdAt);
        if (orderDate) {
          if (!map[orderDate]) {
            map[orderDate] = { date: orderDate, spent: 0, orders: 0 };
          }
          map[orderDate].orders += 1;
        }
      }

      const isPaid = order.payment?.status === "paid";
      const paidDateStr = order.paidAt;

      if (isPaid && paidDateStr) {
        const paidDate = formatDate(paidDateStr);
        if (paidDate) {
          if (!map[paidDate]) {
            map[paidDate] = { date: paidDate, spent: 0, orders: 0 };
          }
          map[paidDate].spent += Number(order.total) || 0;
        }
      }
    });

    return Object.values(map).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [data]);

  const cards = [
    {
      title: t("totalOrders"),
      value: data?.length || 0,
      type: "text",
    },
    {
      title: t("totalSpent"),
      value: data
        ?.filter((order) => order.payment?.status === "paid")
        .reduce((acc, order) => acc + Number(order.total || 0), 0)
        .toFixed(2),
      suffix: locale === "en" ? "USD" : "دولار",
      type: "money",
    },
    {
      title: t("cashOrders"),
      value:
        data?.filter((order) => order.payment?.method === "cash").length || 0,
      type: "text",
    },
    {
      title: t("stripeOrders"),
      value:
        data?.filter((order) => order.payment?.method === "stripe").length || 0,
      type: "text",
    },
  ];

  const isArabic = locale === "ar";

  const categoryData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const spendMap = new Map();

    data.forEach((order) => {
      if (!Array.isArray(order?.items)) return;

      order.items.forEach((item) => {
        const category = item?.product?.category;
        if (!category) return;

        const categoryId = category.id || category.title;
        const categoryName = isArabic
          ? category.titleAr || category.title
          : category.title;

        const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
        const totalItemCost = (item.price || 0) * qty;

        if (spendMap.has(categoryId)) {
          const currentCategory = spendMap.get(categoryId);
          currentCategory.value += totalItemCost;
        } else {
          spendMap.set(categoryId, {
            name: categoryName,
            value: totalItemCost,
          });
        }
      });
    });

    return Array.from(spendMap.values()).sort((a, b) => b.value - a.value);
  }, [data, isArabic]);

  return (
    <>
      <ContentLayout
        locale={locale}
        title={title}
        subtitle={subtitle}
        MyThing={MyAccount}
        isdiff={true}
      >
        <div className="max-w-6xl flex flex-col gap-4">
          <TrackOrderData locale={locale} order={data} cards={cards} />

          <ChartAreaInteractive
            chartData={chartData}
            lines={[
              {
                dataKey: "orders",
                label: "Orders",
                color: "#965015",
                fill: "url(#fillOrders)",
                stroke: "#965015",
                strokeWidth: 2,
              },
              {
                dataKey: "spent",
                label: "Revenue",
                color: "#D8A46B",
                fill: "url(#fillSpent)",
                stroke: "#D8A46B",
                strokeWidth: 2,
              },
            ]}
          />
          <CategorySpendChart data={categoryData} />
          <MostViewedProducts
            data={productList}
            setOpenModel={setOpenModel}
            setSelectedProduct={setSelectedProduct}
            onToggleFavorite={toggleFavorite}
            loadingProductId={loadingProductId}
          />
        </div>
      </ContentLayout>
      <ProductModal
        selectedProduct={selectedProduct}
        locale={locale}
        setOpenModel={setOpenModel}
        openModel={openModel}
      />
      <GlassyToast
        message={toast.message}
        type={toast.type || "success"}
        duration={5000}
        onClose={() => setToast((prev) => ({ ...prev, message: null }))}
      />
    </>
  );
};

export default DashboardClient;
