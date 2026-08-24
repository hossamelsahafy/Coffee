import { NextResponse } from "next/server";
import { getPayload } from "@/lib/payloadClient";
import { pusherServer } from "@/lib/Pusher";

export async function POST(req: Request) {
  try {
    const payload = await getPayload();

    const { user } = await payload.auth({
      headers: req.headers,
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);

    const socketId = params.get("socket_id");
    const channelName = params.get("channel_name");

    if (!socketId || !channelName) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 },
      );
    }

    if (!channelName.startsWith("private-order-")) {
      return NextResponse.json({ error: "Invalid channel" }, { status: 403 });
    }

    const orderId = channelName.replace("private-order-", "");

    const result = await payload.find({
      collection: "orders",
      where: {
        and: [
          {
            id: {
              equals: orderId,
            },
          },
          {
            user: {
              equals: user.id,
            },
          },
        ],
      },
      limit: 1,
      depth: 0,
    });

    if (!result.docs.length) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channelName);

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
