import { PublicKey, Keypair } from '@solana/web3.js';
import { CypherClient } from '../client';
import {
  CacheAccountState,
  StateUpdateHandler,
  Cache,
  CacheListenerCB,
  ErrorCB
} from '../types';

export class CacheAccount {
  private _cacheListener: number;
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

  private get connection() {
    return this.client.connection;
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

  addCacheListener(callback: CacheListenerCB, idx: number, errorCallback: ErrorCB) {
    this.removeCacheListener();
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cb = (_: CacheAccountState): void => {
        const cache = this.getCache(idx);
        callback(cache);
      };
      this._subscribe(cb);
    } catch (error: unknown) {
      errorCallback(error);
    }
  }

  removeCacheListener() {
    if (this._cacheListener)
      this.connection.removeAccountChangeListener(this._cacheListener);
  }

  private _subscribe(callback: (data: CacheAccountState) => void) {
    this.client.accounts.cacheAccount
      .subscribe(this.address)
      .on('change', (state: CacheAccountState) => {
        this.state = state;
        callback(state);
      });
  }

  subscribe() {
    this._subscribe(this._onStateUpdate);
  }

  async unsubscribe() {
    await this.client.accounts.cacheAccount.unsubscribe(this.address);
  }
}
