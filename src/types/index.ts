import { EventQueue } from '@chugach-foundation/aaob';
import { Cache, Side } from './cypher';
import { BN } from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';

export type Cluster = 'localnet' | 'devnet' | 'mainnet-beta';

export interface Config {
  CYPHER_PID: PublicKey;
  CYPHER_TOKEN_MINT: PublicKey;
  LIP_PID: PublicKey;
  DEX_PID: PublicKey;
  PYTH_PID: PublicKey;
  SEQ_ENFORCER_PID: PublicKey;
  FAUCET_PID?: PublicKey;
  QUOTE_MINT: PublicKey;
  PYTH_QUOTE_PRODUCT: PublicKey;
  CACHE: PublicKey;
  HISTORY_API_GRAPHQL: string;
  HISTORY_API_REST: string;
}

export type StateUpdateHandler<T> = (state: T) => void;
export type CacheListenerCB = (cache: Cache) => void;
export type ParsedOrderbook = [number, number][];
export type OrderbookListenerCB = (bidsOrAsks: ParsedOrderbook) => void;
export type EventQueueListenerCB = (eq: EventQueue) => void;
export type FillsListenerCB = (fills: FillsExtended) => void;
export type Fills = { price: number; amount: number }[];
export type FillsExtended = {
  price: number;
  amount: number;
  makerAccount: PublicKey;
  makerOrderId: BN;
  takerAccount: PublicKey;
  side: Side;
}[];
export type ErrorCB = (error: unknown) => void;

export interface Wallet {
  signTransaction(tx: Transaction): Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
  publicKey: PublicKey;
}

export * from './cypher';
export * from './liquidityIncentiveProgram';
