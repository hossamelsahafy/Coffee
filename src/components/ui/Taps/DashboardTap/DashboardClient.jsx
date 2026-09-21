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
import { useSiteSettings } from "@/Context/CurrencyContext";
const DashboardClient = ({ locale, data, MostViwedProducts }) => {
  const t = useTranslations("DashboardData");
  const { selectedCurrency, exchangeRate } = useSiteSettings();
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
  const chartData = data?.chart;

  const cards = [
    {
      title: t("totalOrders"),
      value: data?.summary.totalOrders,
      type: "text",
    },
    {
      title: t("totalSpent"),
      value: data.summary.totalSpent,
      suffix: data?.currency || "USD",
      type: "money",
    },
    {
      title: t("cashOrders"),
      value: data?.summary.cashOrders,
      type: "text",
    },
    {
      title: t("stripeOrders"),
      value: data?.summary.stripeOrders,
      type: "text",
    },
  ];

  const categoryData = data.categories;
  console.log(categoryData);

  const handleAddToCart = (isIn) => {
    setToast({
      message: isIn
        ? locale === "ar"
          ? "تمت إضافة المنتج إلى السلة"
          : "Product added to cart"
        : locale === "ar"
          ? "المنتج غير متوفر"
          : "Product is sold out",
      type: isIn ? "success" : "error",
    });
  };
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
          <CategorySpendChart data={categoryData} currency={data.currency} />
          <MostViewedProducts
            data={productList}
            setOpenModel={setOpenModel}
            setSelectedProduct={setSelectedProduct}
            onToggleFavorite={toggleFavorite}
            loadingProductId={loadingProductId}
            exchangeRate={exchangeRate}
            currency={selectedCurrency.value}
            onAddToCart={handleAddToCart}
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
