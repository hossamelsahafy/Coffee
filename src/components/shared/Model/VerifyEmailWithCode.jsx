"use client";
import React, { useState } from "react";
import auth from "@/actions/auth";

export const VerifyEmailWithCode = ({
  setVerifyEmailWithCodeModule,
  verifyEmailWithCodeModule,
  cancelTitle,
  verifyModuleTitle,
  verifyModuleSubtitle,
  verificationCode,
  setUpdateEmailLoading,
  setEditing,
  submit,
  pendingEmail,
  setEmail,
  locale,
}) => {
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const cancelModule = () => {
    setVerifyEmailWithCodeModule(false);
  };

  const submitCode = async () => {
    try {
      setLoading(true);
      const res = await auth({ code: code }, "auth/verify-email-change", {
        includeHeaders: true,
      });
      if (res) {
        if (setEmail && pendingEmail) {
          setEmail(pendingEmail);
        }
        setLoading(false);
        setUpdateEmailLoading(false);
        setEditing(false);

        setMessage(res.message[locale]);

        setTimeout(() => {
          setVerifyEmailWithCodeModule(false);
          setMessage("");
        }, 5000);
      }
    } catch (error) {
      setLoading(false);
      setMessage(error?.error[locale]);

      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(val);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        verifyEmailWithCodeModule
          ? "opacity-100 visible"
          : "opacity-0 invisible"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl border border-base-nav bg-highlightedProductsbg p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-300 ${
          verifyEmailWithCodeModule
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        }`}
      >
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white">{verifyModuleTitle}</h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            {verifyModuleSubtitle}
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300 text-center">
            {verificationCode}
          </label>

          <div
            className="relative flex items-center justify-center gap-3 pt-2"
            dir="ltr"
          >
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={handleCodeChange}
              className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer text-center"
              autoFocus
            />

            {Array.from({ length: 6 }).map((_, index) => {
              const digit = code[index] || "";
              const isCurrent = code.length === index;

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-between w-11 h-14 rounded-xl bg-white/5 border transition-all duration-200 ${
                    isCurrent
                      ? "border-[#D8A46B] shadow-[0_0_12px_rgba(216,164,107,0.25)]"
                      : "border-base-nav"
                  }`}
                >
                  <span className="flex-1 flex items-center justify-center text-xl font-bold text-white">
                    {digit}
                  </span>

                  <div
                    className={`w-5 h-[2px] mb-2.5 rounded-full transition-all duration-200 ${
                      digit
                        ? "bg-[#D8A46B]"
                        : isCurrent
                          ? "bg-[#D8A46B]/80 animate-pulse"
                          : "bg-white/20"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {message && (
          <div className="mt-5 rounded-xl border border-[#D8A46B]/30 bg-[#D8A46B]/10 px-4 py-3 text-center text-sm text-[#D8A46B]">
            {message}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={cancelModule}
            className="flex-1 rounded-xl border border-base-nav py-3 font-medium text-gray-300 transition-all duration-300 hover:border-[#D8A46B] hover:text-white"
          >
            {cancelTitle}
          </button>

          <button
            type="button"
            disabled={loading || code.length < 6}
            onClick={submitCode}
            className="flex-1 rounded-xl bg-[#D8A46B] py-3 font-semibold text-[#1C120D] transition-all duration-300 hover:bg-[#E3B57D] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center text-center justify-center gap-2">
                <p>{submit}</p>
                <span className=" w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin"></span>
              </div>
            ) : (
              submit
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
