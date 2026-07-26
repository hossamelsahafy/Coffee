import { getPayload } from "@/lib/payloadClient";
import {
  contactAdminSubject,
  contactAdminHTML,
} from "@/lib/Emails/ContactAdmin";
import { contactUserSubject, contactUserHTML } from "@/lib/Emails/contactUser";
export async function POST(req: Request) {
  const adminEmail = process.env.ADMIN_EMAIL;

  try {
    const payload = await getPayload();
    const body = await req.json();

    const { firstName, lastName, phoneNumber, email, message } = body;

    await Promise.all([
      payload.sendEmail({
        to: adminEmail,
        subject: contactAdminSubject(),
        html: contactAdminHTML({
          firstName,
          lastName,
          email,
          phoneNumber,
          message,
        }),
      }),

      payload.sendEmail({
        to: email,
        subject: contactUserSubject(),
        html: contactUserHTML({
          firstName,
        }),
      }),
    ]);
    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
