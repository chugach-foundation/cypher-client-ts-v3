import { PublicKey } from '@solana/web3.js';
import { Market } from '@project-serum/serum';
import { CypherClient } from '../../client';
import type { ErrorCB, PoolNodeState, StateUpdateHandler } from '../../types';
import { I80F48 } from '@blockworks-foundation/mango-client';
import {
  derivePoolNodeVaultAddress,
  derivePoolNodeVaultSigner
} from '../../utils/pda';

export class PoolNode {
  private _listener: number;
  constructor(
    readonly client: CypherClient,
    readonly address: PublicKey,
    public state: PoolNodeState,
    readonly market: Market,
    private _onStateUpdate?: StateUpdateHandler<PoolNodeState>,
    private _errorCallback?: ErrorCB
  ) {
    _onStateUpdate && this.subscribe();
  }
  static async load(
    client: CypherClient,
    address: PublicKey,
    onStateUpdateHandler?: StateUpdateHandler<PoolNodeState>,
    errorCallback?: ErrorCB
  ): Promise<PoolNode> {
    const state = (await client.accounts.poolNode.fetchNullable(
      address
    )) as PoolNodeState;
    return new PoolNode(
      client,
      address,
      state,
      null,
      onStateUpdateHandler,
      errorCallback
    );
  }

  static async loadAll(client: CypherClient): Promise<PoolNode[]> {
    const pools: PoolNode[] = [];
    const queryResult = await client.accounts.pool.all();
    for (const result of queryResult) {
      const market = await Market.load(
        client.connection,
        result.account.dexMarket,
        {},
        client.dexPID
      );
      pools.push(
        new PoolNode(
          client,
          result.publicKey,
          result.account as PoolNodeState,
          market
        )
      );
    }
    return pools;
  }

  get deposits(): I80F48 {
    return new I80F48(this.state.deposits);
  }

  get borrows(): I80F48 {
    return new I80F48(this.state.borrows);
  }

  vaultAddress(): PublicKey {
    const [address] = derivePoolNodeVaultAddress(
      this.address,
      this.client.cypherPID
    );
    return address;
  }

  vaultSignerAddress(): PublicKey {
    const [address] = derivePoolNodeVaultSigner(
      this.address,
      this.client.cypherPID
    );
    return address;
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
          'PoolNode',
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
