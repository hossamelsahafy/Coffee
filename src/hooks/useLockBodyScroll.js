"use client";
import { useEffect } from "react";

const useLockBodyScroll = (isLocked) => {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isLocked) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
    }

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [isLocked]);
};

export default useLockBodyScroll;
