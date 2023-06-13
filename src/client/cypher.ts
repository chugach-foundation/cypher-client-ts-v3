import { AnchorProvider } from '@project-serum/anchor';
import { FaucetClient } from './faucet';
import { CONFIGS } from '../constants';
import cypherIdl from '../generated/idl/cypher.json';
import type { Cypher } from '../generated/types/cypher';
import type { Cluster, Wallet } from '../types';
import { PublicKey } from '@solana/web3.js';
import { ProgramClient } from './client';

export class CypherClient extends ProgramClient<Cypher> {
  public faucet: FaucetClient;

  constructor(
    readonly cluster: Cluster,
    rpcEndpoint: string,
    wallet?: Wallet,
    confirmOpts = AnchorProvider.defaultOptions()
  ) {
    super(
      cypherIdl as Cypher,
      CONFIGS[cluster].CYPHER_PID,
      rpcEndpoint,
      wallet,
      confirmOpts
    );

    if (this.cluster !== 'mainnet-beta') {
      this.faucet = new FaucetClient(
        this.cluster,
        rpcEndpoint,
        wallet,
        confirmOpts
      );
    }
  }

  get cypherPID(): PublicKey {
    return CONFIGS[this.cluster].CYPHER_PID;
  }

  get dexPID(): PublicKey {
    return CONFIGS[this.cluster].DEX_PID;
  }

  get quoteMint(): PublicKey {
    return CONFIGS[this.cluster].QUOTE_MINT;
  }
}
