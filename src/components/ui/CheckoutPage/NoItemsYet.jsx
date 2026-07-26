import React from "react";

const NoItemsYet = ({ locale, text, textAr }) => {
  return (
    <div className="container-custom p-4 relative">
      <div className="flex flex-col justify-center items-center bg-base-coffe/10 border border-base-border rounded-2xl p-5">
        <p className="text-xl font-bold items-center">
          {locale === "en" ? text : textAr}
        </p>
      </div>
    </div>
  );
};

export default NoItemsYet;
