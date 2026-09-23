import { getPayload } from "@/lib/payloadClient";
import { subscribeToUserOrders } from "@/lib/OrderEvents";

export async function GET(req: Request) {
  const payload = await getPayload();

  const { user } = await payload.auth({
    headers: req.headers,
  });

  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const userId = String(user.id);
  const encoder = new TextEncoder();

  let unsubscribe: (() => void) | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(
              `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`,
            ),
          );

          return true;
        } catch (error) {
          console.error("❌ SSE send error:", error);
          return false;
        }
      };

      send("connected", {
        userId,
      });

      console.log("🔌 Orders SSE connected:", userId);

      unsubscribe = subscribeToUserOrders(userId, ({ order }) => {
        console.log("📤 Sending order update:", {
          userId,
          orderId: order.id,
          status: order.status,
          paymentStatus: order.payment?.status,
        });

        const success = send("order.updated", order);

        if (!success) {
          unsubscribe?.();
          unsubscribe = null;

          if (heartbeat) {
            clearInterval(heartbeat);
            heartbeat = null;
          }
        }
      });

      console.log("📡 Orders SSE subscribed:", userId);

      // Keep the connection alive.
      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          if (heartbeat) {
            clearInterval(heartbeat);
            heartbeat = null;
          }

          if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
          }
        }
      }, 30_000);
    },

    cancel() {
      console.log("🔌 Orders SSE connection closed:", userId);

      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }

      if (heartbeat) {
        clearInterval(heartbeat);
        heartbeat = null;
      }
    },
  });

  req.signal.addEventListener("abort", () => {
    console.log("🔌 Orders SSE request aborted:", userId);

    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
