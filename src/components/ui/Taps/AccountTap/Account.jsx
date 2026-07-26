"use client";
import React, { useState } from "react";
import { FaInfoCircle, FaEdit } from "react-icons/fa";
import { MdOutlineSecurity, MdDangerous } from "react-icons/md";
import SlugMethods from "@/actions/SlugMethods";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ConfirmActionModal from "@/components/shared/Model/ConfirmActionModal";
import auth from "@/actions/auth";
import { VerifyEmailWithCode } from "@/components/shared/Model/VerifyEmailWithCode";
import { useUser } from "@/Context/userContext";
import { useCart } from "@/Context/CartContext";
const Account = ({ locale }) => {
  const [editing, setEditing] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [openModule, setOpenModule] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyEmailWithCode, setVerifyEmailWithCode] = useState(false);
  const [inlineNotification, setInlineNotification] = useState({
    message: "",
    type: "",
  });
  const [modalMessage, setModalMessage] = useState("");
  const { user, setUser } = useUser();
  const t = useTranslations("AccountData");
  const router = useRouter();

  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    gender: user?.gender || "",
    email: user?.email || "",
    password: "",
  });

  const [formData, setFormData] = useState({});
  const { cart, clearCart } = useCart();
  const openConfirmModal = (action) => {
    setActionType(action);
    setOpenModule(true);
  };

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      setInlineNotification({ message: "", type: "" });

      const res = await SlugMethods(`auth/update-user-data`, "PATCH", formData);

      if (res) {
        if (formData.email && formData.email !== userData.email) {
          setVerifyEmailWithCode(true);
          return;
        }
        const updatedUser = {
          ...userData,
          ...formData,
          password: "",
        };
        setUserData(updatedUser);
        setUser(updatedUser);
        const successText =
          res.message?.[locale] || res.message?.en || t("UpdateMessageSuccess");
        setInlineNotification({ message: successText, type: "success" });
        setFormData({});

        setTimeout(() => {
          setInlineNotification({ message: "", type: "" });
          setEditing(null);
        }, 5000);
      }
    } catch (error) {
      const errorText = error?.error[locale];

      setInlineNotification({
        message: errorText,
        type: "error",
      });

      setTimeout(() => {
        setInlineNotification({ message: "", type: "" });
      }, 5000);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const logout = async () => {
    setLoading(true);
    const res = await auth("", "users/logout");
    if (res) {
      setLoading(false);
      setModalMessage(t("logoutSuccess"));
      if (cart.length > 0) {
        clearCart();
      }
      setTimeout(() => {
        router.push("/");
      }, 5000);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      const deleteRes = await SlugMethods(`auth/delete-account`, "DELETE");
      if (deleteRes) {
        setModalMessage(t("deleteSuccess"));
        setTimeout(() => {
          router.push("/");
        }, 5000);
      }
    } catch (error) {
      setModalMessage(t("deletingError"));
      setTimeout(() => {
        setOpenModule(false);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (actionType === "logout") logout();
    if (actionType === "delete") deleteAccount();
  };

  const data = [
    {
      name: "Personal Information",
      nameAr: "المعلومات الشخصية",
      icon: FaInfoCircle,
      editable: true,
      content: [
        {
          key: "firstName",
          name: "First Name",
          nameAr: "الاسم الأول",
          value: userData.firstName,
        },
        {
          key: "lastName",
          name: "Last Name",
          nameAr: "اسم العائلة",
          value: userData.lastName,
        },
        {
          key: "phoneNumber",
          name: "Phone Number",
          nameAr: "رقم الهاتف",
          value: userData.phoneNumber,
        },
        {
          key: "gender",
          name: "Gender",
          nameAr: "الجنس",
          value: userData.gender === "male" ? t("Male") : t("Female"),
        },
      ],
    },
    {
      name: "Security",
      nameAr: "الأمان",
      icon: MdOutlineSecurity,
      editable: true,
      content: [
        {
          key: "email",
          name: "Email",
          nameAr: "البريد الإلكتروني",
          value: userData.email,
        },
        {
          key: "password",
          name: "Password",
          nameAr: "كلمة المرور",
          value: "••••••••",
        },
      ],
    },
    {
      name: "Danger Zone",
      nameAr: "منطقة الخطر",
      icon: MdDangerous,
      editable: false,
      content: [
        { name: "Delete Account", nameAr: "حذف الحساب", value: "button" },
        { name: "Logout", nameAr: "تسجيل الخروج", value: "button" },
      ],
    },
  ];

  return (
    <>
      <div className="grid w-full mt-4 grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        {data.map((d, i) => {
          const Icon = d.icon;
          const isEditing = editing === i;

          return (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/4 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300"
            >
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#D8A46B]/10 p-3 text-[#D8A46B]">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {locale === "en" ? d.name : d.nameAr}
                  </h3>
                </div>

                {d.editable && (
                  <button
                    onClick={() => {
                      setEditing(isEditing ? null : i);
                      setInlineNotification({ message: "", type: "" });
                      setFormData({});
                    }}
                    className={`rounded-lg p-2 cursor-pointer transition-all duration-300 ${
                      isEditing
                        ? "bg-[#D8A46B]/20 text-white rotate-90"
                        : "text-[#D8A46B] hover:bg-[#D8A46B]/10"
                    }`}
                  >
                    <FaEdit size={22} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {d.content.map((c, index) =>
                  c.value === "button" ? (
                    <button
                      key={index}
                      onClick={() =>
                        openConfirmModal(
                          c.name === "Delete Account" ? "delete" : "logout",
                        )
                      }
                      className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                        c.name === "Delete Account"
                          ? "bg-amber-950/30 text-amber-400 border border-amber-500/20 hover:bg-amber-900/40"
                          : "bg-[#D8A46B]/10 text-[#D8A46B]/90 hover:bg-[#D8A46B]/20"
                      }`}
                    >
                      {locale === "en" ? c.name : c.nameAr}
                    </button>
                  ) : (
                    <div
                      key={index}
                      className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/3 p-4 sm:flex-row sm:items-center sm:justify-between min-h-[74px] transition-all duration-300"
                    >
                      <span className="whitespace-nowrap text-sm text-gray-400">
                        {locale === "en" ? c.name : c.nameAr}
                      </span>

                      <div
                        className={`relative ${isEditing ? "sm:w-1/2 w-full" : "w-full"} h-10 flex items-center justify-start sm:justify-end`}
                      >
                        <span
                          className={`absolute font-medium text-white transition-all duration-300 ease-in-out break-all text-start sm:text-end w-full px-3 py-2 ${
                            isEditing
                              ? "opacity-0 -translate-y-2 pointer-events-none scale-95"
                              : "opacity-100 translate-y-0"
                          }`}
                        >
                          {c.value || "-"}
                        </span>

                        {c.key !== "gender" ? (
                          <input
                            type={c.key === "password" ? "password" : "text"}
                            name={c.key}
                            onChange={handleChange}
                            placeholder={
                              c.key === "password"
                                ? t("EnterNewPassword") || "••••••••"
                                : ""
                            }
                            defaultValue={c.key === "password" ? "" : c.value}
                            disabled={!isEditing}
                            className={`w-full rounded-lg border bg-white/5 px-3 py-2 text-white outline-none transition-all duration-700 ease-in-out ${
                              isEditing
                                ? "focus:border-[#D8A46B] opacity-100 "
                                : "border-transparent hidden"
                            }`}
                          />
                        ) : (
                          <select
                            name="gender"
                            defaultValue={c.value}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full rounded-lg border bg-white/5 px-3 py-2 text-white outline-none transition-all duration-300 ease-in-out ${
                              isEditing
                                ? "focus:border-[#D8A46B] opacity-100 "
                                : "border-transparent hidden"
                            }`}
                          >
                            <option value="male" className="bg-[#1A1A1A]">
                              {t("Male")}
                            </option>
                            <option value="female" className="bg-[#1A1A1A]">
                              {t("Female")}
                            </option>
                          </select>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                  isEditing
                    ? "grid-rows-[1fr] opacity-100 mt-6"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 flex flex-col gap-4 border-t border-white/10 pt-5">
                  {inlineNotification.message && (
                    <div
                      className={`w-full  text-center rounded-xl p-3 text-sm font-medium border transition-all duration-300 ${
                        inlineNotification.type === "success"
                          ? "bg-[#D8A46B]/10 border-[#D8A46B]/30 text-[#D8A46B]"
                          : "bg-amber-950/40 border-amber-700/40 text-amber-300"
                      }`}
                    >
                      {inlineNotification.message}
                    </div>
                  )}

                  <div className="flex gap-3 w-full">
                    <button
                      disabled={updateLoading}
                      onClick={handleUpdate}
                      className="flex-1 flex items-center gap-2 justify-center rounded-xl bg-[#D8A46B] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#c9935b] disabled:opacity-50"
                    >
                      {updateLoading ? (
                        <>
                          <p>
                            {locale === "en" ? "Saving..." : "يتم الحفظ..."}
                          </p>
                          <span className="inline-block w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                        </>
                      ) : (
                        <p>{locale === "en" ? "Save" : "حفظ"}</p>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setEditing(null);
                        setInlineNotification({ message: "", type: "" });
                        setFormData({});
                      }}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {locale === "en" ? "Cancel" : "إلغاء"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmActionModal
        open={openModule}
        onClose={() => setOpenModule(false)}
        onConfirm={handleConfirm}
        title={actionType === "delete" ? t("deleteTitle") : t("title")}
        subtitle={actionType === "delete" ? t("deleteSubtitle") : t("subtitle")}
        confirmText={actionType === "delete" ? t("delete") : t("logout")}
        cancelText={t("cancel")}
        message={modalMessage}
        loading={loading}
        loadingText={
          actionType === "delete" ? t("deleteLoadingText") : t("loadingText")
        }
      />
      <VerifyEmailWithCode
        verifyEmailWithCodeModule={verifyEmailWithCode}
        setVerifyEmailWithCodeModule={setVerifyEmailWithCode}
        submit={t("Submit")}
        cancelTitle={t("cancelTitle")}
        verifyModuleTitle={t("VerifyModuleTitle")}
        verifyModuleSubtitle={t("VerifyModuleSubtitle")}
        verificationCode={t("VerificationCode")}
        setUpdateEmailLoading={setUpdateLoading}
        setEditing={setEditing}
        pendingEmail={formData.email}
        setEmail={(newEmail) =>
          setUserData((prev) => ({ ...prev, email: newEmail }))
        }
        locale={locale}
      />
    </>
  );
};

export default Account;
