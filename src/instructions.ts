import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  Keypair
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { AnchorProvider, BN } from '@project-serum/anchor';
import {
  CancelOrderArgs,
  CreateClearingArgs,
  CreateFuturesMarketArgs,
  CreatePerpetualMarketArgs,
  CreatePoolArgs,
  NewDerivativeOrderArgs,
  NewSpotOrderArgs,
  CreateOracleProductsArgs,
  SubAccountMargining
} from './types';
import { CypherClient } from './client';
import * as Aaob from '@chugach-foundation/aaob';
import { struct, u8, u32 } from 'buffer-layout';
import { TokenInstructions } from '@project-serum/serum';

export const makeCreatePublicClearingIx = (
  client: CypherClient,
  clearing: PublicKey,
  authority: PublicKey,
  payer: PublicKey,
  args: CreateClearingArgs
) => {
  return client.methods
    .createPublicClearing({ ...args, clearingType: args.clearingType as never })
    .accountsStrict({
      clearing,
      authority,
      payer,
      systemProgram: SystemProgram.programId
    })
    .instruction();
};

export const makeCreatePrivateClearingIx = (
  client: CypherClient,
  clearing: PublicKey,
  privateClearing: PublicKey,
  authority: PublicKey,
  payer: PublicKey,
  args: CreateClearingArgs
) => {
  return client.methods
    .createPrivateClearing({
      ...args,
      clearingType: args.clearingType as never
    })
    .accountsStrict({
      clearing,
      privateClearing,
      authority,
      payer,
      systemProgram: SystemProgram.programId
    })
    .instruction();
};

export const makeCreateAccountIx = (
  client: CypherClient,
  clearing: PublicKey,
  account: PublicKey,
  authority: PublicKey,
  payer: PublicKey,
  accountNumber: number,
  accountBump: number
) => {
  return client.methods
    .createAccount(accountNumber, accountBump)
    .accountsStrict({
      clearing,
      masterAccount: account,
      authority,
      payer,
      systemProgram: SystemProgram.programId
    })
    .instruction();
};

export const makeCreateWhitelistedAccountIx = (
  client: CypherClient,
  clearing: PublicKey,
  whitelist: PublicKey,
  account: PublicKey,
  authority: PublicKey,
  payer: PublicKey,
  accountNumber: number,
  accountBump: number
) => {
  return client.methods
    .createWhitelistedAccount(accountNumber, accountBump)
    .accountsStrict({
      clearing,
      whitelist,
      masterAccount: account,
      authority,
      payer,
      systemProgram: SystemProgram.programId
    })
    .instruction();
};

export const makeCreateSubAccountIx = (
  client: CypherClient,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  authority: PublicKey,
  payer: PublicKey,
  subAccountNumber: number,
  subAccountBump: number,
  subAccountAlias: number[]
) => {
  return client.methods
    .createSubAccount(subAccountNumber, subAccountBump, subAccountAlias)
    .accountsStrict({
      masterAccount,
      subAccount,
      authority,
      payer,
      systemProgram: SystemProgram.programId
    });
};

export const makeCreateFuturesMarketIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  market: PublicKey,
  priceHistory: PublicKey,
  oracleProducts: PublicKey,
  quotePool: PublicKey,
  orderbook: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  eventQueue: PublicKey,
  authority: PublicKey,
  payer: PublicKey,
  args: CreateFuturesMarketArgs
) => {
  return client.methods
    .createFuturesMarket({
      ...args,
      marketType: args.marketType as never,
      deliveryType: args.deliveryType as never
    })
    .accountsStrict({
      cacheAccount,
      clearing,
      market,
      priceHistory,
      oracleProducts,
      quotePool,
      orderbook,
      bids,
      asks,
      eventQueue,
      authority,
      payer,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    })
    .instruction();
};

export const makeCreatePerpMarketIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  market: PublicKey,
  oracleProducts: PublicKey,
  quotePool: PublicKey,
  orderbook: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  eventQueue: PublicKey,
  authority: PublicKey,
  payer: PublicKey,
  args: CreatePerpetualMarketArgs
) => {
  return client.methods
    .createPerpMarket({
      ...args,
      marketType: args.marketType as never
    })
    .accountsStrict({
      clearing,
      cacheAccount,
      market,
      oracleProducts,
      quotePool,
      orderbook,
      bids,
      asks,
      eventQueue,
      authority,
      payer,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    })
    .instruction();
};

