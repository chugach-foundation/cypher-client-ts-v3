import { PublicKey, SystemProgram } from '@solana/web3.js';
import { CypherClient } from '../../client';
import { OracleProductsState } from '../../types';
import { CreateOracleProductsArgs } from '../../types/cypher';
import { deriveOracleProductsAddress } from '../../utils/pda';

export class OracleProducts {
  constructor(
    public readonly address: PublicKey,
    public readonly state: OracleProductsState
  ) {}

  static async create(
    client: CypherClient,
    cacheAccount: PublicKey,
    authority: PublicKey,
    oracleAddrs: PublicKey[],
    args: CreateOracleProductsArgs
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [oracleProductsAddress, bump] = deriveOracleProductsAddress(
      args.symbol,
      client.cypherPID
    );
    const ix = await client.methods
      .createOracleProducts({
        ...args,
        productsType: args.productsType as never
      })
      .accountsStrict({
        cacheAccount,
        oracleProducts: oracleProductsAddress,
        payer: authority,
        authority,
        systemProgram: SystemProgram.programId
      })
      .remainingAccounts(
        oracleAddrs.map((product) => ({
          pubkey: product,
          isSigner: false,
          isWritable: false
        }))
      )
      .instruction();

    return {
      oracleProducts: oracleProductsAddress,
      ixs: [ix],
      signers: []
    };
  }

  static async load(client: CypherClient, address: PublicKey) {
    const state = (await client.accounts.oracleProducts.fetch(
      address
    )) as OracleProductsState;
    return new OracleProducts(address, state);
  }
}
