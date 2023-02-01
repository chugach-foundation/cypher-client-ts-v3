import { PublicKey } from '@solana/web3.js';
import { Market } from '@project-serum/serum';
import { CypherClient } from '../client';
import type { PoolNodeState, StateUpdateHandler } from '../types';
import { I80F48 } from '@blockworks-foundation/mango-client';

export class PoolNode {
  constructor(
    readonly client: CypherClient,
    readonly address: PublicKey,
    public state: PoolNodeState,
    readonly market: Market,
    private _onStateUpdate?: StateUpdateHandler<PoolNodeState>
  ) {
    _onStateUpdate && this.subscribe();
  }
  static async load(
    client: CypherClient,
    address: PublicKey,
    onStateUpdateHandler?: StateUpdateHandler<PoolNodeState>
  ): Promise<PoolNode> {
    const state = (await client.accounts.poolNode.fetchNullable(
      address
    )) as PoolNodeState;
    return new PoolNode(client, address, state, null, onStateUpdateHandler);
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

  subscribe() {
    this.client.accounts.poolNode
      .subscribe(this.address)
      .on('change', (state: PoolNodeState) => {
        this.state = state;
        // todo: check if dexMarkets need to be reloaded.(market listing/delisting)
        if (this._onStateUpdate) {
          this._onStateUpdate(this.state);
        }
      });
  }

  async unsubscribe() {
    await this.client.accounts.poolNode.unsubscribe(this.address);
  }
}
