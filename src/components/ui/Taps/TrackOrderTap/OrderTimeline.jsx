import React from "react";
import { useTranslations } from "next-intl";

const statusKeys = [
  { value: "pending", key: "pending" },
  { value: "processing", key: "processing" },
  { value: "shipped", key: "shipped" },
  { value: "delivered", key: "delivered" },
];

export default function OrderTimeline({ currentStatus }) {
  const t = useTranslations("OrderTimeline");

  const currentIndex = statusKeys.findIndex((s) => s.value === currentStatus);
  const isCancelled = currentStatus === "cancelled";

  if (isCancelled) {
    return (
      <div className="p-4 my-4 bg-[#3D1414]/80 border border-red-500/30 rounded-2xl text-red-200 text-center font-medium backdrop-blur-md">
        {t("cancelled")}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl py-8 px-6 md:px-8 bg-linear-to-r from-[#2A1810] via-[#1F120B] to-[#120A06] rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden mt-6">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C07A3B]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 left-10 h-36 w-36 rounded-full bg-[#965015]/10 blur-3xl pointer-events-none" />

      <h3 className="text-xl font-semibold mb-8 text-white tracking-wide relative z-10">
        {t("progressTitle")}
      </h3>

      <div className="flex items-center justify-between relative z-10">
        {statusKeys.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step.value}
              className="flex flex-col items-center relative z-10 flex-1"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCurrent
                    ? "bg-[#C07A3B] text-white ring-4 ring-[#C07A3B]/25 shadow-lg shadow-[#C07A3B]/30"
                    : isCompleted
                      ? "bg-[#6F3F1C] text-white shadow-md"
                      : "bg-[#2A1810] text-gray-500 border border-white/10"
                }`}
              >
                {index + 1}
              </div>

              <span
                className={`mt-3 text-xs md:text-sm font-medium transition-colors text-center ${
                  isCurrent
                    ? "text-[#D8A46B] font-bold"
                    : isCompleted
                      ? "text-gray-200"
                      : "text-gray-500"
                }`}
              >
                {t(step.key)}
              </span>
            </div>
          );
        })}

        <div className="absolute top-5 left-0 right-0 h-1 bg-white/10 -z-0 mx-12">
          <div
            className="h-full bg-linear-to-r from-[#6F3F1C] to-[#C07A3B] transition-all duration-500 rounded-full"
            style={{
              width: `${(Math.max(0, currentIndex) / (statusKeys.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
