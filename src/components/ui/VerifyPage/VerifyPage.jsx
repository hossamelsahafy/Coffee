"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import auth from "@/actions/auth";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const locale = params.locale;
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await auth({}, `users/verify/${token}`, {
          includeHeaders: true,
        });

        setStatus("success");

        setTimeout(() => {
          router.push(`/${locale}/users/login`);
        }, 2000);
      } catch (err) {
        setStatus("error");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, locale, router]);

  return (
    <div className="container-custom p-4 flex text-center items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-base-CopffeeLight border border-base-borderTwo rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-base-coffe mb-6">
          ☕ Coffee Store
        </h1>

        {status === "loading" && (
          <>
            <div className="w-10 h-10 border-4 border-base-coffe border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-base-nav">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <p className="text-base-coffe text-lg font-semibold">
              Email verified successfully !
            </p>

            <p className="text-base-nav mt-2 text-sm">
              Redirecting to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-base-coffe font-semibold">
              Verification link is invalid or expired
            </p>

            <button
              onClick={() => router.push(`/${locale}/users/login`)}
              className="mt-5 px-5 py-3 rounded-xl bg-base-coffe text-white hover:opacity-90 transition"
            >
              Go To Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