export const makeCreatePoolIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  pool: PublicKey,
  poolNode: PublicKey,
  tokenMint: PublicKey,
  tokenVault: PublicKey,
  vaultSigner: PublicKey,
  oracleProducts: PublicKey,
  dexMarket: PublicKey,
  authority: PublicKey,
  payer: PublicKey,
  args: CreatePoolArgs
) => {
  return client.methods
    .createPool({ ...args })
    .accountsStrict({
      clearing,
      cacheAccount,
      pool,
      poolNode,
      tokenMint,
      tokenVault,
      vaultSigner,
      oracleProducts,
      dexMarket,
      authority,
      payer,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY
    })
    .instruction();
};

export const makeCreateOracleProductsIx = (
  client: CypherClient,
  cacheAccount: PublicKey,
  oracleProducts: PublicKey,
  authority: PublicKey,
  payer: PublicKey,
  productsArr: PublicKey[],
  args: CreateOracleProductsArgs
) => {
  return client.methods
    .createOracleProducts({
      ...args,
      productsType: args.productsType as never
    })
    .accountsStrict({
      cacheAccount,
      oracleProducts,
      authority,
      payer,
      systemProgram: SystemProgram.programId
    })
    .remainingAccounts(
      productsArr.map((product) => ({
        pubkey: product,
        isSigner: false,
        isWritable: false
      }))
    )
    .instruction();
};

export const makeCreateDerivativesOrdersAccountIx = (
  client: CypherClient,
  masterAccount: PublicKey,
  market: PublicKey,
  openOrders: PublicKey,
  authority: PublicKey,
  payer: PublicKey
) => {
  return client.methods
    .createOrdersAccount()
    .accountsStrict({
      masterAccount,
      market,
      openOrders,
      authority,
      payer,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    })
    .instruction();
};

export const makeInitSpotOpenOrdersIx = (
  client: CypherClient,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  pool: PublicKey,
  tokenMint: PublicKey,
  dexMarket: PublicKey,
  openOrders: PublicKey,
  authority: PublicKey,
  payer: PublicKey
) => {
  return client.methods
    .initSpotOpenOrders()
    .accountsStrict({
      masterAccount,
      subAccount,
      pool,
      tokenMint,
      dexMarket,
      openOrders,
      authority,
      payer,
      systemProgram: SystemProgram.programId,
      dexProgram: client.dexPID,
      rent: SYSVAR_RENT_PUBKEY
    })
    .instruction();
};

export const makeCacheOraclePricesIx = (
  client: CypherClient,
  cacheAccount: PublicKey,
  oracleProducts: PublicKey,
  productsArr: PublicKey[],
  cacheIndex: BN,
  pool?: PublicKey,
  futuresMarket?: PublicKey
) => {
  const remainingAccounts = [];
  for (const product in productsArr) {
    remainingAccounts.push({
      pubkey: product,
      isSigner: false,
      isWritable: false
    });
  }
  if (pool) {
    remainingAccounts.push({
      pubkey: pool,
      isSigner: false,
      isWritable: false
    });
  }
  if (futuresMarket) {
    remainingAccounts.push({
      pubkey: futuresMarket,
      isSigner: false,
      isWritable: false
    });
  }
  return client.methods
    .cacheOraclePrices(cacheIndex)
    .accountsStrict({
      cacheAccount,
      oracleProducts
    })
    .remainingAccounts(remainingAccounts)
    .instruction();
};

export const makeCloseSpotOpenOrdersIx = (
  client: CypherClient,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  assetPool: PublicKey,
  tokenMint: PublicKey,
  dexMarket: PublicKey,
  openOrders: PublicKey,
  authority: PublicKey
) => {
  return client.methods
    .closeSpotOpenOrders()
    .accountsStrict({
      masterAccount,
      subAccount,
      assetPool,
      tokenMint,
      dexMarket,
      openOrders,
      authority,
      dexProgram: client.dexPID
    })
    .instruction();
};

export const makeSetAccountDelegateIx = (
  client: CypherClient,
  masterAccount: PublicKey,
  delegate: PublicKey,
  authority: PublicKey
) => {
  return client.methods
    .setAccountDelegate()
    .accountsStrict({
      masterAccount,
      authority,
      delegate
    })
    .instruction();
};

export const makeSetSubAccountDelegateIx = (
  client: CypherClient,
  subAccount: PublicKey,
  delegate: PublicKey,
  authority: PublicKey
) => {
  return client.methods
    .setSubAccountDelegate()
    .accountsStrict({
      subAccount,
      authority,
      delegate
    })
    .instruction();
};

