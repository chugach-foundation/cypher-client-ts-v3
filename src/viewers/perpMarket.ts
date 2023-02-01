import { EventFill, EventQueue, Slab } from '@chugach-foundation/aaob';
import { PerpetualMarket } from '../accounts';
import { Fills, OrderbookListenerCB, ParsedOrderbook } from '../types';
import { CypherClient } from '../client/index';
import { PublicKey } from '@solana/web3.js';
import { CALLBACK_INFO_LEN } from '../constants/shared';
import { DerivativesMarket } from './derivativesMarket';
import { BN } from '@project-serum/anchor';
import { splToUiAmount, priceLotsToNative } from '../utils/tokenAmount';

export class PerpMarketViewer implements DerivativesMarket {
  private _bidsListener: number;
  private _asksListener: number;
  private _eventQueueListener: number;

  constructor(
    readonly client: CypherClient,
    readonly market: PerpetualMarket
  ) {}

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
      const scaledPrice = level.price;
      const baseQty = new BN(level.size.toNumber()).mul(
        this.market.state.inner.baseMultiplier
      );
      return [
        splToUiAmount(
          priceLotsToNative(
            scaledPrice.ushrn(32),
            this.market.state.inner.baseMultiplier,
            this.market.state.inner.quoteMultiplier,
            this.market.state.inner.config.decimals
          ),
          6
        ),
        splToUiAmount(baseQty, this.market.state.inner.config.decimals)
      ];
    });
  }

  addBidsListener(callback: OrderbookListenerCB, orderbookDepth = 250) {
    const bidsAddress = this.market.state.inner.bids;
    this._bidsListener = this.connection.onAccountChange(
      bidsAddress,
      ({ data }) => callback(this.orderbookParser(data, false, orderbookDepth)),
      'processed'
    );
  }

  removeBidsListener() {
    if (this._bidsListener)
      this.connection.removeAccountChangeListener(this._bidsListener);
  }

  addAsksListener(callback: OrderbookListenerCB, orderbookDepth = 250) {
    const asksAddress = this.market.state.inner.asks;
    this._asksListener = this.connection.onAccountChange(
      asksAddress,
      ({ data }) => callback(this.orderbookParser(data, true, orderbookDepth)),
      'processed'
    );
  }

  removeAsksListener() {
    if (this._asksListener)
      this.connection.removeAccountChangeListener(this._asksListener);
  }

  addEventQueueListener(callback: () => void) {
    this.removeEventQueueListener();
    this._eventQueueListener = this.connection.onAccountChange(
      this.market.state.inner.eventQueue,
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
    const FILL_LIMIT = 20;
    const eventQueue = await this.loadEventQueue(
      this.market.state.inner.eventQueue
    );
    const fills = eventQueue.parseFill(FILL_LIMIT);
    return fills.map((fill: EventFill) => {
      return {
        price: fill.quoteSize.div(fill.baseSize).toNumber(),
        amount: fill.baseSize.toNumber()
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
