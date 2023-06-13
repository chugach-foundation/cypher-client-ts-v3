import {
  PublicKey,
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import { Pool } from './pool';
import { CypherClient } from '../../client';
import { makeCreateMarketAccountsIxs } from '../../instructions';
import { deriveMarketAddress } from '../../utils';
import type {
  CreatePerpetualMarketArgs,
  ErrorCB,
  PerpetualMarketState,
  StateUpdateHandler
} from '../../types';

export class PerpetualMarket {
  private _listener: number;
  constructor(
    readonly client: CypherClient,
    readonly address: PublicKey,
    public state: PerpetualMarketState,
    private _onStateUpdate?: StateUpdateHandler<PerpetualMarketState>,
    private _errorCallback?: ErrorCB
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
    onStateUpdateHandler?: StateUpdateHandler<PerpetualMarketState>,
    errorCallback?: ErrorCB
  ): Promise<PerpetualMarket> {
    const state = (await client.accounts.perpetualMarket.fetchNullable(
      address
    )) as PerpetualMarketState;
    return new PerpetualMarket(
      client,
      address,
      state,
      onStateUpdateHandler,
      errorCallback
    );
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
    this.removeListener();
    try {
      this.addListener();
    } catch (error: unknown) {
      if (this._errorCallback) {
        this._errorCallback(error);
      }
    }
  }

  private addListener() {
    this._listener = this.client.connection.onAccountChange(
      this.address,
      ({ data }) => {
        this.state = this.client.program.coder.accounts.decode(
          'PerpetualMarket',
          data
        );
        if (this._onStateUpdate) {
          this._onStateUpdate(this.state);
        }
      },
      'processed'
    );
  }

  private removeListener() {
    if (this._listener)
      this.client.connection.removeAccountChangeListener(this._listener);
  }

  async unsubscribe() {
    this.removeListener();
  }
}
