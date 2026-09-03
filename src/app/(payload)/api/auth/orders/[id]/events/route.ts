import { getPayload } from "@/lib/payloadClient";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const { id } = await params;

  const payload = await getPayload();

  const { user } = await payload.auth({
    headers: req.headers,
  });

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await payload.find({
    collection: "orders",
    where: {
      and: [{ id: { equals: id } }, { user: { equals: user.id } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    user,
  });

  const order = result.docs[0];

  if (!order) {
    return new Response("Order not found", { status: 404 });
  }

  console.log("SSE order ID:", order.id);
  console.log("SSE user ID:", user.id);
  console.log("SSE order:", order);

  const encoder = new TextEncoder();

  let interval: ReturnType<typeof setInterval> | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  let lastUpdatedAt = order.updatedAt;
  let lastPaymentStatus = order.payment?.status;
  let lastOrderStatus = order.status;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(
              `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`,
            ),
          );

          return true;
        } catch {
          return false;
        }
      };

      send("connected", {
        orderId: order.id,
      });

      interval = setInterval(async () => {
        try {
          const currentResult = await payload.find({
            collection: "orders",
            where: {
              and: [{ id: { equals: id } }, { user: { equals: user.id } }],
            },
            limit: 1,
            depth: 0,
            overrideAccess: false,
            user,
          });

          const currentOrder = currentResult.docs[0];

          if (!currentOrder) {
            return;
          }

          const updatedAtChanged = currentOrder.updatedAt !== lastUpdatedAt;

          const paymentStatusChanged =
            currentOrder.payment?.status !== lastPaymentStatus;

          const orderStatusChanged = currentOrder.status !== lastOrderStatus;

          if (updatedAtChanged || paymentStatusChanged || orderStatusChanged) {
            console.log("📡 SSE ORDER CHANGE DETECTED:", {
              orderId: currentOrder.id,
              previousPaymentStatus: lastPaymentStatus,
              newPaymentStatus: currentOrder.payment?.status,
              previousStatus: lastOrderStatus,
              newStatus: currentOrder.status,
            });

            lastUpdatedAt = currentOrder.updatedAt;
            lastPaymentStatus = currentOrder.payment?.status;
            lastOrderStatus = currentOrder.status;

            const success = send("order.updated", currentOrder);

            if (!success) {
              if (interval) clearInterval(interval);
              if (heartbeat) clearInterval(heartbeat);
            }
          }
        } catch (error) {
          console.error("SSE polling error:", error);
        }
      }, 1000);

      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          if (interval) clearInterval(interval);
          if (heartbeat) clearInterval(heartbeat);
        }
      }, 15000);
    },

    cancel() {
      console.log("🔌 SSE connection closed:", id);

      if (interval) {
        clearInterval(interval);
      }

      if (heartbeat) {
        clearInterval(heartbeat);
      }
    },
  });

  req.signal.addEventListener("abort", () => {
    console.log("🔌 SSE request aborted:", id);

    if (interval) {
      clearInterval(interval);
    }

    if (heartbeat) {
      clearInterval(heartbeat);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
