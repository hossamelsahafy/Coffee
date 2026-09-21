import { getExchangeRate } from "./getExchangeRate";
function normalizeCurrency(value?: string) {
  return value?.trim().toUpperCase();
}
type CurrencySnapshot = {
  baseCurrency?: string;
  rates?: Record<string, number>;
  capturedAt?: string;
};
export async function convertHistoricalAmount({
  amount,
  fromCurrency,
  targetCurrency,
  snapshot,
  orderBaseCurrency,
  date,
  historicalRateCache,
}: {
  amount: number;
  fromCurrency: string;
  targetCurrency: string;
  snapshot?: CurrencySnapshot;
  orderBaseCurrency: string;
  date: string;
  historicalRateCache: Map<string, number>;
}) {
  const snapshotBaseCurrency =
    normalizeCurrency(snapshot?.baseCurrency) || orderBaseCurrency;

  const rates = snapshot?.rates || {};

  if (fromCurrency === targetCurrency) {
    return amount;
  }

  let fromRate = 1;

  if (fromCurrency !== snapshotBaseCurrency) {
    fromRate = Number(rates[fromCurrency]);

    if (!Number.isFinite(fromRate) || fromRate <= 0) {
      throw new Error(
        `Missing historical rate: ${snapshotBaseCurrency} -> ${fromCurrency}`,
      );
    }
  }

  let toRate = 1;

  if (targetCurrency !== snapshotBaseCurrency) {
    const snapshotToRate = Number(rates[targetCurrency]);

    if (Number.isFinite(snapshotToRate) && snapshotToRate > 0) {
      toRate = snapshotToRate;
    } else {
      const cacheKey = `${date}_${snapshotBaseCurrency}_${targetCurrency}`;

      const cachedRate = historicalRateCache.get(cacheKey);

      if (cachedRate !== undefined) {
        toRate = cachedRate;
      } else {
        toRate = await getExchangeRate(
          snapshotBaseCurrency,
          targetCurrency,
          date,
        );

        historicalRateCache.set(cacheKey, toRate);
      }
    }
  }

  return (amount / fromRate) * toRate;
}
