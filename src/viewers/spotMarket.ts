/* eslint-disable @typescript-eslint/no-explicit-any */
import { Market, Orderbook } from '@project-serum/serum';
import { Pool } from '../accounts';
import {
  ErrorCB,
  Fills,
  FillsExtended,
  FillsListenerCB,
  OrderbookListenerCB,
  ParsedOrderbook
} from '../types';
import { CypherClient } from '../client/index';
import { decodeEventsSince, Event } from '@project-serum/serum/lib/queue';
import { PublicKey } from '@solana/web3.js';
import { getPriceFromKey } from '@chugach-foundation/aaob';
import { getSideFromKey } from '../utils/tokenAmount';

export class SpotMarketViewer {
  private _bidsListener: number;
  private _asksListener: number;
  private _eventQueueListener: number;
  private _openOrdersAccountListener: number;
  private _lastSeqNum: number;

  constructor(readonly client: CypherClient, readonly pool: Pool) {
    this._lastSeqNum = 0;
  }

  private get connection() {
    return this.client.connection;
  }

  get market(): Market {
    return this.pool.market;
  }

  orderbookParser(data: Buffer, orderbookDepth = 250): ParsedOrderbook {
    const orderbook = Orderbook.decode(this.pool.market, data);
    return orderbook
      .getL2(orderbookDepth)
      .map(([price, size]) => [price, size]);
  }

  eventQueueParser(data: Buffer): Event[] {
    return decodeEventsSince(data, this._lastSeqNum);
  }

  fillsParser(data: Buffer): FillsExtended {
    const events = this.eventQueueParser(data);
    this._lastSeqNum = events[events.length - 1].seqNum;

    return events
      .filter((evt: Event) => evt.eventFlags.fill && evt.eventFlags.maker)
      .map((fill: Event) => {
        const side = getSideFromKey(fill.orderId);
        return {
          side: side,
          price: this.pool.market.priceLotsToNumber(
            getPriceFromKey(fill.orderId)
          ),
          amount: this.pool.market.baseSplSizeToNumber(
            fill.nativeQuantityReleased
          ),
          makerAccount: fill.openOrders,
          makerOrderId: fill.orderId,
          takerAccount: PublicKey.default
        };
      });
  }

  addBidsListener(
    callback: OrderbookListenerCB,
    errorCallback: ErrorCB,
    orderbookDepth = 250
  ) {
    if (this.market == null) return null;

    this.removeBidsListener();
    try {
      const bidsAddress = this.market.bidsAddress;
      this._bidsListener = this.connection.onAccountChange(
        bidsAddress,
        ({ data }) => callback(this.orderbookParser(data, orderbookDepth)),
        'processed'
      );
    } catch (error: unknown) {
      errorCallback(error);
    }
  }

  removeBidsListener() {
    if (this._bidsListener)
      this.connection.removeAccountChangeListener(this._bidsListener);
  }

  addAsksListener(
    callback: OrderbookListenerCB,
    errorCallback: ErrorCB,
    orderbookDepth = 250
  ) {
    if (this.market == null) return null;

    this.removeAsksListener();
    try {
      const asksAddress = this.market.asksAddress;
      this._asksListener = this.connection.onAccountChange(
        asksAddress,
        ({ data }) => callback(this.orderbookParser(data, orderbookDepth)),
        'processed'
      );
    } catch (error: unknown) {
      errorCallback(error);
    }
  }

  removeAsksListener() {
    if (this._asksListener)
      this.connection.removeAccountChangeListener(this._asksListener);
  }

  addEventQueueListener(callback: () => void, errorCallback: ErrorCB) {
    if (this.market == null) return null;

    this.removeEventQueueListener();
    try {
      this._eventQueueListener = this.connection.onAccountChange(
        this.market.decoded.eventQueue,
        callback,
        'processed'
      );
    } catch (error: unknown) {
      errorCallback(error);
    }
  }

  removeEventQueueListener() {
    if (this._eventQueueListener)
      this.connection.removeAccountChangeListener(this._eventQueueListener);
  }

  addOpenOrdersAccountListener(
    openOrdersAccount: PublicKey,
    callback: (x: any) => void,
    errorCallback: ErrorCB
  ) {
    if (this.market == null) return null;

    this.removeOpenOrdersAccountListener();
    try {
      this._openOrdersAccountListener = this.connection.onAccountChange(
        openOrdersAccount,
        callback
      );
    } catch (error: unknown) {
      errorCallback(error);
    }
  }

