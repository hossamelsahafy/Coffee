export default function processOrderData(
  orders: Array<{ createdAt: string; total: number | string }>,
) {
  const aggregatedMap = new Map<
    string,
    { date: string; spent: number; orders: number }
  >();

  orders.forEach((order) => {
    const dateKey = new Date(order.createdAt).toISOString().split("T")[0];
    const amount = Number(order.total) || 0;

    if (aggregatedMap.has(dateKey)) {
      const existing = aggregatedMap.get(dateKey)!;
      existing.spent += amount;
      existing.orders += 1;
    } else {
      aggregatedMap.set(dateKey, {
        date: dateKey,
        spent: amount,
        orders: 1,
      });
    }
  });

  return Array.from(aggregatedMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}
