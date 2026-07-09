export const isPriceValid = (price) => {
  return typeof price === 'number' && !Number.isNaN(price) && price >= 0;
}