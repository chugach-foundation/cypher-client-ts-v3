import { BorshCoder, Idl, BN, Coder } from '@project-serum/anchor';
import _cypherIdl from '../generated/idl/cypher.json';
import _liquidityIncentiveProgramIdl from '../generated/idl/liquidityIncentiveProgram.json';

export const cypherIdl = _cypherIdl as Idl;
export const liquidityIncentiveProgramIdl =
  _liquidityIncentiveProgramIdl as Idl;
export const cypherCoder = new BorshCoder(cypherIdl) as Coder;

export function bnToDate(bn: BN): Date {
  return new Date(bn.toNumber() * 1000);
}

export function dateToBn(date: Date): BN {
  return new BN(date.valueOf() / 1_000);
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
