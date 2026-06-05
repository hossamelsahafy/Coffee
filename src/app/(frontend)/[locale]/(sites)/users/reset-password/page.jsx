import React from "react";
import UserForm from "@/components/shared/Form/UserForm";
const page = async ({ params }) => {
  const { locale } = await params;

  const signupFields = [
    {
      id: 6,
      name: "password",
      type: "password",
      placeholder: "Password",
      placeholderAr: "كلمة المرور",
      validationType: "password",
      error:
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
      errorAr:
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير وصغير ورقم ورمز خاص",
      required: true,
    },
  ];

  return (
    <div className="container-custom p-4 mt-20">
      <UserForm
        locale={locale}
        inputFields={signupFields}
        header={locale === "en" ? "Reset Password" : "اعادة ضبط كلمة المرور"}
        endpoint={"users/reset-password"}
        options={{ includeHeaders: true }}
      />
    </div>
  );
};

export default page;
