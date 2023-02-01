import {
  PublicKey,
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import { Pool } from './pool';
import { CypherClient } from '../client';
import { makeCreateMarketAccountsIxs } from '../instructions';
import { bnToDate, deriveMarketAddress } from '../utils';
import { BN } from '@project-serum/anchor';
import type {
  CreateFuturesMarketArgs,
  FuturesMarketState,
  StateUpdateHandler
} from '../types';

export class FuturesMarket {
  constructor(
    readonly client: CypherClient,
    readonly address: PublicKey,
    public state: FuturesMarketState,
    private _onStateUpdate?: StateUpdateHandler<FuturesMarketState>
  ) {
    _onStateUpdate && this.subscribe();
  }

  static async create(
    client: CypherClient,
    authority: PublicKey,
    clearing: PublicKey,
    cacheAccount: PublicKey,
    quotePool: Pool,
    oracleProducts: PublicKey,
    args: CreateFuturesMarketArgs
  ) {
    const [market, marketBump] = deriveMarketAddress(
      args.marketName,
      client.cypherPID
    );
    args.marketBump = marketBump;

    const { orderbook, eventQueue, bids, asks, priceHistory, ixs, signers } =
      await makeCreateMarketAccountsIxs(client);

    const tx = new Transaction();
    tx.add(...ixs);
    await client.sendAndConfirm(tx, signers);

    await client.methods
      .createFuturesMarket({
        ...args,
        marketType: args.marketType as never,
        deliveryType: args.deliveryType as never
      })
      .accountsStrict({
        clearing,
        cacheAccount,
        market,
        priceHistory,
        oracleProducts,
        quotePool: quotePool.address,
        orderbook,
        bids,
        asks,
        eventQueue,
        authority,
        payer: client.walletPubkey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY
      })
      .rpc();

    return market;
  }

  static async load(
    client: CypherClient,
    address: PublicKey,
    onStateUpdateHandler?: StateUpdateHandler<FuturesMarketState>
  ): Promise<FuturesMarket> {
    const state = (await client.accounts.futuresMarket.fetchNullable(
      address
    )) as FuturesMarketState;
    return new FuturesMarket(client, address, state, onStateUpdateHandler);
  }

  static async loadAll(client: CypherClient): Promise<FuturesMarket[]> {
    const queryResult = await client.accounts.futuresMarket.all();
    return queryResult.map(
      (result) =>
        new FuturesMarket(
          client,
          result.publicKey,
          result.account as FuturesMarketState
        )
    );
  }

  get marketPrice(): BN {
    return this.state.marketPrice;
  }

  get positionsCount(): BN {
    return this.state.positionsCount;
  }

  get totalBorrows(): BN {
    return this.state.totalBorrows;
  }

  get totalPurchased(): BN {
    return this.state.totalPurchased;
  }

  get totalRaised(): BN {
    return this.state.totalRaised;
  }

  get tokenSupply(): BN {
    return this.state.tokenSupply;
  }

  get marketActivatesAt(): Date {
    return bnToDate(this.state.activatesAt);
  }

  get marketExpiresAt(): Date {
    return bnToDate(this.state.expiresAt);
  }

  subscribe() {
    this.client.accounts.futuresMarket
      .subscribe(this.address)
      .on('change', (state: FuturesMarketState) => {
        this.state = state;
        // todo: check if dexMarkets need to be reloaded.(market listing/delisting)
        if (this._onStateUpdate) {
          this._onStateUpdate(this.state);
        }
      });
  }

  async unsubscribe() {
    await this.client.accounts.futuresMarket.unsubscribe(this.address);
  }
}
