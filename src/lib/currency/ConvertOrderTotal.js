export const convertOrderTotal = (order) => {
  const amount = Number(order.total) || 0;

  const orderCurrency = order.currency?.toUpperCase();
  const baseCurrency = order.baseCurrency?.toUpperCase();

  if (!amount || !orderCurrency || !baseCurrency) {
    return 0;
  }

  // Order is already in base currency
  if (orderCurrency === baseCurrency) {
    return amount;
  }

  const historicalRate = Number(order.exchangeRate);

  if (!Number.isFinite(historicalRate) || historicalRate <= 0) {
    return 0;
  }

  // exchangeRate = baseCurrency -> orderCurrency
  // So orderCurrency -> baseCurrency is division.
  return amount / historicalRate;
};
