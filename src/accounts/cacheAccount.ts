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
  private _listener: number;
  private _cacheListeners: Map<number, CacheListenerCB>;
  constructor(
    readonly client: CypherClient,
    readonly address: PublicKey,
    public state: CacheAccountState,
    private _onStateUpdate?: StateUpdateHandler<CacheAccountState>,
    private _errorCallback?: ErrorCB
  ) {
    this._cacheListeners = new Map<number, CacheListenerCB>();
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
    onStateUpdateHandler?: StateUpdateHandler<CacheAccountState>,
    errorCallback?: ErrorCB
  ) {
    const state = (await client.accounts.cacheAccount.fetchNullable(
      address
    )) as CacheAccountState;
    return new CacheAccount(
      client,
      address,
      state,
      onStateUpdateHandler,
      errorCallback
    );
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

  addCacheListener(
    callback: CacheListenerCB,
    idx: number,
    errorCallback: ErrorCB
  ) {
    this.removeCacheListener(idx);
    this._cacheListeners.set(idx, callback);
    try {
      this.subscribe();
    } catch (error: unknown) {
      errorCallback(error);
    }
  }

  removeCacheListener(idx: number) {
    if (this._cacheListeners.get(idx)) this._cacheListeners.delete(idx);
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
          'CacheAccount',
          data
        );
        if (this._onStateUpdate) {
          this._onStateUpdate(this.state);
        }
        for (const [key, value] of this._cacheListeners) {
          const cache = this.getCache(key);
          value(cache);
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