export const makeDepositFundsIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  pool: PublicKey,
  poolNode: PublicKey,
  sourceTokenAccount: PublicKey,
  tokenVault: PublicKey,
  tokenMint: PublicKey,
  authority: PublicKey,
  amount: BN
) => {
  return client.methods
    .depositFunds(amount)
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      pool,
      poolNode,
      sourceTokenAccount,
      tokenVault,
      tokenMint,
      authority,
      tokenProgram: TOKEN_PROGRAM_ID
    })
    .instruction();
};

export const makeWithdrawFundsIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  pool: PublicKey,
  poolNode: PublicKey,
  tokenVault: PublicKey,
  vaultSigner: PublicKey,
  destinationTokenAccount: PublicKey,
  tokenMint: PublicKey,
  authority: PublicKey,
  amount: BN
) => {
  return client.methods
    .withdrawFunds(amount)
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      pool,
      poolNode,
      tokenVault,
      vaultSigner,
      destinationTokenAccount,
      tokenMint,
      authority,
      tokenProgram: TOKEN_PROGRAM_ID
    })
    .instruction();
};

export const makeNewFuturesOrderIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  market: PublicKey,
  openOrders: PublicKey,
  priceHistory: PublicKey,
  orderbook: PublicKey,
  eventQueue: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  quotePoolNode: PublicKey,
  authority: PublicKey,
  args: NewDerivativeOrderArgs
) => {
  return client.methods
    .newFuturesOrder({
      ...args,
      side: args.side as never,
      orderType: args.orderType as never
    })
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      market,
      openOrders,
      priceHistory,
      orderbook,
      eventQueue,
      bids,
      asks,
      quotePoolNode,
      authority
    })
    .instruction();
};

export const makeNewFuturesOrdersIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  market: PublicKey,
  openOrders: PublicKey,
  priceHistory: PublicKey,
  orderbook: PublicKey,
  eventQueue: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  quotePoolNode: PublicKey,
  authority: PublicKey,
  args: NewDerivativeOrderArgs[]
) => {
  return client.methods
    .multipleNewFuturesOrders({
      ...args
    })
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      market,
      openOrders,
      priceHistory,
      orderbook,
      eventQueue,
      bids,
      asks,
      quotePoolNode,
      authority
    })
    .instruction();
};

export const makeCancelFuturesOrderIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  market: PublicKey,
  openOrders: PublicKey,
  orderbook: PublicKey,
  eventQueue: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  quotePoolNode: PublicKey,
  authority: PublicKey,
  args: CancelOrderArgs
) => {
  return client.methods
    .cancelFuturesOrder({
      ...args,
      side: args.side as never
    })
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      market,
      openOrders,
      orderbook,
      eventQueue,
      bids,
      asks,
      quotePoolNode,
      authority
    })
    .instruction();
};
export const makeCancelFuturesOrdersIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  market: PublicKey,
  openOrders: PublicKey,
  orderbook: PublicKey,
  eventQueue: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  quotePoolNode: PublicKey,
  authority: PublicKey,
  args: CancelOrderArgs[]
) => {
  return client.methods
    .cancelFuturesOrders({
      ...args
    })
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      market,
      openOrders,
      orderbook,
      eventQueue,
      bids,
      asks,
      quotePoolNode,
      authority
    })
    .instruction();
};

export const makeSettleFuturesFundsIx = (
  client: CypherClient,
  cacheAccount: PublicKey,
  clearing: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  openOrders: PublicKey,
  market: PublicKey,
  quotePoolNode: PublicKey,
  authority: PublicKey
) => {
  return client.methods
    .settleFuturesFunds()
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      openOrders,
      market,
      quotePoolNode,
      authority
    })
    .instruction();
};

export const makeNewPerpOrderIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  market: PublicKey,
  openOrders: PublicKey,
  orderbook: PublicKey,
  eventQueue: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  quotePoolNode: PublicKey,
  authority: PublicKey,
  args: NewDerivativeOrderArgs
) => {
  return client.methods
    .newPerpOrder({
      ...args,
      side: args.side as never,
      orderType: args.orderType as never
    })
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      market,
      openOrders,
      orderbook,
      eventQueue,
      bids,
      asks,
      quotePoolNode,
      authority
    })
    .instruction();
};

export const makeMultipleNewPerpOrdersIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  market: PublicKey,
  openOrders: PublicKey,
  orderbook: PublicKey,
  eventQueue: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  quotePoolNode: PublicKey,
  authority: PublicKey,
  args: NewDerivativeOrderArgs[]
) => {
  return client.methods
    .multipleNewPerpOrders({
      ...args
    })
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      market,
      openOrders,
      orderbook,
      eventQueue,
      bids,
      asks,
      quotePoolNode,
      authority
    })
    .instruction();
};

export const makeCancelPerpOrderIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  market: PublicKey,
  openOrders: PublicKey,
  orderbook: PublicKey,
  eventQueue: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  quotePoolNode: PublicKey,
  authority: PublicKey,
  args: CancelOrderArgs
) => {
  return client.methods
    .cancelPerpOrder({
      ...args,
      side: args.side as never
    })
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      market,
      openOrders,
      orderbook,
      eventQueue,
      bids,
      asks,
      quotePoolNode,
      authority
    })
    .instruction();
};

export const makeCancelPerpOrdersIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  market: PublicKey,
  openOrders: PublicKey,
  orderbook: PublicKey,
  eventQueue: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  quotePoolNode: PublicKey,
  authority: PublicKey,
  args: CancelOrderArgs[]
) => {
  return client.methods
    .cancelPerpOrders({
      ...args
    })
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      market,
      openOrders,
      orderbook,
      eventQueue,
      bids,
      asks,
      quotePoolNode,
      authority
    })
    .instruction();
};

export const makeSettlePerpFundsIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  openOrders: PublicKey,
  market: PublicKey,
  quotePoolNode: PublicKey
) => {
  return client.methods
    .settlePerpFunds()
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      openOrders,
      market,
      quotePoolNode
    })
    .instruction();
};
export interface NewSpotOrderDexAccounts {
  market: PublicKey;
  openOrders: PublicKey;
  eventQueue: PublicKey;
  requestQueue: PublicKey;
  bids: PublicKey;
  asks: PublicKey;
  coinVault: PublicKey;
  pcVault: PublicKey;
  vaultSigner: PublicKey;
}

export const makeNewSpotOrderIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  assetPoolNode: PublicKey,
  quotePoolNode: PublicKey,
  assetMint: PublicKey,
  assetVault: PublicKey,
  vaultSigner: PublicKey,
  quoteVault: PublicKey,
  authority: PublicKey,
  dexAccounts: NewSpotOrderDexAccounts,
  args: NewSpotOrderArgs
) => {
  return client.methods
    .newSpotOrder({
      ...args,
      side: args.side as never,
      orderType: args.orderType as never,
      selfTradeBehavior: args.selfTradeBehavior as never
    })
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      assetPoolNode,
      quotePoolNode,
      assetMint,
      assetVault,
      quoteVault,
      vaultSigner,
      authority,
      dex: {
        ...dexAccounts,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        dexProgram: client.dexPID
      }
    })
    .instruction();
};

export interface CancelSpotOrderDexAccounts {
  market: PublicKey;
  openOrders: PublicKey;
  eventQueue: PublicKey;
  bids: PublicKey;
  asks: PublicKey;
  coinVault: PublicKey;
  pcVault: PublicKey;
  vaultSigner: PublicKey;
}

export const makeCancelSpotOrderIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  assetPoolNode: PublicKey,
  quotePoolNode: PublicKey,
  assetMint: PublicKey,
  assetVault: PublicKey,
  quoteVault: PublicKey,
  authority: PublicKey,
  dexAccounts: CancelSpotOrderDexAccounts,
  args: CancelOrderArgs
) => {
  return client.methods
    .cancelSpotOrder({
      ...args,
      side: args.side as never
    })
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      subAccount,
      assetPoolNode,
      quotePoolNode,
      assetMint,
      assetVault,
      quoteVault,
      authority,
      dex: {
        ...dexAccounts,
        tokenProgram: TOKEN_PROGRAM_ID,
        dexProgram: client.dexPID
      }
    })
    .instruction();
};

export interface SettleSpotFundsDexAccounts {
  market: PublicKey;
  openOrders: PublicKey;
  coinVault: PublicKey;
  pcVault: PublicKey;
  vaultSigner: PublicKey;
}

