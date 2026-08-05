/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import { NextIntlClientProvider } from "next-intl";
import config from "@payload-config";
import "@payloadcms/next/css";
import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import React from "react";
import { UserProvider } from "@/Context/userContext.jsx";
import { DashboardProvider } from "@/Context/DashboardContext.jsx";
import { getUser } from "@/actions/getUser.js";
import { importMap } from "./admin/importMap.js";
import "./custom.css";

type Args = {
  children: React.ReactNode;
};
const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = async ({ children }: Args) => {
  const user = await getUser();
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      <NextIntlClientProvider>
        <UserProvider initialUser={user}>
          <DashboardProvider>{children}</DashboardProvider>
        </UserProvider>
      </NextIntlClientProvider>
    </RootLayout>
  );
};

export default Layout;
