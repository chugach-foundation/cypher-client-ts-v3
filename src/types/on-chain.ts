import { Event } from '@project-serum/anchor';
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types';
import type { Cypher } from '../generated/types/cypher';

type _CacheAccount = TypeDef<Cypher['accounts'][0], Cypher>;
type _Clearing = TypeDef<Cypher['accounts'][1], Cypher>;
export type WhiteList = TypeDef<Cypher['accounts'][2], Cypher>;
type _FuturesMarket = TypeDef<Cypher['accounts'][3], Cypher>;
type _PerpetualMarket = TypeDef<Cypher['accounts'][4], Cypher>;
export type OracleProductsState = TypeDef<Cypher['accounts'][5], Cypher>;
export type OracleStub = TypeDef<Cypher['accounts'][6], Cypher>;
type _OrdersAccountState = TypeDef<Cypher['accounts'][7], Cypher>;
export type PoolNodeState = TypeDef<Cypher['accounts'][8], Cypher>;
type _Pool = TypeDef<Cypher['accounts'][9], Cypher>;
export type PriceHistory = TypeDef<Cypher['accounts'][10], Cypher>;
type _CypherAccount = TypeDef<Cypher['accounts'][11], Cypher>;
type _CypherSubAccount = TypeDef<Cypher['accounts'][12], Cypher>;

export type LiquidityMiningArgs = TypeDef<Cypher['types'][0], Cypher>;
export type FeeTierArgs = TypeDef<Cypher['types'][1], Cypher>;
type _CreateOracleProductsArgs = TypeDef<Cypher['types'][2], Cypher>;
type _CreateClearingArgs = TypeDef<Cypher['types'][3], Cypher>;
type _CreatePerpetualMarketArgs = TypeDef<Cypher['types'][4], Cypher>;
type _CreateFuturesMarketArgs = TypeDef<Cypher['types'][5], Cypher>;
export type CreatePoolArgs = TypeDef<Cypher['types'][6], Cypher>;
type _NewSpotOrderArgs = TypeDef<Cypher['types'][7], Cypher>;
type _NewDerivativeOrderArgs = TypeDef<Cypher['types'][8], Cypher>;
type _CancelOrderArgs = TypeDef<Cypher['types'][9], Cypher>;
export type Cache = TypeDef<Cypher['types'][10], Cypher>;
export type FeeTier = TypeDef<Cypher['types'][11], Cypher>;
export type ClearingConfig = TypeDef<Cypher['types'][12], Cypher>;
type _MarketConfig = TypeDef<Cypher['types'][13], Cypher>;
export type LiquidityMiningInfo = TypeDef<Cypher['types'][14], Cypher>;
type _AgnosticMarket = TypeDef<Cypher['types'][15], Cypher>;
type _OpenOrder = TypeDef<Cypher['types'][16], Cypher>;
export type NodeInfo = TypeDef<Cypher['types'][17], Cypher>;
export type PoolConfig = TypeDef<Cypher['types'][18], Cypher>;
export type PriceHistoryConfig = TypeDef<Cypher['types'][19], Cypher>;
export type PriceWithTs = TypeDef<Cypher['types'][20], Cypher>;
type _SubAccountCache = TypeDef<Cypher['types'][21], Cypher>;
type _PositionSlot = TypeDef<Cypher['types'][22], Cypher>;
type _SpotPosition = TypeDef<Cypher['types'][23], Cypher>;
type _DerivativePosition = TypeDef<Cypher['types'][24], Cypher>;
export type OpenOrdersCache = TypeDef<Cypher['types'][25], Cypher>;

export type AccountActionLog = Event<Cypher['events'][0]>;
export type SubAccountActionLog = Event<Cypher['events'][1]>;
export type ClearingActionLog = Event<Cypher['events'][2]>;
export type MarketActionLog = Event<Cypher['events'][3]>;
export type PoolActionLog = Event<Cypher['events'][4]>;
export type WhitelistCreationLog = Event<Cypher['events'][5]>;
export type OrdersAccountActionLog = Event<Cypher['events'][6]>;
export type SettlePositionLog = Event<Cypher['events'][7]>;
export type LiquidateCollateralLog = Event<Cypher['events'][8]>;
export type DepositOrWithdrawLog = Event<Cypher['events'][9]>;
export type OrderFillLog = Event<Cypher['events'][10]>;

export class OperatingStatus {
  static readonly Active = { active: {} };
  static readonly ReduceOnly = { reduceOnly: {} };
  static readonly CancelOnly = { cancelOnly: {} };
  static readonly Halted = { halted: {} };
}
export class OrderType {
  static readonly Limit = { limit: {} };
  static readonly ImmediateOrCancel = { immediateOrCancel: {} };
  static readonly PostOnly = { postOnly: {} };
}

