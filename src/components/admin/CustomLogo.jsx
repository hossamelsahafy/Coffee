import React from "react";

const CustomLogo = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      <img
        src="/assets/logo.webp"
        alt="Custom Logo"
        style={{ width: "150px", height: "auto" }}
      />
    </div>
  );
};
export default CustomLogo;
