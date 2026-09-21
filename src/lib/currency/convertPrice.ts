export function convertPrice(price: number, exchangeRate: number) {
  return (price * exchangeRate).toFixed(2);
}
