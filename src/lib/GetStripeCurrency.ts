export default function getStripeAmount(
  total: number,
  currency: string,
): number {
  const upperCurrency = currency.toUpperCase();

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: upperCurrency,
  });

  const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;

  return Math.round(total * Math.pow(10, digits));
}
