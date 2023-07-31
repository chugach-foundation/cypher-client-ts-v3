export const checkMarketPriceAgainstThreshold = ({
  currentPrice,
  calcMarketPrice,
  thresholdPerc
}: {
  currentPrice: number;
  calcMarketPrice: number;
  thresholdPerc: number;
}): boolean => {
  const percDiff = Math.abs(1 - currentPrice / calcMarketPrice);
  return percDiff < thresholdPerc;
};
