import { PublicKey, Keypair } from '@solana/web3.js';
import { CypherClient } from '../client';
import { CacheAccountState, StateUpdateHandler, Cache } from '../types';

export class CacheAccount {
  constructor(
    readonly client: CypherClient,
    readonly address: PublicKey,
    public state: CacheAccountState,
    private _onStateUpdate?: StateUpdateHandler<CacheAccountState>
  ) {
    _onStateUpdate && this.subscribe();
  }

  static async create(
    client: CypherClient,
    clearing: PublicKey,
    authority: PublicKey
  ) {
    const cacheAccountFull = Keypair.generate();

    const preIx = await client.accounts.cacheAccount.createInstruction(
      cacheAccountFull,
      65576
    );
    const ix = await client.methods
      .initCacheAccount()
      .accountsStrict({
        clearing,
        cacheAccount: cacheAccountFull.publicKey,
        authority
      })
      .instruction();

    return {
      cacheAccount: cacheAccountFull.publicKey,
      ixs: [preIx, ix],
      signers: [cacheAccountFull]
    };
  }

  static async load(
    client: CypherClient,
    address: PublicKey,
    onStateUpdateHandler?: StateUpdateHandler<CacheAccountState>
  ) {
    const state = (await client.accounts.cacheAccount.fetchNullable(
      address
    )) as CacheAccountState;
    return new CacheAccount(client, address, state, onStateUpdateHandler);
  }

  getCaches(): Cache[] {
    const caches: Cache[] = [];

    for (const cache of this.state.caches) {
      if (!cache.oracleProducts.equals(PublicKey.default)) {
        caches.push(cache);
      }
    }

    return caches;
  }

  getCache(idx: number): Cache {
    return this.state.caches[idx];
  }

  subscribe() {
    this.client.accounts.cacheAccount
      .subscribe(this.address)
      .on('change', (state: CacheAccountState) => {
        this.state = state;
        // todo: check if dexMarkets need to be reloaded.(market listing/delisting)
        if (this._onStateUpdate) {
          this._onStateUpdate(this.state);
        }
      });
  }

  async unsubscribe() {
    await this.client.accounts.cacheAccount.unsubscribe(this.address);
  }
}
