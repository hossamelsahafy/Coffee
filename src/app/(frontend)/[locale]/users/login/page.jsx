import React from "react";
import UserForm from "@/components/shared/Form/UserForm";
const page = async ({ params }) => {
  const { locale } = await params;
  const signupFields = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      placeholderAr: "البريد الإلكتروني",
      validationType: "email",
      error: "Please enter a valid email address",
      required: true,
    },

    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      placeholderAr: "كلمة المرور",
      required: true,
    },
  ];

  return (
    <div className="container-custom p-4 mt-20">
      <UserForm
        locale={locale}
        inputFields={signupFields}
        header={locale === "en" ? "Login" : "تسجيل الدخول"}
        endpoint={"users/login"}
        options={{ includeHeaders: true }}
      />
    </div>
  );
};

export default page;
