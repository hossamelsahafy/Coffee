"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TextAnimation = ({ locale, data }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = data[index];

  return (
    <div className="h-60 flex flex-col justify-center items-center gap-2 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <p className="text-base lg:text-xl font-bold tracking-tighter">
            {locale === "ar" ? current.heroAr : current.hero}
          </p>
          <p className="text-2xl max-w-lg my-4 lg:text-5xl font-extrabold">
            {locale === "ar" ? current.titleAr : current.title}
          </p>
          <p className="max-w-xl text-md font-semibold">
            {locale === "ar" ? current.subTitleAr : current.subTitle}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TextAnimation;
