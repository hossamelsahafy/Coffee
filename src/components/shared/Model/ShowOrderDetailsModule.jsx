"use client";

import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useTranslations } from "next-intl";
import Link from "next/link";
export default function ShowOrderDetailsModule({
  locale,
  open,
  onClose,
  order,
}) {
  const t = useTranslations("Orders");

  if (!open || !order) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {t("orderDetailsTitle", {
                order: order.orderNumber || order.id,
              })}
            </h2>

            <p className="text-sm text-white/70">{t("orderDetailsSubtitle")}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <IoClose size={22} />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6">
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={70}
                  height={70}
                  className="h-17,5 w-17.55 rounded-xl object-cover bg-white/10"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.title}</h3>

                  {item.optionType && (
                    <p className="text-sm text-white/70">
                      {locale === "en" ? item.optionType : item.optionTypeAr}:{" "}
                      {locale === "en"
                        ? item.optionValue.name
                        : item.optionValue.nameAr}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-white/80">
                    <span>
                      {t("quantity")}: {item.quantity}
                    </span>

                    <span>
                      {t("price")}: ${item.price}
                    </span>

                    <span className="font-medium">
                      {t("total")}: ${item.total}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center border-t border-white/10 my-4">
            <Link
              href={`/users/dashboard/track-orders?order=${order.orderNumber}`}
              className="rounded-xl border border-white/20 mt-4 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              {t("trackOrder")}
            </Link>
          </div>
        </div>
        <div />
      </div>
    </div>
  );
}
