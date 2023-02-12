import { PublicKey } from '@solana/web3.js';
import {
  OpenOrder,
  OrdersAccountState,
  Side,
  StateUpdateHandler
} from '../types';
import { CypherClient } from '../client';
import { ZERO_BN } from '@blockworks-foundation/mango-client';
import { BN } from '@project-serum/anchor';
import { FuturesMarketViewer, PerpMarketViewer } from '../viewers';
import {
  getQuoteFromBase,
  splToUiPrice,
  splToUiAmount,
  priceLotsToNative
} from '../utils';
import { LeafNode } from '@chugach-foundation/aaob';

export interface Order {
  side: Side;
  price: number;
  quantity: number;
  orderId: BN;
  subAccountIdx: number;
  orderType: unknown;
  timestamp: BN;
  clientOrderId: BN;
  openOrdersAddress: PublicKey;
}
export class DerivativesOrdersAccount {
  constructor(
    readonly client: CypherClient,
    readonly address: PublicKey,
    public state: OrdersAccountState,
    private _onStateUpdate?: StateUpdateHandler<OrdersAccountState>
  ) {
    _onStateUpdate && this.subscribe();
  }

  static async load(
    client: CypherClient,
    address: PublicKey,
    onStateUpdateHandler?: StateUpdateHandler<OrdersAccountState>
  ) {
    const state = (await client.accounts.ordersAccount.fetchNullable(
      address
    )) as OrdersAccountState;
    return new DerivativesOrdersAccount(
      client,
      address,
      state,
      onStateUpdateHandler
    );
  }

  getOrderIds() {
    const orderIds: BN[] = [];

    for (const order of this.state.openOrders) {
      if (order.orderId != ZERO_BN) {
        orderIds.push(order.orderId);
      }
    }

    return orderIds;
  }

  getOrdersMap(): Map<string, OpenOrder> {
    const orders: Map<string, OpenOrder> = new Map();

    for (const order of this.state.openOrders) {
      if (order.orderId != ZERO_BN) {
        orders.set(order.orderId.toString(), order);
      }
    }

    return orders;
  }

  async getOrders(
    viewer: FuturesMarketViewer | PerpMarketViewer
  ): Promise<Order[]> {
    const orders: Order[] = [];
    const ordersMap = this.getOrdersMap();
    const openOrdersAddress = this.address;
    const { bids, asks } = await viewer.getOrderBookFull();

    for (const bid of bids.items(false)) {
      const order = ordersMap.get(bid.leafNode.key.toString());
      if (order) {
        const { price, quantity } = this.getPriceQuantity(viewer, bid.leafNode);
        orders.push({
          side: Side.Bid,
          price,
          quantity,
          subAccountIdx: order.subAccountIdx,
          orderType: order.orderType,
          timestamp: order.timestamp,
          clientOrderId: order.clientOrderId,
          orderId: order.orderId,
          openOrdersAddress
        });
      }
    }

    for (const ask of asks.items(false)) {
      const order = ordersMap.get(ask.leafNode.key.toString());

      if (order) {
        const { price, quantity } = this.getPriceQuantity(viewer, ask.leafNode);

        orders.push({
          side: Side.Ask,
          price,
          quantity,
          subAccountIdx: order.subAccountIdx,
          orderType: order.orderType,
          timestamp: order.timestamp,
          clientOrderId: order.clientOrderId,
          orderId: order.orderId,
          openOrdersAddress
        });
      }
    }

    return orders;
  }

  getPriceQuantity(
    viewer: FuturesMarketViewer | PerpMarketViewer,
    leafNode: LeafNode
  ) {
    const baseM = viewer.market.state.inner.baseMultiplier;
    const baseQty = new BN(leafNode.baseQuantity.toNumber()).mul(baseM);
    const price = splToUiAmount(
      priceLotsToNative(
        leafNode.getPrice().ushrn(32),
        viewer.market.state.inner.baseMultiplier,
        viewer.market.state.inner.quoteMultiplier,
        viewer.market.state.inner.config.decimals
      ),
      6
    );
    const quantity = splToUiAmount(
      baseQty,
      viewer.market.state.inner.config.decimals
    );

    return { price, quantity };
  }

  getBaseTokenFree(subAcctIdx: number, baseDecimals: number) {
    return splToUiAmount(this.state.baseTokenFree[subAcctIdx], baseDecimals);
  }

  getQuoteTokenFree(subAcctIdx: number, quoteDecimals: number) {
    return splToUiAmount(this.state.quoteTokenFree[subAcctIdx], quoteDecimals);
  }

  subscribe() {
    this.client.accounts.ordersAccount
      .subscribe(this.address)
      .on('change', (state: OrdersAccountState) => {
        this.state = state;
        // todo: check if dexMarkets need to be reloaded.(market listing/delisting)
        if (this._onStateUpdate) {
          this._onStateUpdate(this.state);
        }
      });
  }

  async unsubscribe() {
    await this.client.accounts.ordersAccount.unsubscribe(this.address);
  }
}
