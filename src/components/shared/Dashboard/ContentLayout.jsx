"use client";
import React from "react";
import BreadCrumbs from "./BreadCrumb/BreadCrumb";
import { useUser } from "@/Context/userContext";
import { useDashboard } from "@/Context/DashboardContext";
const ContentLayout = ({
  locale,
  title,
  subtitle,
  MyThing,
  children,
  isdiff,
  adminRoute,
  adminFirstName,
}) => {
  const { user: frontendUser } = useUser();
  const { openSidebar } = useDashboard();

  const displayUser = adminRoute ? adminFirstName : frontendUser;
  const titleDirection = isdiff
    ? locale === "en"
      ? "justify-end flex-row-reverse"
      : "justify-start"
    : "";

  return (
    <div
      className="relative min-h-screen w-full
      bg-linear-to-b from-[#402d20] via-[#1a0f0a] to-black
      p-4 md:p-6"
    >
      <div className="relative flex flex-col items-start w-full gap-6">
        {!adminRoute && (
          <div
            className={`${!openSidebar ? "md:mx-4 mx-5 px-6 transition-all duration-300" : "transition-all duration-300"} transition-all duration-300 mt-4 md:mt-0`}
          >
            <BreadCrumbs locale={locale} />
          </div>
        )}

        <div className="relative overflow-hidden max-w-6xl rounded-3xl border border-white/10 bg-linear-to-r from-[#6F3F1C] via-[#4B2E1F] to-[#1A120D] px-6 py-8 md:px-8 shadow-2xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C07A3B]/20 blur-3xl" />
          <div className="absolute -bottom-12 left-10 h-36 w-36 rounded-full bg-[#965015]/15 blur-3xl" />

          <span className="inline-flex rounded-full border border-[#C07A3B]/30 bg-[#C07A3B]/10 px-3 py-1 text-xs font-medium text-[#E8C6A7]">
            {MyThing}
          </span>

          <h1
            className={`mt-4 flex gap-2 ${titleDirection} text-3xl md:text-4xl font-bold tracking-tight text-white`}
          >
            <p>{title}, </p>
            <span className="text-[#D8A46B]">
              {isdiff
                ? locale === "en"
                  ? `${displayUser?.firstName}'s`
                  : displayUser?.firstName
                : displayUser?.firstName}{" "}
              {isdiff ? "" : "👋"}
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-300">
            {subtitle}
          </p>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default ContentLayout;