export const makeSettleSpotFundsIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  assetPoolNode: PublicKey,
  quotePoolNode: PublicKey,
  assetMint: PublicKey,
  assetVault: PublicKey,
  quoteVault: PublicKey,
  authority: PublicKey,
  dexAccounts: SettleSpotFundsDexAccounts
) => {
  return client.methods.settleSpotFunds().accountsStrict({
    clearing,
    cacheAccount,
    masterAccount,
    subAccount,
    assetPoolNode,
    quotePoolNode,
    assetMint,
    assetVault,
    quoteVault,
    authority,
    dex: {
      ...dexAccounts,
      tokenProgram: TOKEN_PROGRAM_ID,
      dexProgram: client.dexPID
    }
  });
};

export const makeUpdateTokenIndexIx = (
  client: CypherClient,
  cacheAccount: PublicKey,
  pool: PublicKey,
  poolNodes: PublicKey[]
) => {
  return client.methods
    .updateTokenIndex()
    .accountsStrict({ cacheAccount, pool })
    .remainingAccounts(
      poolNodes.map((p) => ({
        pubkey: p,
        isSigner: false,
        isWritable: false
      }))
    )
    .instruction();
};

export const makeUpdateFundingRateIx = (
  client: CypherClient,
  cacheAccount: PublicKey,
  market: PublicKey,
  orderbook: PublicKey,
  bids: PublicKey,
  asks: PublicKey
) => {
  return client.methods
    .updateFundingRate()
    .accountsStrict({
      cacheAccount,
      market,
      orderbook,
      bids,
      asks
    })
    .instruction();
};

export const makeConsumeFuturesEventsIx = (
  client: CypherClient,
  clearing: PublicKey,
  market: PublicKey,
  orderbook: PublicKey,
  eventQueue: PublicKey,
  openOrders: PublicKey[],
  limit: number
) => {
  return client.methods
    .consumeFuturesEvents(limit)
    .accountsStrict({
      clearing,
      market,
      orderbook,
      eventQueue
    })
    .remainingAccounts(
      openOrders.map((addr) => ({
        pubkey: addr,
        isSigner: false,
        isWritable: true
      }))
    )
    .instruction();
};

export const makeConsumePerpEventsIx = (
  client: CypherClient,
  clearing: PublicKey,
  market: PublicKey,
  orderbook: PublicKey,
  eventQueue: PublicKey,
  openOrders: PublicKey[],
  limit: number
) => {
  return client.methods
    .consumePerpEvents(limit)
    .accountsStrict({
      clearing,
      market,
      orderbook,
      eventQueue
    })
    .remainingAccounts(
      openOrders.map((addr) => ({
        pubkey: addr,
        isSigner: false,
        isWritable: true
      }))
    )
    .instruction();
};

export const makeEditSubAccountMarginIx = (
  client: CypherClient,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  authority: PublicKey,
  marginingType: SubAccountMargining
) => {
  return client.methods
    .editSubAccountMargining(marginingType as never)
    .accountsStrict({
      masterAccount,
      subAccount,
      authority
    })
    .instruction();
};

export const makeUpdateAccountMarginIx = (
  client: CypherClient,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  signer: PublicKey,
  subAccounts: PublicKey[]
) => {
  return client.methods
    .updateAccountMargin()
    .accountsStrict({
      cacheAccount,
      masterAccount,
      signer
    })
    .remainingAccounts(
      subAccounts.map((addr) => ({
        pubkey: addr,
        isSigner: false,
        isWritable: false
      }))
    )
    .instruction();
};

export const makeTransferBetweenSubAccountsIx = (
  client: CypherClient,
  clearing: PublicKey,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  fromSubAccount: PublicKey,
  toSubAccount: PublicKey,
  assetMint: PublicKey,
  assetPoolNode: PublicKey,
  authority: PublicKey,
  amount: BN
) => {
  return client.methods
    .transferBetweenSubAccounts(amount)
    .accountsStrict({
      clearing,
      cacheAccount,
      masterAccount,
      fromSubAccount,
      toSubAccount,
      assetMint,
      assetPoolNode,
      authority
    })
    .instruction();
};

export const makeDepositDeliverableIx = (
  client: CypherClient,
  market: PublicKey,
  pool: PublicKey,
  poolNode: PublicKey,
  tokenMint: PublicKey,
  tokenVault: PublicKey,
  sourceTokenAccount: PublicKey,
  authority: PublicKey,
  amount: BN
) => {
  return client.methods
    .depositDeliverable(amount)
    .accountsStrict({
      market,
      pool,
      poolNode,
      tokenMint,
      tokenVault,
      sourceTokenAccount,
      authority,
      tokenProgram: TOKEN_PROGRAM_ID
    })
    .instruction();
};

