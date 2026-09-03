import { cache } from "react";
import GetDataBySlug from "@/actions/GetDataBySlug";

export const GetDataBySlugCache = cache(async (slug, slugName, locale) => {
  return GetDataBySlug(slug, slugName, locale);
});
