type ExchangeRateCacheEntry = {
  rate: number;
};

const exchangeRateCache = new Map<string, ExchangeRateCacheEntry>();

export async function getExchangeRate(
  baseCurrency: string,
  targetCurrency: string,
  date?: string,
) {
  const base = baseCurrency.trim().toUpperCase();
  const target = targetCurrency.trim().toUpperCase();

  if (base === target) {
    return 1;
  }

  const requestedDate = date || new Date().toISOString().split("T")[0];

  const cacheKey = `${requestedDate}_${base}_${target}`;

  const cached = exchangeRateCache.get(cacheKey);

  if (cached) {
    return cached.rate;
  }

  const url = new URL(
    `https://api.frankfurter.dev/v2/rate/${base.toLowerCase()}/${target.toLowerCase()}`,
  );

  url.searchParams.set("date", requestedDate);

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch exchange rate for ${base}/${target} on ${requestedDate}`,
    );
  }

  const result = await response.json();

  const rate = Number(result?.rate);

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("Invalid exchange rate.");
  }

  exchangeRateCache.set(cacheKey, {
    rate,
  });

  return rate;
}
