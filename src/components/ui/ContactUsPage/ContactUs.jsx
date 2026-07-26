import React from "react";
import UserForm from "@/components/shared/Form/UserForm";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import Link from "next/link";
const ContactUs = ({ data, locale }) => {
  const labels = {
    callUs: locale === "en" ? "Call Us" : "اتصل بنا",
    address: locale === "en" ? "Address" : "العنوان",
    email: locale === "en" ? "Email" : "البريد الإلكتروني",
    title: locale === "en" ? "Contact Form" : "نموذج التواصل",
  };

  const address = locale === "en" ? data.address : data.addressAr;
  const EmailFields = [
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
      name: "message",
      type: "textarea",
      placeholder: "Enter Your Messagge ...",
      placeholderAr: "ادخل رسالتك هنا ...",
      validationType: "message",
      error: "Message must be between 10 and 500 characters",
      errorAr: "يجب أن تكون الرسالة بين 10 و 500 حرف",
      required: true,
    },
  ];
  return (
    <div className="container-custom p-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between w-full items-start md:items-center">
        <div className="flex flex-col justify-start items-start gap-2 md:w-1/2">
          <div className="flex flex-row justify-between gap-4 w-full">
            <div className="flex flex-col justify-start">
              <h2 className="text-base-dark text-2xl font-bold">
                {locale === "en" ? "Contact Info" : "معلومات التواصل"}
              </h2>
              <p className="text-base-dark font-bold mt-2 text-lg flex items-center gap-2">
                <FaPhone />
                {labels.callUs}
              </p>
              <p className="text-base-darker font-semibold">
                {data.PhoneNumber}
              </p>

              <p className="text-base-dark font-bold text-lg mt-2 flex items-center gap-2">
                <MdEmail />
                {labels.email}
              </p>
              <p className="font-semibold text-base-darker">{data.email}</p>

              <p className="text-base-dark font-bold text-lg mt-2 flex items-center gap-2">
                <IoLocationSharp />
                {labels.address}
              </p>
              <p className="max-w-xs text-start text-base-darker font-semibold">
                {address}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base-dark font-bold text-2xl">
                {locale === "ar" ? "السياسات" : "Policies"}
              </h3>
              <Link
                href={`/${locale}/shipping-policy`}
                className="text-base-darker font-semibold hover:underline"
              >
                {locale === "ar" ? "سياسة الشحن" : "Shipping Policy"}
              </Link>

              <Link
                href={`/${locale}/refund-policy`}
                className="text-base-darker font-semibold hover:underline"
              >
                {locale === "ar" ? "سياسة الاسترجاع" : "Refund Policy"}
              </Link>

              <Link
                href={`/${locale}/privacy-policy`}
                className="text-base-darker font-semibold hover:underline"
              >
                {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
              </Link>

              <Link
                href={`/${locale}/terms-and-conditions`}
                className="text-base-darker font-semibold hover:underline"
              >
                {locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mb-7 w-full md:w-1/2">
          <UserForm
            header={labels.title}
            locale={locale}
            inputFields={EmailFields}
            Darker={"bg-base-darker"}
            endpoint="/send-email"
          />
        </div>
      </div>
      <iframe
        width="100%"
        height="300"
        loading="lazy"
        className="rounded-lg"
        src={`${data.locationIframe}&output=embed`}
      />
    </div>
  );
};

export default ContactUs;
