import React from "react";
import UserForm from "@/components/shared/Form/UserForm";
const page = async ({ params }) => {
  const { locale } = await params;
  const signupFields = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Your Account Email",
      placeholderAr: "البريد الإلكتروني الخاص بحسابك",
      validationType: "email",
      error: "Please enter a valid email address",
      required: true,
    },
  ];

  return (
    <div className="container-custom p-4 mt-20">
      <UserForm
        locale={locale}
        inputFields={signupFields}
        header={locale === "en" ? "Forgot Password" : "نسيت كلمة المرور"}
        endpoint={"users/forgot-password"}
        options={{ includeHeaders: true }}
      />
    </div>
  );
};

export default page;
