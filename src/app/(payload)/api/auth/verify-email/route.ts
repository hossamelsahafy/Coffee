import { getPayload } from "@/lib/payloadClient";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyEmailHTML, verifyEmailSubject } from "@/lib/Emails/VerifyEmail";

export async function POST(req: Request) {
  try {
    const payload = await getPayload();
    const body = await req.json();

    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          error: {
            en: "Email is required",
            ar: "البريد الإلكتروني مطلوب",
          },
        },
        { status: 400 },
      );
    }

    // find user
    const users = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    });

    const user = users.docs[0];

    if (!user) {
      return NextResponse.json(
        {
          message: {
            en: "If the email exists, a verification email has been sent",
            ar: "إذا كان البريد موجودًا، تم إرسال رابط التفعيل",
          },
        },
        { status: 200 },
      );
    }

    if (user._verified) {
      return NextResponse.json(
        {
          error: {
            en: "Account already verified",
            ar: "تم تفعيل الحساب بالفعل",
          },
        },
        { status: 400 },
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    await payload.update({
      collection: "users",
      id: user.id,
      data: {
        _verificationToken: token,
      },
    });

    await payload.sendEmail({
      to: user.email,
      subject: verifyEmailSubject(),
      html: verifyEmailHTML({
        token: token,
        user,
      }),
    });

    return NextResponse.json(
      {
        message: {
          en: "Verification email sent successfully",
          ar: "تم إرسال بريد التفعيل بنجاح",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("verify resend error:", error);

    return NextResponse.json(
      {
        error: {
          en: "Something went wrong",
          ar: "حدث خطأ ما",
        },
      },
      { status: 500 },
    );
  }
}
