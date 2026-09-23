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

  return () => {
    const userListeners = listeners.get(userId);

    if (!userListeners) return;

    userListeners.delete(listener);

    if (userListeners.size === 0) {
      listeners.delete(userId);
    }
  };
}

export function emitOrderUpdated(userId: string, order: any) {
  const userListeners = listeners.get(userId);

  if (!userListeners) return;

  for (const listener of userListeners) {
    listener({
      userId,
      order,
    });
  }
}
