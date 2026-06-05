import React from "react";
import UserForm from "@/components/shared/Form/UserForm";
const page = async ({ params }) => {
  const { locale } = await params;
  const signupFields = [
    {
      id: 1,
      name: "firstName",
      type: "text",
      placeholder: "First Name",
      placeholderAr: "الاسم الأول",
      validationType: "name",
      error:
        "First name must contain only letters and be at least 2 characters",
      errorAr: "الاسم الأول يجب أن يحتوي على حروف فقط ويكون حرفين على الأقل",
      required: true,
    },

    {
      id: 2,
      name: "lastName",
      type: "text",
      placeholder: "Last Name",
      placeholderAr: "اسم العائلة",
      validationType: "name",
      error: "Last name must contain only letters and be at least 2 characters",
      errorAr: "اسم العائلة يجب أن يحتوي على حروف فقط ويكون حرفين على الأقل",
      required: true,
    },

    {
      id: 3,
      name: "gender",
      type: "select",
      placeholder: "Select Gender",
      placeholderAr: "اختر النوع",
      options: [
        {
          value: "male",
          label: "Male",
          labelAr: "ذكر",
        },
        {
          value: "female",
          label: "Female",
          labelAr: "أنثى",
        },
      ],
      required: true,
      error: "Please select gender",
      errorAr: "يرجى اختيار النوع",
    },

    {
      id: 4,
      name: "phoneNumber",
      type: "text",
      placeholder: "Phone Number",
      placeholderAr: "رقم الهاتف",
      validationType: "phone",
      error: "Phone number must be a valid Egyptian phone number",
      errorAr: "رقم الهاتف يجب أن يكون رقم مصري صحيح",
      required: true,
    },

    {
      id: 5,
      name: "email",
      type: "email",
      placeholder: "Email",
      placeholderAr: "البريد الإلكتروني",
      validationType: "email",
      error: "Please enter a valid email address",
      errorAr: "يرجى إدخال بريد إلكتروني صحيح",
      required: true,
    },

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
        header={locale === "en" ? "Create New Account" : "انشاء حساب جديد"}
        endpoint={"auth/signup"}
      />
    </div>
  );
};

export default page;
