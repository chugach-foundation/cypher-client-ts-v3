import { Slab } from '@chugach-foundation/aaob';
import { PublicKey } from '@solana/web3.js';

export interface DerivativesMarket {
  address: PublicKey;
  getOrderBook();
  getOrderBookFull(): Promise<{ bids: Slab; asks: Slab }>;
}
