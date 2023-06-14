import { AnchorProvider, Idl } from '@project-serum/anchor';
import liquidityIncentiveProgramIdl from '../generated/idl/liquidityIncentiveProgram.json';
import type { LiquidityIncentiveProgram } from '../generated/types/liquidityIncentiveProgram';
import type { Cluster, Wallet } from '../types';
import { CONFIGS } from '../constants';
import { ProgramClient } from './client';
import { PublicKey } from '@solana/web3.js';

export class LiquidityIncentiveClient extends ProgramClient<LiquidityIncentiveProgram> {
  readonly cypherProgramId: PublicKey;

  constructor(
    readonly cluster: Cluster,
    rpcEndpoint: string,
    wallet?: Wallet,
    confirmOpts = AnchorProvider.defaultOptions()
  ) {
    super(
      liquidityIncentiveProgramIdl as LiquidityIncentiveProgram,
      CONFIGS[cluster].LIP_PID,
      rpcEndpoint,
      wallet,
      confirmOpts
    );

    this.cypherProgramId = CONFIGS[cluster].CYPHER_PID;
  }
}
