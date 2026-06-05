import { getPayload } from "@/lib/payloadClient";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export async function POST(req: Request) {
  try {
    const payload = await getPayload();
    const body = await req.json();

    const { email, password, firstName, lastName, phoneNumber, gender } = body;

    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Invalid email format", errorAr: "" },
        { status: 400 },
      );
    }

    if (!passwordRegex.test(password)) {
      return Response.json(
        {
          error:
            "Password must be at least 8 chars, include uppercase, lowercase, number and special character",
        },
        { status: 400 },
      );
    }

    const existingEmail = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    });
    const existedPhoneNumber = await payload.find({
      collection: "users",
      where: {
        phoneNumber: {
          equals: phoneNumber,
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

    const user = await payload.create({
      collection: "users",
      data: {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        gender,
        role: "user",
      },
    });

    return Response.json(
      {
        message: "User Created Successfully",
        user,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return Response.json(
      {
        error: err.message || "Internal Server Error",
      },
      { status: 400 },
    );
  }
}