  addFillsListener(callback: FillsListenerCB, errorCallback: ErrorCB) {
    this.removeEventQueueListener();
    try {
      this._eventQueueListener = this.connection.onAccountChange(
        this.market.decoded.eventQueue,
        ({ data }) => callback(this.fillsParser(data)),
        'processed'
      );
    } catch (error: unknown) {
      errorCallback(error);
    }
  }

  removeOpenOrdersAccountListener() {
    if (this._openOrdersAccountListener)
      this.connection.removeAccountChangeListener(
        this._openOrdersAccountListener
      );
  }

  removeFillsListener() {
    if (this._eventQueueListener)
      this.connection.removeAccountChangeListener(this._eventQueueListener);
  }

  calcMarketOrderPrice(
    size: number,
    side: 'buy' | 'sell',
    bids: ParsedOrderbook,
    asks: ParsedOrderbook
  ) {
    const orderbook = side === 'buy' ? asks : bids;
    let acc = 0;
    let selectedOrder: [number, number] | undefined;
    for (const order of orderbook) {
      acc += order[1];
      if (acc >= size) {
        selectedOrder = order;
        break;
      }
    }
    if (!selectedOrder) {
      throw new Error();
    }

    if (side === 'buy') return selectedOrder[0] * 1.05;
    else return selectedOrder[0] * 0.95;
  }

  calcMarketOrderPriceForAvailableAmount(
    size: number,
    side: 'buy' | 'sell',
    bids: ParsedOrderbook,
    asks: ParsedOrderbook
  ) {
    if (!size) throw new Error('Size is empty');

    const orderbook = side === 'buy' ? asks : bids;
    if (orderbook.length === 0) return [0, 0];

    let acc = 0;
    let selectedOrder: [number, number] | undefined;
    let availableSize = size;

    for (const order of orderbook) {
      acc += order[1];
      if (acc >= size) {
        selectedOrder = order;
        break;
      }
    }

    if (!selectedOrder) {
      selectedOrder = orderbook[orderbook.length - 1];
      availableSize = acc;
    }

    if (side === 'buy') return [selectedOrder[0] * 1.05, availableSize];
    else return [selectedOrder[0] * 0.95, availableSize];
  }

  getTopAskPrice(asks: ParsedOrderbook) {
    const a = asks?.length > 0 && Number(asks[0][0]);
    return a || 0;
  }

  getlastPrice(fills: Fills) {
    const last = fills && fills.length > 0 && fills[0].price;

    if (last) return last;
    return 0;
  }

  getMiddlePointPrice(bids: ParsedOrderbook, asks: ParsedOrderbook) {
    const b = bids?.length > 0 && Number(bids[0][0]);
    const a = asks?.length > 0 && Number(asks[0][0]);

    if (b && a) return (b + a) / 2;
    return 0;
  }

  getContractsOnOrderbooks(bids: ParsedOrderbook, asks: ParsedOrderbook) {
    let contracts = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, size] of bids) {
      contracts += size;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, size] of asks) {
      contracts += size;
    }

    return contracts;
  }

  async getOrderBook() {
    if (this.market == null) return null;

    const decodedBids = this.market.decoded.bids;
    const decodedAsks = this.market.decoded.asks;
    const bidsData = await this.connection.getAccountInfo(decodedBids);
    const asksData = await this.connection.getAccountInfo(decodedAsks);

    const bids = this.orderbookParser(bidsData.data);
    const asks = this.orderbookParser(asksData.data);

    return { bids, asks };
  }

  async loadFills(): Promise<Fills> {
    if (this.market == null) return null;
    const { data } = await this.connection.getAccountInfo(
      this.pool.market.decoded.eventQueue
    );
    const events = this.eventQueueParser(data);

    return events
      .filter((evt: Event) => evt.eventFlags.fill && evt.eventFlags.maker)
      .map((fill: Event) => {
        const side = getSideFromKey(fill.orderId);
        const amount =
          (side as any).bid !== undefined
            ? this.market.baseSplSizeToNumber(fill.nativeQuantityReleased)
            : this.market.baseSplSizeToNumber(fill.nativeQuantityPaid);
        const price = this.market.priceLotsToNumber(
          getPriceFromKey(fill.orderId)
        );
        return {
          side: side,
          price: price,
          amount: amount,
          makerAccount: fill.openOrders,
          makerOrderId: fill.orderId,
          takerAccount: PublicKey.default
        };
      });
  }
}
