import { getExchangeRate } from "./getExchangeRate";
type CurrencySnapshot = {
  baseCurrency: string;
  rates: Record<string, number>;
  capturedAt?: string;
};

type ConvertHistoricalOrderAmountArgs = {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  snapshot?: CurrencySnapshot;
  orderDate: string;
};

export async function convertHistoricalOrderAmount({
  amount,
  fromCurrency,
  toCurrency,
  snapshot,
  orderDate,
}: ConvertHistoricalOrderAmountArgs) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return 0;
  }

  const from = fromCurrency?.trim().toUpperCase();
  const to = toCurrency?.trim().toUpperCase();

  if (!from || !to) {
    return 0;
  }

  if (from === to) {
    return value;
  }

  if (!snapshot?.baseCurrency || !snapshot?.rates) {
    return 0;
  }

  const base = snapshot.baseCurrency.trim().toUpperCase();

  const fromRate = from === base ? 1 : Number(snapshot.rates[from]);

  if (!Number.isFinite(fromRate) || fromRate <= 0) {
    return 0;
  }

  let toRate = to === base ? 1 : Number(snapshot.rates[to]);

  if (!Number.isFinite(toRate) || toRate <= 0) {
    toRate = await getExchangeRate(base, to, orderDate);
  }

  if (!Number.isFinite(toRate) || toRate <= 0) {
    return 0;
  }

  const amountInBase = value / fromRate;

  return amountInBase * toRate;
}
