import { I80F48 } from '@blockworks-foundation/mango-client';
import { BN } from '@project-serum/anchor';
import { Side } from '../types/on-chain';

export function getSideFromKey(orderId: BN): Side {
  const orderIdSideFlag = new BN(1).shln(63);
  const and = orderIdSideFlag.and(orderId);
  try {
    if (and.toNumber() !== 0) {
      return Side.Bid;
    } else {
      return Side.Ask;
    }
  } catch (e) {
    return Side.Bid;
  }
}

export function sizeLotsToNative(sizeLots: BN, baseMultiplier: BN): BN {
  return sizeLots.mul(baseMultiplier);
}

export function priceLotsToNative(
  priceLots: BN,
  baseMultiplier: BN,
  quoteMultiplier: BN,
  decimals: number
): BN {
  return priceLots
    .mul(quoteMultiplier)
    .mul(new BN(10 ** decimals))
    .div(baseMultiplier);
}

export function fp32Mul(a: BN, bFp32: BN): BN {
  return a.mul(bFp32).ushrn(32);
}

export function getQuoteFromBase(
  baseAmount: BN,
  scaledPriceFp32: BN,
  baseMultiplier: BN,
  quoteMultiplier: BN
): BN {
  return fp32Mul(baseAmount, scaledPriceFp32)
    .mul(quoteMultiplier)
    .div(baseMultiplier);
}

export function splToUiAmount(splAmount: BN, decimals: number) {
  return splAmount.div(new BN(10 ** decimals)).toNumber();
}

export function splToUiAmountFixed(
  splAmount: I80F48,
  decimals: number
): I80F48 {
  return splAmount.div(I80F48.fromNumber(10 ** decimals));
}

export function splToUiPrice(
  splPrice: BN,
  baseDecimals: number,
  quoteDecimals: number
): number {
  return splPrice
    .mul(new BN(10 ** baseDecimals))
    .div(new BN(10 ** quoteDecimals))
    .toNumber();
}

export function uiToSplAmount(uiAmount: number, decimals: number): BN {
  return new BN(uiAmount * 10 ** decimals);
}

export function uiToSplAmountFixed(uiAmount: number, decimals: number): I80F48 {
  return I80F48.fromNumber(uiAmount).mul(I80F48.fromNumber(10 ** decimals));
}

export function uiToSplPrice(
  uiPrice: number,
  baseDecimals: number,
  quoteDecimals: number
): BN {
  return new BN(uiPrice * 10 ** quoteDecimals).divn(10 ** baseDecimals);
}
