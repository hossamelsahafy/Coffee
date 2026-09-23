type OrderEvent = {
  userId: string;
  order: any;
};

type Listener = (event: OrderEvent) => void;

const listeners = new Map<string, Set<Listener>>();

export function subscribeToUserOrders(userId: string, listener: Listener) {
  if (!listeners.has(userId)) {
    listeners.set(userId, new Set());
  }

  listeners.get(userId)!.add(listener);

  console.log("📡 LISTENER ADDED:", {
    userId,
    listenersCount: listeners.get(userId)?.size ?? 0,
  });

  return () => {
    const userListeners = listeners.get(userId);

    if (!userListeners) return;

    userListeners.delete(listener);

    console.log("📡 LISTENER REMOVED:", {
      userId,
      listenersCount: userListeners.size,
    });

    if (userListeners.size === 0) {
      listeners.delete(userId);
    }
  };
}
export function emitOrderUpdated(userId: string, order: any) {
  const userListeners = listeners.get(userId);

  console.log("📢 emitOrderUpdated called:", {
    userId,
    orderId: order?.id,
    status: order?.status,
    paymentStatus: order?.payment?.status,
    listenersCount: userListeners?.size ?? 0,
  });

  if (!userListeners) {
    console.log("⚠️ No SSE listeners found for user:", userId);

    return;
  }

  for (const listener of userListeners) {
    listener({
      userId,
      order,
    });
  }
}
