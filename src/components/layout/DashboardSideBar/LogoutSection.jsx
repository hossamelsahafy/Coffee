"use client";
import React from "react";
import { IoLogOut } from "react-icons/io5";

const LogoutSection = ({ locale, setOpenModule }) => {
  return (
    <div className="p-4 flex items-center mb-2 justify-center">
      <button
        onClick={() => setOpenModule(true)}
        className="flex flex-row-reverse items-center gap-2 hover:text-base-lighter transition duration-300 text-lg font-bold cursor-pointer"
      >
        {locale === "en" ? "Logout" : "تسجيل الخروج"}
        <span>
          <IoLogOut className="font-bold text-lg" />
        </span>
      </button>
    </div>
  );
};

export default LogoutSection;
