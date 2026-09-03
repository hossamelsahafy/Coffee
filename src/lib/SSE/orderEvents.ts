type OrderEvent = {
  type: "order.updated";

  orderId: string;

  orderNumber: string;

  status: string;

  paymentStatus?: string;

  paymentMethod?: string;

  total?: number;
};

type Subscriber = (event: OrderEvent) => void;

const subscribers = new Map<string, Set<Subscriber>>();

export function subscribeToOrder(orderId: string, subscriber: Subscriber) {
  let orderSubscribers = subscribers.get(orderId);

  if (!orderSubscribers) {
    orderSubscribers = new Set();

    subscribers.set(orderId, orderSubscribers);
  }

  orderSubscribers.add(subscriber);

  return () => {
    orderSubscribers?.delete(subscriber);

    if (orderSubscribers && orderSubscribers.size === 0) {
      subscribers.delete(orderId);
    }
  };
}

export function emitOrderEvent(orderId: string, event: OrderEvent) {
  const orderSubscribers = subscribers.get(orderId);

  if (!orderSubscribers) {
    return;
  }

  for (const subscriber of orderSubscribers) {
    subscriber(event);
  }
}
