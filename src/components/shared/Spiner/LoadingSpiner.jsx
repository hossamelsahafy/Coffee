import React from "react";

const LoadingSpiner = ({ customBorder }) => {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 ${customBorder ? customBorder : "border-base-light"} border-t-transparent ml-2`}
    />
  );
};

export default LoadingSpiner;
