import {
  EventFill,
  EventQueue,
  Slab,
  getPriceFromKey
} from '@chugach-foundation/aaob';
import { FuturesMarket } from '../accounts';
import {
  ErrorCB,
  EventQueueListenerCB,
  Fills,
  FillsExtended,
  FillsListenerCB,
  OrderbookListenerCB,
  ParsedOrderbook
} from '../types';
import { CypherClient } from '../client/index';
import { PublicKey } from '@solana/web3.js';
import { CALLBACK_INFO_LEN, QUOTE_TOKEN_DECIMALS } from '../constants/shared';
import { DerivativesMarket } from './derivativesMarket';
import {
  splToUiAmount,
  priceLotsToNative,
  getSideFromKey,
  sizeLotsToNative
} from '../utils/tokenAmount';

export class FuturesMarketViewer implements DerivativesMarket {
  private _bidsListener: number;
  private _asksListener: number;
  private _eventQueueListener: number;
  private _fillsListener: number;

  constructor(readonly client: CypherClient, readonly market: FuturesMarket) {}

  private get connection() {
    return this.client.connection;
  }

  get address() {
    return this.market.address;
  }

  /**
   * Parses the given buffer into the Slab structure
   * @param data the account info data buffer
   * @param increasing whether the data should be returned in increasing order
   * @param orderbookDepth number of levels of slab data to process
   */
  orderbookParser(
    data: Buffer,
    increasing: boolean,
    orderbookDepth = 250
  ): ParsedOrderbook {
    const slab = Slab.deserialize(data, CALLBACK_INFO_LEN);
    return slab.getL2DepthJS(orderbookDepth, increasing).map((level) => {
      const price = priceLotsToNative(
        level.price.ushrn(32),
        this.market.state.inner.baseMultiplier,
        this.market.state.inner.quoteMultiplier,
        this.market.state.inner.config.decimals
      );
      const baseQty = sizeLotsToNative(
        level.size,
        this.market.state.inner.baseMultiplier
      );
      return [
        splToUiAmount(price, QUOTE_TOKEN_DECIMALS),
        splToUiAmount(baseQty, this.market.state.inner.config.decimals)
      ];
    });
  }

  eventQueueParser(data: Buffer): EventQueue {
    return EventQueue.parse(CALLBACK_INFO_LEN, data);
  }

  fillsParser(data: Buffer): FillsExtended {
    const eq = this.eventQueueParser(data);
    const events = [...Array(eq.header.count.toNumber()).keys()]
      .map((e) => eq.peekAt(e))
      .filter((e) => e instanceof EventFill);

    return events.map((fill: EventFill) => {
      const side = getSideFromKey(fill.makerOrderId);
      return {
        side: side,
        price: splToUiAmount(
          priceLotsToNative(
            getPriceFromKey(fill.makerOrderId).ushrn(32),
            this.market.state.inner.baseMultiplier,
            this.market.state.inner.quoteMultiplier,
            this.market.state.inner.config.decimals
          ),
          QUOTE_TOKEN_DECIMALS
        ),
        amount: splToUiAmount(
          sizeLotsToNative(
            fill.baseSize,
            this.market.state.inner.baseMultiplier
          ),
          this.market.state.inner.config.decimals
        ),
        makerAccount: new PublicKey(
          Buffer.from(fill.makerCallbackInfo.slice(0, 32))
        ),
        makerOrderId: fill.makerOrderId,
        takerAccount: new PublicKey(
          Buffer.from(fill.takerCallbackInfo.slice(0, 32))
        )
      };
    });
  }

  addBidsListener(
    callback: OrderbookListenerCB,
    errorCallback: ErrorCB = () => {},
    orderbookDepth = 250
  ) {
    this.removeBidsListener();
    try {
      const bidsAddress = this.market.state.inner.bids;
      this._bidsListener = this.connection.onAccountChange(
        bidsAddress,
        ({ data }) =>
          callback(this.orderbookParser(data, false, orderbookDepth)),
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
    errorCallback: ErrorCB = () => {},
    orderbookDepth = 250
  ) {
    this.removeAsksListener();
    try {
      const asksAddress = this.market.state.inner.asks;
      this._asksListener = this.connection.onAccountChange(
        asksAddress,
        ({ data }) =>
          callback(this.orderbookParser(data, true, orderbookDepth)),
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

  addEventQueueListener(
    callback: EventQueueListenerCB,
    errorCallback: ErrorCB
  ) {
    this.removeEventQueueListener();
    try {
      this._eventQueueListener = this.connection.onAccountChange(
        this.market.state.inner.eventQueue,
        ({ data }) => callback(this.eventQueueParser(data)),
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

  addFillsListener(callback: FillsListenerCB, errorCallback: ErrorCB) {
    this.removeEventQueueListener();
    try {
      this._fillsListener = this.connection.onAccountChange(
        this.market.state.inner.eventQueue,
        ({ data }) => callback(this.fillsParser(data)),
        'processed'
      );
    } catch (error: unknown) {
      errorCallback(error);
    }
  }

  removeFillsListener() {
    if (this._fillsListener)
      this.connection.removeAccountChangeListener(this._fillsListener);
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
    const decodedBids = this.market.state.inner.bids;
    const decodedAsks = this.market.state.inner.asks;
    const bidsData = await this.connection.getAccountInfo(decodedBids);
    const asksData = await this.connection.getAccountInfo(decodedAsks);

    const bids = this.orderbookParser(bidsData.data, false);
    const asks = this.orderbookParser(asksData.data, true);

    return { bids, asks };
  }

  async getOrderBookFull(): Promise<{ bids: Slab; asks: Slab }> {
    const decodedBids = this.market.state.inner.bids;
    const decodedAsks = this.market.state.inner.asks;
    const bidsData = await this.connection.getAccountInfo(decodedBids);
    const asksData = await this.connection.getAccountInfo(decodedAsks);

    const bids = Slab.deserialize(bidsData.data, CALLBACK_INFO_LEN);
    const asks = Slab.deserialize(asksData.data, CALLBACK_INFO_LEN);

    return { bids, asks };
  }

  async loadFills(): Promise<Fills> {
    const eventQueue = await this.loadEventQueue(
      this.market.state.inner.eventQueue
    );

    const events = [...Array(eventQueue.header.head.toNumber()).keys()]
      .map((e) => eventQueue.parseEvent(e))
      .filter((e) => e instanceof EventFill);

    return events.map((fill: EventFill) => {
      return {
        price: splToUiAmount(
          priceLotsToNative(
            getPriceFromKey(fill.makerOrderId).ushrn(32),
            this.market.state.inner.baseMultiplier,
            this.market.state.inner.quoteMultiplier,
            this.market.state.inner.config.decimals
          ),
          QUOTE_TOKEN_DECIMALS
        ),
        amount: splToUiAmount(
          sizeLotsToNative(
            fill.baseSize,
            this.market.state.inner.baseMultiplier
          ),
          this.market.state.inner.config.decimals
        )
      };
    });
  }

  private async loadEventQueue(address: PublicKey): Promise<EventQueue> {
    const eventQueue = await EventQueue.load(
      this.client.connection,
      address,
      CALLBACK_INFO_LEN
    );
    return eventQueue;
  }
}
