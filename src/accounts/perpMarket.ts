import {
  PublicKey,
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import { Pool } from './pool';
import { CypherClient } from '../client';
import { makeCreateMarketAccountsIxs } from '../instructions';
import { deriveMarketAddress } from '../utils';
import { BN } from '@project-serum/anchor';
import type {
  CreatePerpetualMarketArgs,
  PerpetualMarketState,
  StateUpdateHandler
} from '../types';

export class PerpetualMarket {
  constructor(
    readonly client: CypherClient,
    readonly address: PublicKey,
    public state: PerpetualMarketState,
    private _onStateUpdate?: StateUpdateHandler<PerpetualMarketState>
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
    args: CreatePerpetualMarketArgs
  ) {
    const [market, marketBump] = deriveMarketAddress(
      args.marketName,
      client.cypherPID
    );
    args.marketBump = marketBump;

    const { orderbook, eventQueue, bids, asks, ixs, signers } =
      await makeCreateMarketAccountsIxs(client);

    const tx = new Transaction();
    tx.add(...ixs);
    await client.sendAndConfirm(tx, signers);

    await client.methods
      .createPerpMarket({
        ...args,
        marketType: args.marketType as never
      })
      .accountsStrict({
        clearing,
        cacheAccount,
        market,
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
    onStateUpdateHandler?: StateUpdateHandler<PerpetualMarketState>
  ): Promise<PerpetualMarket> {
    const state = (await client.accounts.perpetualMarket.fetchNullable(
      address
    )) as PerpetualMarketState;
    return new PerpetualMarket(client, address, state, onStateUpdateHandler);
  }

  static async loadAll(client: CypherClient): Promise<PerpetualMarket[]> {
    const queryResult = await client.accounts.perpetualMarket.all();
    return queryResult.map(
      (result) =>
        new PerpetualMarket(
          client,
          result.publicKey,
          result.account as PerpetualMarketState
        )
    );
  }

  subscribe() {
    this.client.accounts.perpetualMarket
      .subscribe(this.address)
      .on('change', (state: PerpetualMarketState) => {
        this.state = state;
        // todo: check if dexMarkets need to be reloaded.(market listing/delisting)
        if (this._onStateUpdate) {
          this._onStateUpdate(this.state);
        }
      });
  }

  async unsubscribe() {
    await this.client.accounts.perpetualMarket.unsubscribe(this.address);
  }
}