export const makeSettlePositionIx = (
  client: CypherClient,
  cacheAccount: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  market: PublicKey,
  quotePoolNode: PublicKey
) => {
  return client.methods
    .settlePosition()
    .accountsStrict({
      cacheAccount,
      masterAccount,
      subAccount,
      market,
      quotePoolNode
    })
    .instruction();
};

export const makeCreateMarketAccountsIxs = async (client: CypherClient) => {
  const eventCapacity = 50;
  const callbackInfoLen = 34;
  const orderCapacity = 1_000;

  const signers: Keypair[] = [];
  const ixs: TransactionInstruction[] = [];

  // Market account
  const marketFull = new Keypair();
  ixs.push(
    SystemProgram.createAccount({
      fromPubkey: client.walletPubkey,
      lamports: await client.connection.getMinimumBalanceForRentExemption(
        Aaob.MarketState.LEN
      ),
      newAccountPubkey: marketFull.publicKey,
      programId: client.cypherPID,
      space: Aaob.MarketState.LEN
    })
  );
  signers.push(marketFull);

  // Event queue account
  const eventQueueFull = new Keypair();
  const eventQueueSize = Aaob.EventQueue.computeAllocationSize(
    eventCapacity,
    callbackInfoLen
  );
  ixs.push(
    SystemProgram.createAccount({
      fromPubkey: client.walletPubkey,
      lamports: await client.connection.getMinimumBalanceForRentExemption(
        eventQueueSize
      ),
      newAccountPubkey: eventQueueFull.publicKey,
      programId: client.cypherPID,
      space: eventQueueSize
    })
  );
  signers.push(eventQueueFull);

  // Bids account
  const bidsFull = new Keypair();
  const slabSize = Aaob.Slab.computeAllocationSize(
    orderCapacity,
    callbackInfoLen
  );
  ixs.push(
    SystemProgram.createAccount({
      fromPubkey: client.walletPubkey,
      lamports: await client.connection.getMinimumBalanceForRentExemption(
        slabSize
      ),
      newAccountPubkey: bidsFull.publicKey,
      programId: client.cypherPID,
      space: slabSize
    })
  );
  signers.push(bidsFull);

  // Asks account
  const asksFull = new Keypair();
  ixs.push(
    SystemProgram.createAccount({
      fromPubkey: client.walletPubkey,
      lamports: await client.connection.getMinimumBalanceForRentExemption(
        slabSize
      ),
      newAccountPubkey: asksFull.publicKey,
      programId: client.cypherPID,
      space: slabSize
    })
  );
  signers.push(asksFull);

  const priceHistoryFull = new Keypair();
  ixs.push(
    await client.accounts.priceHistory.createInstruction(priceHistoryFull)
  );
  signers.push(priceHistoryFull);

  return {
    orderbook: marketFull.publicKey,
    eventQueue: eventQueueFull.publicKey,
    bids: bidsFull.publicKey,
    asks: asksFull.publicKey,
    priceHistory: priceHistoryFull.publicKey,
    ixs,
    signers
  };
};

export const makeRequestCuIx = (payer: PublicKey, units: number) => {
  const p = new PublicKey('ComputeBudget111111111111111111111111111111');
  const params = { instruction: 0, units, additionalFee: 0 };
  const layout = struct([
    u8('instruction'),
    u32('units'),
    u32('additionalFee')
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode(params, data);
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: false
    }
  ];
  return new TransactionInstruction({
    keys,
    programId: p,
    data
  });
};

export const makeCreateMintIxs = async (
  provider: AnchorProvider,
  authority: PublicKey,
  mint: PublicKey,
  decimals?: number
): Promise<TransactionInstruction[]> => {
  return [
    SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: mint,
      space: 82,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(82),
      programId: TokenInstructions.TOKEN_PROGRAM_ID
    }),
    TokenInstructions.initializeMint({
      mint,
      decimals: decimals ?? 0,
      mintAuthority: authority
    })
  ];
};

export const makeCreateTokenAccountIxs = async (
  provider: AnchorProvider,
  newAccountPubkey: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  lamports?: number
): Promise<TransactionInstruction[]> => {
  if (lamports === undefined) {
    lamports = await provider.connection.getMinimumBalanceForRentExemption(165);
  }
  return [
    SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey,
      space: 165,
      lamports,
      programId: TokenInstructions.TOKEN_PROGRAM_ID
    }),
    TokenInstructions.initializeAccount({
      account: newAccountPubkey,
      mint,
      owner
    })
  ];
};
