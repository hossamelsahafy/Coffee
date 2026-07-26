"use client";

import { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export function GlassyToast({
  message,
  type = "success",
  onClose,
  duration = 5000,
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg shadow-black/10 text-white text-sm font-medium">
        {type === "success" ? (
          <FaCheckCircle className="text-base-lighter text-lg shrink-0" />
        ) : (
          <FaExclamationCircle className="text-base-lighter text-lg shrink-0" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}
