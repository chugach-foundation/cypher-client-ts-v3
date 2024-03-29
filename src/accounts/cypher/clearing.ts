import { PublicKey, SystemProgram } from '@solana/web3.js';
import { CypherClient } from '../../client';
import type { CreateClearingArgs, ClearingState } from '../../types';
import {
  derivePublicClearingAddress,
  derivePrivateClearingAddress
} from '../../utils/pda';

export class Clearing {
  constructor(
    public readonly address: PublicKey,
    public readonly state: ClearingState
  ) {}

  static async createPublicClearing(
    client: CypherClient,
    authority: PublicKey,
    args: CreateClearingArgs
  ) {
    const [clearing, bump] = derivePublicClearingAddress(client.cypherPID);
    args.bump = bump;

    const ix = await client.methods
      .createPublicClearing({
        ...args,
        clearingType: args.clearingType as never
      })
      .accountsStrict({
        clearing,
        authority,
        payer: client.walletPubkey,
        systemProgram: SystemProgram.programId
      })
      .instruction();

    return {
      clearing,
      ixs: [ix],
      signers: []
    };
  }

  static async createPrivateClearing(
    client: CypherClient,
    authority: PublicKey,
    args: CreateClearingArgs
  ) {
    const [publicClearing] = derivePublicClearingAddress(client.cypherPID);
    const [privateClearing, privateClearingBump] = derivePrivateClearingAddress(
      args.clearingNumber,
      client.cypherPID
    );
    args.bump = privateClearingBump;

    const ix = await client.methods
      .createPrivateClearing({
        ...args,
        clearingType: args.clearingType as never
      })
      .accountsStrict({
        clearing: publicClearing,
        privateClearing: privateClearing,
        authority,
        payer: client.walletPubkey,
        systemProgram: SystemProgram.programId
      })
      .instruction();

    return {
      privateClearing,
      ixs: [ix],
      signers: []
    };
  }

  static async load(client: CypherClient, address: PublicKey) {
    const state = (await client.accounts.clearing.fetch(
      address
    )) as ClearingState;
    return new Clearing(address, state);
  }
}
