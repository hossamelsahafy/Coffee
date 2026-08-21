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
    title: locale === "en" ? "Get in Touch" : "تواصل معنا",
    subtitle:
      locale === "en"
        ? "We'd love to hear from you. Send us a message!"
        : "نحن نسعد بتواصلك معنا. أرسل لنا رسالة!",
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
      placeholder: "Enter Your Message ...",
      placeholderAr: "ادخل رسالتك هنا ...",
      validationType: "message",
      error: "Message must be between 10 and 500 characters",
      errorAr: "يجب أن تكون الرسالة بين 10 و 500 حرف",
      required: true,
    },
  ];

  const policies = [
    {
      name: locale === "ar" ? "سياسة الشحن" : "Shipping Policy",
      path: "shipping-policy",
    },
    {
      name: locale === "ar" ? "سياسة الاسترجاع" : "Refund Policy",
      path: "refund-policy",
    },
    {
      name: locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
      path: "privacy-policy",
    },
    {
      name: locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions",
      path: "terms-and-conditions",
    },
  ];

  return (
    <div className="container-custom mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
        <div className="lg:col-span-5 space-y-8 bg-[#2C221E] backdrop-blur-md p-8 rounded-2xl border border-[#483731] shadow-2xl text-[#E6D5C3]">
          <div>
            <h2 className="text-3xl font-extrabold text-[#F7F2EB] tracking-tight">
              {locale === "en" ? "Contact Info" : "معلومات التواصل"}
            </h2>
            <p className="text-[#B59F8C] text-sm mt-1">
              {locale === "en"
                ? "Reach out to us through any of these channels."
                : "تواصل معنا عبر أي من هذه القنوات."}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-[#3E302A] text-[#D4A373] rounded-xl group-hover:bg-[#D4A373] group-hover:text-[#2C221E] transition-all duration-300">
                <FaPhone className="text-lg" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#B59F8C] uppercase tracking-wider">
                  {labels.callUs}
                </p>
                <p className="text-[#F7F2EB] font-bold text-base">
                  {data.PhoneNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-[#3E302A] text-[#D4A373] rounded-xl group-hover:bg-[#D4A373] group-hover:text-[#2C221E] transition-all duration-300">
                <MdEmail className="text-lg" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#B59F8C] uppercase tracking-wider">
                  {labels.email}
                </p>
                <p className="text-[#F7F2EB] font-bold text-base">
                  {data.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-[#3E302A] text-[#D4A373] rounded-xl group-hover:bg-[#D4A373] group-hover:text-[#2C221E] transition-all duration-300">
                <IoLocationSharp className="text-lg" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#B59F8C] uppercase tracking-wider">
                  {labels.address}
                </p>
                <p className="text-[#F7F2EB] font-semibold text-sm leading-relaxed">
                  {address}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-[#483731]" />

          <div>
            <h3 className="text-xl font-bold text-[#F7F2EB] mb-4">
              {locale === "ar" ? "السياسات" : "Policies"}
            </h3>
            <ul className="grid grid-cols-2 gap-3">
              {policies.map((policy, index) => (
                <li key={index}>
                  <Link
                    href={`/${locale}/${policy.path}`}
                    className="text-sm text-[#B59F8C] hover:text-[#D4A373] font-medium transition-colors inline-flex items-center gap-1 hover:underline"
                  >
                    {policy.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#2C221E] backdrop-blur-md p-4 rounded-2xl border border-[#483731] shadow-2xl text-[#E6D5C3]">
          <div className="">
            <h3 className="text-2xl font-bold text-[#F7F2EB]">
              {labels.title}
            </h3>
            <p className="text-[#B59F8C] text-sm mt-1">{labels.subtitle}</p>
            <UserForm
              header=""
              locale={locale}
              inputFields={EmailFields}
              Darker={"bg-transparent"}
              endpoint="/send-email"
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-2xl shadow-2xl border border-[#483731]">
        <iframe
          width="100%"
          height="400"
          loading="lazy"
          className="w-full border-0"
          src={`${data.locationIframe}&output=embed`}
        />
      </div>
    </div>
  );
};

export default ContactUs;
