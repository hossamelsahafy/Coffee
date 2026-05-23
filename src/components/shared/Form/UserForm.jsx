"use client";

import React, { useState } from "react";
import auth from "@/actions/auth";
import { useRouter } from "next/navigation";

const regexPatterns = {
  name: /^[A-Za-z\u0600-\u06FF\s]{2,30}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^01[0125][0-9]{8}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
};

const UserForm = ({
  header,
  locale = "en",
  inputFields,
  endpoint,
  options = {},
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const validate = () => {
    const newErrors = {};

    inputFields.forEach((field) => {
      const value = formData[field.name]?.trim();

      if (field.required && !value) {
        newErrors[field.name] = locale === "en" ? field.error : field.errorAr;
        return;
      }

      const regex = regexPatterns[field.validationType];

      if (regex && value && !regex.test(value)) {
        newErrors[field.name] = locale === "en" ? field.error : field.errorAr;
      }
    });

    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setApiError("");
    setSuccess("");

    try {
      const payload = { ...formData };

      await auth(payload, endpoint, options);

      if (endpoint === "users/login") {
        setSuccess(
          locale === "en"
            ? "Login successful! Redirecting..."
            : "تم تسجيل الدخول بنجاح! جاري التحويل...",
        );

        setTimeout(() => {
          router.push(`/${locale}/users/account`);
        }, 2000);
      } else {
        setSuccess(
          locale === "en"
            ? "Account created successfully! Please check your email to verify your account."
            : "تم إنشاء الحساب بنجاح! يرجى التحقق من البريد الإلكتروني لتفعيل الحساب.",
        );
        setTimeout(() => {
          router.push(`/${locale}/users/login`);
        }, 10000);
      }

      setTimeout(() => setSuccess(""), 10000);
    } catch (err) {
      if (endpoint === "users/login") {
        if (
          err?.errors?.[0]?.message ===
          "Please verify your email before logging in."
        ) {
          setApiError(
            locale === "en"
              ? "Please verify your email before logging in."
              : "يرجى تفعيل البريد الإلكتروني قبل تسجيل الدخول.",
          );
        } else {
          setApiError(
            locale === "en"
              ? "Email or password is incorrect"
              : "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          );
        }
      } else {
        setApiError(
          locale === "en"
            ? err?.error?.en || "Something went wrong"
            : err?.error?.ar || "حدث خطأ ما",
        );
      }

      setTimeout(() => setApiError(""), 10000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const firstName = inputFields.find((f) => f.name === "firstName");
  const lastName = inputFields.find((f) => f.name === "lastName");
  const restFields = inputFields.filter(
    (f) => f.name !== "firstName" && f.name !== "lastName",
  );

  const renderField = (field) => (
    <div key={field.id} className="flex flex-col gap-1">
      {field.type === "select" ? (
        <select
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-base-borderTwo bg-base-lighter text-base-nav outline-none"
        >
          <option value="">
            {locale === "en" ? field.placeholder : field.placeholderAr}
          </option>

          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {locale === "en" ? option.label : option.labelAr}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          name={field.name}
          placeholder={
            locale === "en" ? field.placeholder : field.placeholderAr
          }
          value={formData[field.name] || ""}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-base-borderTwo bg-base-lighter text-base-nav outline-none"
        />
      )}

      {errors[field.name] && (
        <span className="text-sm text-base-coffe">{errors[field.name]}</span>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-xl mx-auto mt-10 bg-base-coffe/30 p-6 rounded-lg">
      <h3 className="text-2xl font-bold text-center text-base-coffe mb-6">
        {header}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          {firstName && renderField(firstName)}
          {lastName && renderField(lastName)}
        </div>

        {restFields.map(renderField)}

        <button
          type="submit"
          disabled={loading}
          className="
    mt-4 py-3 rounded-xl
    bg-base-coffe text-white font-semibold
    transition-all duration-300
    hover:bg-base-coffe/50 cursor-pointer 
    disabled:opacity-60 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
  "
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {locale === "en" ? "Submitting" : "يتم الارسال"}
            </>
          ) : locale === "en" ? (
            "Submit"
          ) : (
            "إرسال"
          )}
        </button>
        {apiError && (
          <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-600 text-center">
            {apiError}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 rounded-lg bg-green-100 text-green-700 text-center">
            {success}
          </div>
        )}
      </form>
    </div>
  );
};

export default UserForm;
