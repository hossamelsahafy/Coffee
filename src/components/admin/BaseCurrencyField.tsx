"use client";

import React from "react";
import { FieldLabel, TextInput, useField } from "@payloadcms/ui";

export default function BaseCurrencyField() {
  const { value, setValue } = useField<string>({
    path: "currency.baseCurrency",
  });

  const currentValue = String(value || "").toUpperCase();

  return (
    <div className="field-type text">
      <FieldLabel label="Base Currency" path="currency.baseCurrency" />

      <TextInput
        value={currentValue}
        onChange={(event) => {
          setValue(event.target.value.toUpperCase());
        }}
      />

      <p className="mt-2 text-sm text-gray-500">
        Main currency used for product prices and currency conversions.
      </p>
    </div>
  );
}
