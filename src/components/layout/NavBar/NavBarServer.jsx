import React from "react";
import NavBar from "./NavBar";
import GetAllData from "@/actions/GetAllData";
const NavBarServer = async ({ locale }) => {
  const CategoriesData = await GetAllData("categories");
  return (
    <div>
      <NavBar locale={locale} data={CategoriesData} />
    </div>
  );
};

export default NavBarServer;
