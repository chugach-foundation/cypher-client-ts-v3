import {
  Transaction,
  TransactionInstruction,
  Signer,
  ConfirmOptions,
  Connection
} from '@solana/web3.js';
import {
  AccountNamespace,
  AnchorProvider,
  MethodsNamespace,
  Program,
  Provider
} from '@project-serum/anchor';
import { FaucetClient } from './faucet';
import { CONFIGS } from '../constants';
import cypherIdl from '../generated/idl/cypher.json';
import type { Cypher } from '../generated/types/cypher';
import type { Cluster, Wallet } from '../types';
import { PublicKey } from '@solana/web3.js';

export class CypherClient {
  private _program: Program<Cypher>;
  public faucet: FaucetClient;

  constructor(
    readonly cluster: Cluster,
    rpcEndpoint: string,
    wallet?: Wallet,
    confirmOpts = AnchorProvider.defaultOptions()
  ) {
    const provider = {
      connection: new Connection(rpcEndpoint, confirmOpts.commitment)
    };
    this._program = new Program<Cypher>(
      cypherIdl as Cypher,
      CONFIGS[this.cluster].CYPHER_PID,
      provider
    );
    if (wallet) {
      this.connectWallet(wallet, rpcEndpoint, confirmOpts);
    }
  }

  connectWallet(
    wallet: Wallet,
    rpcEndpoint: string,
    confirmOpts = AnchorProvider.defaultOptions()
  ) {
    const provider = new AnchorProvider(this.connection, wallet, confirmOpts);
    this._program = new Program<Cypher>(
      cypherIdl as Cypher,
      CONFIGS[this.cluster].CYPHER_PID,
      provider
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

  private get _provider(): Provider {
    return this._program.provider;
  }

  get anchorProvider(): AnchorProvider {
    const provider = this._program.provider as AnchorProvider;
    if (provider.wallet) {
      return provider;
    }
  }

  get connection(): Connection {
    return this._provider.connection;
  }

  get methods(): MethodsNamespace<Cypher> {
    return this._program.methods;
  }

  get accounts(): AccountNamespace<Cypher> {
    return this._program.account;
  }

  get isWalletConnected(): boolean {
    return !!this.anchorProvider;
  }

  get walletPubkey(): PublicKey {
    return this.anchorProvider?.wallet.publicKey;
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

  addEventListener(
    eventName: string,
    // eslint-disable-next-line
    callback: (event: any, slot: number) => void
  ): number {
    return this._program.addEventListener(eventName, callback);
  }

  async removeEventListener(listener: number): Promise<void> {
    return await this._program.removeEventListener(listener);
  }

  async sendAndConfirm(
    tx: Transaction,
    signers?: Signer[],
    opts?: ConfirmOptions
  ): Promise<string> {
    return this.anchorProvider?.sendAndConfirm(tx, signers, opts);
  }

  async sendAndConfirmIxs(
    ixs: TransactionInstruction[],
    signers?: Signer[],
    opts?: ConfirmOptions
  ): Promise<string> {
    const tx = new Transaction();
    tx.add(...ixs);
    return this.sendAndConfirm(tx, signers, opts);
  }
}