export class DerivativeOrderType {
  static readonly Limit = { limit: {} };
  static readonly ImmediateOrCancel = { immediateOrCancel: {} };
  static readonly FillOrKill = { fillOrKill: {} };
  static readonly PostOnly = { postOnly: {} };
}

export class Side {
  static readonly Bid = { bid: {} };
  static readonly Ask = { ask: {} };
}

export class SelfTradeBehavior {
  static readonly DecrementTake = { decrementTake: {} };
  static readonly AbortTransaction = { abortTransaction: {} };
  static readonly CancelProvide = { cancelProvide: {} };
}

export class AccountAction {
  static readonly Create = { create: {} };
  static readonly Close = { close: {} };
  static readonly SetDelegate = { setDelegate: {} };
}

export class SubAccountAction {
  static readonly Create = { create: {} };
  static readonly Close = { close: {} };
  static readonly ChangeMarginingType = { changeMarginingType: {} };
}

export class ClearingAction {
  static readonly Create = { create: {} };
  static readonly Close = { close: {} };
  static readonly SweepFee = { sweepFee: {} };
}

export class FuturesOrdersAccountAction {
  static readonly Create = { create: {} };
  static readonly Close = { close: {} };
}

export class ClearingType {
  static readonly Public = { public: {} };
  static readonly Private = { private: {} };
}

export class WhitelistStatus {
  static readonly Pending = { pending: {} };
  static readonly Active = { active: {} };
  static readonly Revoked = { revoked: {} };
}

export class MarketType {
  static readonly Default = { default: {} };
  static readonly PairFuture = { pairFuture: {} };
  static readonly PerpetualFuture = { perpetualFuture: {} };
  static readonly PreIDO = { PreIDO: {} };
  static readonly IndexFuture = { indexFuture: {} };
}

export class SettlementType {
  static readonly CashSettled = { cashSettled: {} };
  static readonly PhysicalDelivery = { physicalDelivery: {} };
}

export class ProductsType {
  static readonly Pyth = { pyth: {} };
  static readonly Switchboard = { switchboard: {} };
}

export class SubAccountMargining {
  static readonly Cross = { cross: {} };
  static readonly Isolated = { isolated: {} };
}

export class AccountType {
  static readonly Regular = { regulard: {} };
  static readonly Whitelisted = { whitelisted: {} };
}

export interface ClearingState extends _Clearing {
  feeTiers: FeeTierArgs[];
}

export interface AgnosticMarket extends _AgnosticMarket {
  config: MarketConfig;
}

export interface FuturesMarketState extends _FuturesMarket {
  inner: AgnosticMarket;
}

export interface PerpetualMarketState extends _PerpetualMarket {
  inner: AgnosticMarket;
}

export interface CreateOracleProductsArgs extends _CreateOracleProductsArgs {
  productsType: ProductsType;
}

export interface CreateClearingArgs extends _CreateClearingArgs {
  clearingType: ClearingType;
  feeTiers: FeeTierArgs[];
}

export interface CreateFuturesMarketArgs extends _CreateFuturesMarketArgs {
  marketType: MarketType;
  deliveryType: SettlementType;
}

export interface CreatePerpetualMarketArgs extends _CreatePerpetualMarketArgs {
  marketType: MarketType;
}

export interface NewSpotOrderArgs extends _NewSpotOrderArgs {
  side: Side;
  orderType: OrderType;
  selfTradeBehavior: SelfTradeBehavior;
}

export interface NewDerivativeOrderArgs extends _NewDerivativeOrderArgs {
  side: Side;
  orderType: DerivativeOrderType;
  selfTradeBehavior: SelfTradeBehavior;
}

export interface CancelOrderArgs extends _CancelOrderArgs {
  side: Side;
}

export interface MarketConfig extends _MarketConfig {
  marketType: MarketType;
  settlementType: SettlementType;
}

export interface OpenOrder extends _OpenOrder {
  side: Side;
  orderType: DerivativeOrderType;
}

export interface OrdersAccountState extends _OrdersAccountState {
  openOrders: OpenOrder[];
}

export interface SubAccountCache extends _SubAccountCache {
  margining: SubAccountMargining;
}

export interface CypherAccountState extends _CypherAccount {
  accountType: AccountType;
  subAccountCaches: SubAccountCache[];
}

export interface CypherSubAccountState extends _CypherSubAccount {
  positions: PositionSlot[];
}

export interface PoolState extends _Pool {
  config: PoolConfig;
  nodes: NodeInfo[];
}

export interface PositionSlot extends _PositionSlot {
  spot: SpotPositionState;
  derivative: DerivativePositionState;
}

export interface SpotPositionState extends _SpotPosition {
  openOrdersCache: OpenOrdersCache;
}

export interface DerivativePositionState extends _DerivativePosition {
  openOrdersCache: OpenOrdersCache;
  marketType: MarketType;
}

export interface CacheAccountState extends _CacheAccount {
  caches: Cache[];
}
