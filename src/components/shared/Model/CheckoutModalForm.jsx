import React from "react";
import UserForm from "@/components/shared/Form/UserForm";
const CheckoutModalForm = ({ data, locale }) => {
  const cityOptions = data?.map((zone) => ({
    value: zone.cityName,
    label: zone.cityName,
    labelAr: zone.cityNameAr,
    shippingPrice: zone.shippingPrice,
  }));
  console.log(cityOptions);

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
      name: "city",
      type: "select",
      placeholder: "Select City",
      placeholderAr: "اختر المدينة",
      options: cityOptions,
      required: true,
      error: "Please select city",
      errorAr: "يرجى اختيار المدينة",
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
  ];

  return (
    <UserForm
      locale={locale}
      inputFields={signupFields}
      header={locale === "en" ? "Checkout" : "تاكيد الشراء"}
      endpoint={"auth/order"}
      options={{ includeHeaders: true }}
    />
  );
};

export default CheckoutModalForm;
