import { getPayload } from "@/lib/payloadClient";
import { clearAuthCookie } from "@/lib/removeCookies/Logout";

export async function DELETE(req: Request) {
  const payload = await getPayload();

  const { user } = await payload.auth({
    headers: req.headers,
  });

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const activeOrders = await payload.find({
    collection: "orders",
    where: {
      user: {
        equals: user.id,
      },
      status: {
        in: ["pending", "processing", "shipped"],
      },
    },
    overrideAccess: true,
  });

  if (activeOrders.totalDocs > 0) {
    return Response.json(
      {
        message: "You cannot delete your account while you have active orders.",
      },
      { status: 400 },
    );
  }

  try {
    await payload.delete({
      collection: "users",
      id: user.id,
    });

    await clearAuthCookie();

    return Response.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    return Response.json(
      { message: "Failed to delete account" },
      { status: 500 },
    );
  }
}
