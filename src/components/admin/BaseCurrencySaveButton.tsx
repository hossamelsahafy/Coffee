"use client";

import React, { useState } from "react";
import { Button, useForm, useFormFields } from "@payloadcms/ui";

export default function BaseCurrencySaveButton() {
  const { submit } = useForm();

  const [showModal, setShowModal] = useState(false);

  const baseCurrency = useFormFields(([fields]) => {
    return fields["currency.baseCurrency"];
  });

  const originalValue = String(baseCurrency?.initialValue || "")
    .trim()
    .toUpperCase();

  const currentValue = String(baseCurrency?.value || "")
    .trim()
    .toUpperCase();

  const hasChanged =
    Boolean(originalValue) &&
    Boolean(currentValue) &&
    originalValue !== currentValue;

  const handleSave = () => {
    if (hasChanged) {
      setShowModal(true);
      return;
    }

    submit();
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    setShowModal(false);

    submit();
  };

  return (
    <>
      <Button type="button" onClick={handleSave} buttonStyle="secondary">
        Save Changes
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl bg-base-coffe p-6 shadow-2xl dark:bg-[#1f1f1f]">
            <div className="mb-5">
              <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                !
              </div>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Change Base Currency?
              </h2>
            </div>

            <div className="space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              <p>
                You are changing the base currency from{" "}
                <strong className="font-semibold text-gray-900 dark:text-white">
                  {originalValue}
                </strong>{" "}
                to{" "}
                <strong className="font-semibold text-gray-900 dark:text-white">
                  {currentValue}
                </strong>
                .
              </p>

              <p>
                Your product prices are currently stored using{" "}
                <strong>{originalValue}</strong>.
              </p>

              <p>
                Changing the base currency requires converting all existing
                product prices to the new currency.
              </p>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                <strong>Important:</strong> This change may affect all existing
                product prices.
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                buttonStyle="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                type="button"
                buttonStyle="secondary"
                onClick={handleConfirm}
              >
                Continue & Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
