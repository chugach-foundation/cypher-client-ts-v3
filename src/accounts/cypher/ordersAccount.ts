import { PublicKey } from '@solana/web3.js';
import {
  ErrorCB,
  OpenOrder,
  OrdersAccountState,
  Side,
  StateUpdateHandler
} from '../../types';
import { CypherProgramClient } from '../../client';
import { ZERO_BN } from '@blockworks-foundation/mango-client';
import { BN } from '@project-serum/anchor';
import { FuturesMarketViewer, PerpMarketViewer } from '../../viewers';
import {
  splToUiAmount,
  priceLotsToNative,
  sizeLotsToNative
} from '../../utils';
import { LeafNode, getPriceFromKey } from '@chugach-foundation/aaob';
import { QUOTE_TOKEN_DECIMALS } from '../../constants/shared';

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
  private _listener: number;
  constructor(
    readonly client: CypherProgramClient,
    readonly address: PublicKey,
    public state: OrdersAccountState,
    private _onStateUpdate?: StateUpdateHandler<OrdersAccountState>,
    private _errorCallback?: ErrorCB
  ) {
    _onStateUpdate && this.subscribe();
  }

  static async load(
    client: CypherProgramClient,
    address: PublicKey,
    onStateUpdateHandler?: StateUpdateHandler<OrdersAccountState>,
    errorCallback?: ErrorCB
  ) {
    const state = (await client.accounts.ordersAccount.fetchNullable(
      address
    )) as OrdersAccountState;
    return new DerivativesOrdersAccount(
      client,
      address,
      state,
      onStateUpdateHandler,
      errorCallback
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
    const baseQty = sizeLotsToNative(leafNode.baseQuantity, baseM);
    const price = splToUiAmount(
      priceLotsToNative(
        getPriceFromKey(leafNode.key).ushrn(32),
        viewer.market.state.inner.baseMultiplier,
        viewer.market.state.inner.quoteMultiplier,
        viewer.market.state.inner.config.decimals
      ),
      QUOTE_TOKEN_DECIMALS
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
          'OrdersAccount',
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
