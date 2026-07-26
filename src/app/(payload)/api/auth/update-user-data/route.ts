import { getPayload } from "@/lib/payloadClient";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
import {
  verifyEmailChangeSubject,
  verifyEmailChangeHTML,
} from "@/lib/Emails/verifyChangedEmail";

export async function PATCH(req: Request) {
  const payload = await getPayload();
  const body = await req.json();
  const { email, firstName, lastName, phoneNumber, gender, password } =
    body as {
      email?: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      gender?: "male" | "female";
      password?: string;
    };
  let token: string | undefined;
  const { user } = await payload.auth({
    headers: req.headers,
  });
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (email && !emailRegex.test(email)) {
    return Response.json(
      {
        error: {
          en: "Invalid email format",
          ar: "صيغة البريد الإلكتروني غير صحيحة",
        },
      },
      { status: 400 },
    );
  }

  if (password && !passwordRegex.test(password)) {
    return Response.json(
      {
        error: {
          en: "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character",
          ar: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم ورمز خاص",
        },
      },
      { status: 400 },
    );
  }
  const data: Record<string, unknown> = {};

  if (firstName !== undefined) data.firstName = firstName;
  if (lastName !== undefined) data.lastName = lastName;
  if (phoneNumber !== undefined) data.phoneNumber = phoneNumber;
  if (gender !== undefined) data.gender = gender;

  if (password !== undefined) {
    data.password = password;
  }
  if (email && email !== user.email) {
    token = Math.floor(100000 + Math.random() * 900000).toString();
    const existingEmail = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existingEmail.docs.length > 0) {
      return Response.json(
        {
          error: {
            en: "Email already exists",
            ar: "البريد الإلكتروني مستخدم بالفعل",
          },
        },
        { status: 409 },
      );
    }
    data.pendingEmail = email;
    data.pendingEmailToken = token;
    data.pendingEmailTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 15);
  }
  if (phoneNumber && phoneNumber !== user.phoneNumber) {
    const existedPhoneNumber = await payload.find({
      collection: "users",
      where: {
        phoneNumber: {
          equals: phoneNumber,
        },
      },
    });

    if (existedPhoneNumber.docs.length > 0) {
      return Response.json(
        {
          error: {
            en: "PhoneNumber already exists",
            ar: "رقم الهاتف مستخدم بالفعل",
          },
        },
        { status: 409 },
      );
    }
  }
  try {
    await payload.update({
      collection: "users",
      id: user.id,
      data,
    });

    if (data.pendingEmail) {
      await payload.sendEmail({
        to: data.pendingEmail as string,
        subject: verifyEmailChangeSubject(),
        html: verifyEmailChangeHTML({
          token: token,
          user,
        }),
      });
    }

    return Response.json({
      message: {
        en: "Profile updated successfully",
        ar: "تم تحديث البيانات بنجاح",
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    return Response.json(
      {
        error: {
          en: "Something went wrong while updating your profile.",
          ar: "حدث خطأ أثناء تحديث بياناتك الشخصية.",
        },
      },
      { status: 500 },
    );
  }
}
