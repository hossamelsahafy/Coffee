"use client";

import { useState } from "react";
import DashboardSideBar from "./DashboardSideBar";
import ConfirmActionModal from "@/components/shared/Model/ConfirmActionModal";
import auth from "@/actions/auth";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useUser } from "@/Context/userContext";
import { useCart } from "@/Context/CartContext";
import { useDashboard } from "@/Context/DashboardContext";

export default function DashboardShell({ locale }) {
  const [openModule, setOpenModule] = useState(false);
  const { openSidebar, setOpenSidebar } = useDashboard();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("");

  const [activeTab, setActiveTab] = useState("account");
  const { user } = useUser();
  const firstName = user.firstName;
  const { cart, clearCart } = useCart();
  const t = useTranslations("logout");
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    setLoading(true);
    const res = await auth("", "users/logout");

    if (res) {
      setLoading(false);
      if (cart.length > 0) {
        clearCart();
      }
      setMessage(t("success"));

      setTimeout(() => {
        router.push("/");
      }, 5000);
    }
  };

  return (
    <>
      <DashboardSideBar
        locale={locale}
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        setOpenModule={setOpenModule}
        setActiveTab={setActiveTab}
        pathname={pathname}
        firstName={firstName}
      />
      <ConfirmActionModal
        open={openModule}
        onClose={() => setOpenModule(false)}
        onConfirm={logout}
        title={t("title")}
        subtitle={t("subtitle")}
        cancelText={t("cancel")}
        confirmText={t("logout")}
        message={message}
        loading={loading}
        loadingText={t("loadingText")}
      />
    </>
  );
}
