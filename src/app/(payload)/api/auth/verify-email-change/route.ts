import { getPayload } from "@/lib/payloadClient";

export async function POST(req: Request) {
  try {
    const payload = await getPayload();

    const { user: authedUser } = await payload.auth({
      headers: req.headers,
    });

    if (!authedUser) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { code } = body as { code?: string };

    if (!code || code.length !== 6) {
      return Response.json(
        {
          error: {
            en: "Please enter a valid 6-digit verification code",
            ar: "يرجى إدخال رمز تحقق صالح مكون من 6 أرقام",
          },
        },
        { status: 400 },
      );
    }

    const user = await payload.findByID({
      collection: "users",
      id: authedUser.id,
    });

    if (!user || user.pendingEmailToken !== code) {
      return Response.json(
        {
          error: {
            en: "Invalid verification code",
            ar: "رمز التحقق غير صحيح",
          },
        },
        { status: 400 },
      );
    }

    if (
      user.pendingEmailTokenExpiresAt &&
      new Date(user.pendingEmailTokenExpiresAt) < new Date()
    ) {
      return Response.json(
        {
          error: {
            en: "Verification code has expired. Please request a new one.",
            ar: "انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد.",
          },
        },
        { status: 400 },
      );
    }

    if (!user.pendingEmail) {
      return Response.json(
        {
          error: {
            en: "No pending email change found",
            ar: "لا يوجد تغيير بريد إلكتروني معلق",
          },
        },
        { status: 400 },
      );
    }

    await payload.update({
      collection: "users",
      id: user.id,
      data: {
        email: user.pendingEmail,
        pendingEmail: null,
        pendingEmailToken: null,
        pendingEmailTokenExpiresAt: null,
      },
    });

    return Response.json({
      message: {
        en: "Email updated successfully",
        ar: "تم تحديث البريد الإلكتروني بنجاح",
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json(
      {
        error: {
          en: "An unexpected error occurred during verification.",
          ar: "حدث خطأ غير متوقع أثناء عملية التحقق.",
        },
      },
      { status: 500 },
    );
  }
}
