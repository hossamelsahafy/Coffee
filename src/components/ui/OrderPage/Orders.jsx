"use client";
import React, { useEffect, useState, useTransition } from "react";
import { useCart } from "@/Context/CartContext";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import OrderCard from "@/components/ui/Taps/OrdersTap/OrdersCard";
import OrderCardSkelaton from "@/components/shared/Skelatons/OrderCardSkelaton";
import StripeModule from "@/components/ui/CheckoutPage/StripeModule";
import { GlassyToast } from "@/components/shared/GlassyToast/GlassyToast";
import GridSwiper from "@/components/shared/Swiper/GridSwiper";
import ShowOrderDetailsModule from "@/components/shared/Model/ShowOrderDetailsModule";
import { useDashboard } from "@/Context/DashboardContext";
import GetDataWithPagination from "@/actions/GetDataWithPagination";
import OrdersFilterBar from "./OrderFilterData";
import SlugMethods from "@/actions/SlugMethods";
import Pusher from "pusher-js";

const Orders = ({
  data,
  locale,
  total,
  subtotal,
  shippingCost,
  ShowDetails,
  PayNow,
  Paid,
  cash,
  pagination,
}) => {
  const t = useTranslations("OrderStatus");
  const paymentT = useTranslations("PaymentStatus");
  const paymentM = useTranslations("PaymentMethod");
  const { cart, clearCart } = useCart();
  const searchParams = useSearchParams();
  const [stripeOrderId, setStripeOrderId] = useState("");
  const [stripeOpen, setStripeOpen] = useState(false);
  const isendPoint = true;
  const [toast, setToast] = useState({ message: null, type: "" });
  const [openModule, setOpenModule] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const { openSidebar } = useDashboard();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  useEffect(() => {
    const fromPayment = searchParams.get("payment");
    if (
      fromPayment === "pending" ||
      fromPayment === "cash" ||
      fromPayment === "paid"
    ) {
      if (cart.length > 0) {
        clearCart();
      }
    }
  }, [searchParams, clearCart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const breakpoints = {
    0: { slidesPerView: 1 },
    700: { slidesPerView: 2 },
    1024: { slidesPerView: 2 },
  };

  const [isPending, startTransition] = useTransition();
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [orders, setOrders] = useState(data);

  const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
  const [totalPages, setTotalPages] = useState(pagination?.totalPages || 1);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchFilteredOrders = (
    pageToFetch = 1,
    search = debouncedSearch,
    status = statusFilter,
    payment = paymentFilter,
  ) => {
    setIsLoadingPage(true);

    startTransition(async () => {
      try {
        const where = {};
        if (search) {
          where.orderNumber = { contains: search };
        }
        if (status) {
          where.status = { equals: status };
        }
        if (payment) {
          where["payment.status"] = { equals: payment };
        }

        const result = await GetDataWithPagination(
          "orders",
          pageToFetch,
          9,
          "-createdAt",
          where,
          true,
        );

        if (result?.docs) {
          setOrders(result.docs);
          setCurrentPage(result.page);
          setTotalPages(result.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch pagination page:", error);
        setToast({
          message: locale === "ar" ? "فشل تحميل الصفحة" : "Failed to load page",
          type: "error",
        });
      } finally {
        setIsLoadingPage(false);
      }
    });
  };

  useEffect(() => {
    fetchFilteredOrders(1, debouncedSearch, statusFilter, paymentFilter);
  }, [debouncedSearch, statusFilter, paymentFilter]);

  const handlePageChange = (newPage) => {
    if (newPage === currentPage || isPending) return;
    fetchFilteredOrders(newPage, debouncedSearch, statusFilter, paymentFilter);
  };

  const showSkeleton = isLoadingPage || isPending;

  useEffect(() => {
    if (!stripeOrderId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      channelAuthorization: {
        endpoint: "/api/auth/pusher",
        transport: "ajax",
      },
    });

    const channelName = `private-order-${stripeOrderId}`;
    const channel = pusher.subscribe(channelName);

    const handleStatusUpdate = (updatedOrder) => {
      console.log("📥 Pusher event received:", updatedOrder);

      setOrders((prevOrders) =>
        prevOrders.map((item) => {
          const itemId = item.id || item._id;

          if (String(itemId) !== String(updatedOrder.id)) {
            return item;
          }

          return {
            ...item,
            ...updatedOrder,
            payment: {
              ...(item.payment || {}),
              ...(updatedOrder.payment || {}),
            },
          };
        }),
      );

      if (updatedOrder.payment?.status === "paid") {
        setUpdatingOrderId(null);
        setStripeOpen(false);

        setToast({
          type: "success",
          message:
            locale === "en"
              ? "Payment completed successfully."
              : "تم إتمام عملية الدفع بنجاح.",
        });
      }

      if (updatedOrder.payment?.status === "failed") {
        setUpdatingOrderId(null);
        setStripeOpen(false);

        setToast({
          type: "error",
          message:
            locale === "en"
              ? "Payment failed or was declined."
              : "فشلت عملية الدفع أو تم رفضها.",
        });
      }
    };

    channel.bind("status-update", handleStatusUpdate);

    return () => {
      channel.unbind("status-update", handleStatusUpdate);
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [stripeOrderId, locale]);

  return (
    <>
      <div className="w-full mt-4">
        <OrdersFilterBar
          locale={locale}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          paymentFilter={paymentFilter}
          setPaymentFilter={setPaymentFilter}
        />

        {showSkeleton ? (
          <div
            className={`grid grid-cols-1 ${openSidebar ? "md:grid-cols-2" : "md:grid-cols-3"}  lg:grid-cols-3 gap-6 w-full pb-5`}
          >
            {Array.from({ length: 9 }).map((_, index) => (
              <OrderCardSkelaton key={index} />
            ))}
          </div>
        ) : (
          <GridSwiper
            filteredProducts={orders}
            loop={false}
            enablePagePagination={true}
            makeBulletsWhilePagePagination={true}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            breakpoints={breakpoints}
            sideBarIsOpen={openSidebar}
            PaddingBottom="20px"
            renderItem={(d) => {
              const order = d;
              const orderId = order.id || order._id;
              const isUpdating = updatingOrderId === orderId;
              return (
                <OrderCard
                  key={orderId}
                  d={order}
                  locale={locale}
                  total={total}
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  ShowDetails={ShowDetails}
                  PayNow={PayNow}
                  Paid={Paid}
                  t={t}
                  openModule={openModule}
                  setOpenModule={setOpenModule}
                  paymentT={paymentT}
                  paymentM={paymentM}
                  setStripeOrderId={(id) => {
                    setStripeOrderId(id);
                    setUpdatingOrderId(id);
                  }}
                  setStripeOpen={setStripeOpen}
                  cash={cash}
                  setSelectedData={setSelectedData}
                  setToast={setToast}
                  isUpdating={isUpdating}
                />
              );
            }}
          />
        )}
      </div>

      {stripeOpen && stripeOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col justify-center items-center">
            <StripeModule
              orderId={stripeOrderId}
              locale={locale}
              setStripeOpen={setStripeOpen}
              isEndPoint={isendPoint}
              setToast={setToast}
            />
          </div>
        </div>
      )}

      <GlassyToast
        message={toast.message}
        type={toast.type || "success"}
        duration={5000}
        onClose={() => setToast((prev) => ({ ...prev, message: null }))}
      />
      <ShowOrderDetailsModule
        open={openModule}
        onClose={() => setOpenModule(false)}
        order={selectedData}
      />
    </>
  );
};

export default Orders;
