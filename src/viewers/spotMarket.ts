import { BN } from '@project-serum/anchor';
import { Market, Orderbook } from '@project-serum/serum';
import { Pool } from '../accounts';
import { Fills, OrderbookListenerCB, ParsedOrderbook } from '../types';
import { CypherClient } from '../client/index';
import { splToUiPrice, splToUiAmount } from '../utils/tokenAmount';

export class SpotMarketViewer {
  private _bidsListener: number;
  private _asksListener: number;
  private _eventQueueListener: number;

  constructor(readonly client: CypherClient, readonly pool: Pool) {}

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

  addBidsListener(callback: OrderbookListenerCB, orderbookDepth = 250) {
    if (this.market == null) return null;

    const bidsAddress = this.market.bidsAddress;
    this._bidsListener = this.connection.onAccountChange(
      bidsAddress,
      ({ data }) => callback(this.orderbookParser(data, orderbookDepth)),
      'processed'
    );
  }

  removeBidsListener() {
    if (this._bidsListener)
      this.connection.removeAccountChangeListener(this._bidsListener);
  }

  addAsksListener(callback: OrderbookListenerCB, orderbookDepth = 250) {
    if (this.market == null) return null;

    const asksAddress = this.market.asksAddress;
    this._asksListener = this.connection.onAccountChange(
      asksAddress,
      ({ data }) => callback(this.orderbookParser(data, orderbookDepth)),
      'processed'
    );
  }

  removeAsksListener() {
    if (this._asksListener)
      this.connection.removeAccountChangeListener(this._asksListener);
  }

  addEventQueueListener(callback: () => void) {
    if (this.market == null) return null;

    this.removeEventQueueListener();
    this._eventQueueListener = this.connection.onAccountChange(
      this.market.decoded.eventQueue,
      callback,
      'processed'
    );
  }

  removeEventQueueListener() {
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

    for (const [_, size] of bids) {
      contracts += size;
    }

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

    const FILL_LIMIT = 20;
    return await this.market.loadFills(this.connection, FILL_LIMIT);
  }
}
