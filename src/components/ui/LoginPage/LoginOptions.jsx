import React from "react";
import Link from "next/link";
import { BadgeCheck, KeyRound, UserPlus } from "lucide-react";

const LoginOptions = ({ locale }) => {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/users/forget-password"
          className="
            group flex items-center gap-3
            rounded-2xl border border-base-coffe/10
            bg-base-coffe/50 backdrop-blur-sm
            px-4 py-3
            transition-all duration-300
            hover:border-base-coffe/30
            hover:bg-base-coffe/5
            hover:-translate-y-0.5
          "
        >
          <div
            className="
              flex items-center justify-center
              w-10 h-10 rounded-xl
              bg-base-coffe/10 text-base-coffe
              transition-all duration-300
              group-hover:bg-base-coffe
              group-hover:text-white
            "
          >
            <KeyRound size={18} />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-base-CopffeeLight">
              {locale === "en" ? "Forgot Password" : "نسيت كلمة المرور"}
            </span>

            <span className="text-xs text-base-CopffeeLight">
              {locale === "en"
                ? "Reset your account password"
                : "إعادة تعيين كلمة المرور"}
            </span>
          </div>
        </Link>

        <Link
          href="/users/verify-email"
          className="
            group flex items-center gap-3
            rounded-2xl border border-base-coffe/10
            bg-base-coffe/50 backdrop-blur-sm
            px-4 py-3
            transition-all duration-300
            hover:border-base-coffe/30
            hover:bg-base-coffe/5
            hover:-translate-y-0.5
          "
        >
          <div
            className="
              flex items-center justify-center
              w-10 h-10 rounded-xl
              bg-base-coffe/10 text-base-coffe
              transition-all duration-300
              group-hover:bg-base-coffe
              group-hover:text-white
            "
          >
            <BadgeCheck size={18} />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-base-CopffeeLight">
              {locale === "en" ? "Verify Account" : "تأكيد الحساب"}
            </span>

            <span className="text-xs text-base-CopffeeLight">
              {locale === "en" ? "Activate your account" : "تفعيل الحساب"}
            </span>
          </div>
        </Link>
      </div>

      <div
        className="
          flex items-center justify-center gap-2
          rounded-2xl
          border border-dashed border-base-coffe/20
          bg-base-coffe/5
          px-4 py-4
          text-sm
        "
      >
        <UserPlus size={18} className="text-base-coffe" />

        <span className="text-base-CopffeeLight">
          {locale === "en" ? "Don't have an account?" : "ليس لديك حساب؟"}
        </span>

        <Link
          href="/users/signup"
          className="
            font-semibold text-base-coffe
            hover:underline underline-offset-4
          "
        >
          {locale === "en" ? "Sign up" : "إنشاء حساب"}
        </Link>
      </div>
    </div>
  );
};

export default LoginOptions;
