import { ComputeBudgetProgram } from '@solana/web3.js';
import { uiToSplAmount } from '../utils';
import { BPS_100_PERCENT } from '../constants';

import { BN } from '@project-serum/anchor';
import { Clearing, CypherAccount } from '../accounts';

export const encodeStrToUint8Array = (str: string): number[] => {
  const encoder = new TextEncoder();
  const empty = Array(32).fill(0);
  const encodedArr = Array.from(encoder.encode(str));
  return empty.map((_, i) => encodedArr[i] || 0);
};

export const decodeUint8ArrayToStr = (numArr: number[]): string => {
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(numArr)).replaceAll('\x00', '');
};

export const getDefaultPriorityFeeIxs = () => ({
  modifyComputeUnits: ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000
  }),
  addPriorityFee: ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1
  })
});

export const createObjectWithKeyFromString = (key: string) => ({ [key]: {} });

export const getArgsInLots = ({
  clearing,
  baseLotSize,
  quoteLotSize,
  price,
  account,
  decimals,
  size
}: {
  clearing: Clearing;
  baseLotSize: BN;
  quoteLotSize: BN;
  price: number;
  account: CypherAccount;
  decimals: number;
  size: number;
}) => {
  const limitPrice = uiToSplAmount(price, 6);

  const decimalFactor = new BN(Math.pow(10, decimals));
  const feeTier = account.state.feeTier;
  const feeBps = new BN(clearing.state.feeTiers[feeTier - 1].takerBps + 1);
  const bips = new BN(BPS_100_PERCENT);
  const priceInLots = limitPrice
    .mul(baseLotSize)
    .div(decimalFactor.mul(quoteLotSize));
  const sizeInLots = new BN(
    (size * decimalFactor.toNumber()) / baseLotSize.toNumber()
  );
  const quoteWoFee = priceInLots.mul(sizeInLots).mul(quoteLotSize);
  const quoteInLots = quoteWoFee.mul(bips.add(feeBps)).div(bips);

  return { priceInLots, sizeInLots, quoteInLots };
};
