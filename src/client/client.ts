import {
  AnchorProvider,
  MethodsNamespace,
  Provider,
  Idl,
  AccountNamespace,
  Program
} from '@project-serum/anchor';
import {
  ConfirmOptions,
  Connection,
  PublicKey,
  Signer,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js';
import { Wallet } from '../types';

export interface IProgramClient<IDL extends Idl = Idl> {
  program: Program<IDL>;
  get programId(): PublicKey;
  get provider(): Provider;
  get anchorProvider(): AnchorProvider;
  get connection(): Connection;
  get methods(): MethodsNamespace<IDL>;
  get accounts(): AccountNamespace<IDL>;
  get isWalletConnected(): boolean;
  get walletPubkey(): PublicKey;
}

export class ProgramClient<IDL extends Idl = Idl>
  implements IProgramClient<IDL>
{
  public program: Program<IDL>;

  constructor(
    idl: IDL,
    readonly programId: PublicKey,
    rpcEndpoint: string,
    wallet?: Wallet,
    confirmOpts = AnchorProvider.defaultOptions()
  ) {
    const provider = {
      connection: new Connection(rpcEndpoint, confirmOpts.commitment)
    };
    this.program = new Program<IDL>(idl as IDL, programId, provider);

    if (wallet) {
      this.connectWallet(idl, programId, wallet, confirmOpts);
    }
  }

  connectWallet(
    idl: IDL,
    programId: PublicKey,
    wallet: Wallet,
    confirmOpts = AnchorProvider.defaultOptions()
  ) {
    const provider = new AnchorProvider(this.connection, wallet, confirmOpts);
    this.program = new Program<IDL>(idl as IDL, programId, provider);
  }

  get provider(): Provider {
    return this.program.provider;
  }

  get anchorProvider(): AnchorProvider {
    const provider = this.program.provider as AnchorProvider;
    if (provider.wallet) {
      return provider;
    }
  }

  get connection(): Connection {
    return this.provider.connection;
  }

  get methods(): MethodsNamespace<IDL> {
    return this.program.methods;
  }

  get accounts(): AccountNamespace<IDL> {
    return this.program.account;
  }

  get isWalletConnected(): boolean {
    return !!this.anchorProvider;
  }

  get walletPubkey(): PublicKey {
    return this.anchorProvider?.wallet.publicKey;
  }

  addEventListener(
    eventName: string,
    // eslint-disable-next-line
    callback: (event: any, slot: number) => void
  ): number {
    return this.program.addEventListener(eventName, callback);
  }

  async removeEventListener(listener: number): Promise<void> {
    return await this.program.removeEventListener(listener);
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
