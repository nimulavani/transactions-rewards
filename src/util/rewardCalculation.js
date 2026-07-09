import { isPriceValid } from "./util"

/**
 *  - price > 100  -> 50 + 2 points per rupee above 100
 *  - price > 50   -> 1 point per rupee above 50
 *  - price <= 50  -> 0 points
 */
export const calculateTransactionRewards = (productPrice) => {

  if (!isPriceValid(productPrice)) {
    return null
  }

  productPrice = Math.trunc(productPrice)
  if (productPrice > 100) {
    return (productPrice - 100) * 2 + 50
  } else if (productPrice > 50) {
    return productPrice - 50
  } else {
    return 0
  }
}
