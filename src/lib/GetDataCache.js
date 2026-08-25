import { cache } from "react";
import GetAllData from "@/actions/GetAllData";

export const getDataCache = cache(async (slug) => {
  return GetAllData(slug, true);
});
