import { getExchangeRate } from "./getExchangeRate";
type CurrencyConfig = {
  code: string;
};

export async function createCurrencySnapshot(
  baseCurrency: string,
  currencies: CurrencyConfig[],
  date: string,
  capturedAt = new Date().toISOString(),
) {
  const base = baseCurrency.trim().toUpperCase();

  const codes = [
    ...new Set(
      currencies
        .map((currency) => currency.code?.trim().toUpperCase())
        .filter(Boolean)
        .filter((code) => code !== base),
    ),
  ];

  const rates: Record<string, number> = {
    [base]: 1,
  };

  const results = await Promise.all(
    codes.map(async (code) => ({
      code,
      rate: await getExchangeRate(base, code, date),
    })),
  );

  for (const { code, rate } of results) {
    rates[code] = rate;
  }

  return {
    baseCurrency: base,
    rates,
    capturedAt,
  };
}
