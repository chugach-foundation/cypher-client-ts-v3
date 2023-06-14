import { Event } from '@project-serum/anchor';
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types';
import type { LiquidityIncentiveProgram } from '../generated/types/liquidity_incentive_program';

export type Campaign = TypeDef<
  LiquidityIncentiveProgram['accounts'][0],
  LiquidityIncentiveProgram
>;
export type Deposit = TypeDef<
  LiquidityIncentiveProgram['accounts'][1],
  LiquidityIncentiveProgram
>;

export type CampaignCreatedLog = Event<LiquidityIncentiveProgram['events'][0]>;
export type DepositCreatedLog = Event<LiquidityIncentiveProgram['events'][1]>;
export type DepositEndedLog = Event<LiquidityIncentiveProgram['events'][2]>;
