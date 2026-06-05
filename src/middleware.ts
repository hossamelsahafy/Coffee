import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const authPages = [
  "/users/login",
  "/users/signup",
  "/users/verify-email",
  "/users/forget-password",
  "/users/reset-password",
];

const protectedPages = ["/users/account", "/users/cart", "/users/checkout"];

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const segments = pathname.split("/");
  const locale = segments[1];

  const pathWithoutLocale = "/" + segments.slice(2).join("/");

  const token = req.cookies.get("payload-token")?.value;
  const isLoggedIn = !!token;

  const isAuthPage = authPages.some((p) => pathWithoutLocale.startsWith(p));

  const isProtectedPage = protectedPages.some((p) =>
    pathWithoutLocale.startsWith(p),
  );

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}/users/account`, req.url));
  }

  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(new URL(`/${locale}/users/login`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|admin|payload|.*\\..*).*)"],
};
