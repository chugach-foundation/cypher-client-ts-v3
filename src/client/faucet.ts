import {
  Keypair,
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  Transaction
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Idl, Program, AnchorProvider, utils } from '@project-serum/anchor';
import {
  createAssociatedTokenAccount,
  getAssociatedTokenAddress
} from '@project-serum/associated-token';
import { makeCreateMintIxs } from '../instructions';
import { CONFIGS } from '../constants';
import type { Cluster, Wallet } from '../types';
import type { Faucet } from '../generated/types/faucet';
import testDriverIdl from '../generated/idl/faucet.json';
import faucetMint from './faucetMint.json';

export class FaucetClient {
  private _program: Program<Faucet>;

  constructor(
    private _cluster: Cluster,
    rpcEndpoint: string,
    wallet: Wallet,
    confirmOpts = AnchorProvider.defaultOptions()
  ) {
    const conn = new Connection(rpcEndpoint, confirmOpts.commitment);
    const provider = new AnchorProvider(conn, wallet, confirmOpts);
    this._program = new Program(
      testDriverIdl as Idl,
      CONFIGS[_cluster].FAUCET_PID,
      provider
    ) as Program<Faucet>;
  }

  static get quoteMintAddrFull(): Keypair {
    return Keypair.fromSecretKey(Uint8Array.from(faucetMint));
  }

  static deriveFaucetAddress(cluster: Cluster, mint: PublicKey): PublicKey {
    return utils.publicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode('FAUCET'), mint.toBuffer()],
      CONFIGS[cluster].FAUCET_PID
    )[0];
  }

  static deriveMintAuthority(
    cluster: Cluster,
    mint: PublicKey
  ): [PublicKey, number] {
    return utils.publicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode('MINT_AUTHORITY'), mint.toBuffer()],
      CONFIGS[cluster].FAUCET_PID
    );
  }

  private get _provider(): AnchorProvider {
    return this._program?.provider as AnchorProvider;
  }

  private get _walletPubkey(): PublicKey {
    return this._provider?.wallet.publicKey;
  }

  async initFaucet(mint: Keypair, decimals: number): Promise<string> {
    const faucet = FaucetClient.deriveFaucetAddress(
      this._cluster,
      mint.publicKey
    );
    const [mintAuthority, mintAuthorityBump] = FaucetClient.deriveMintAuthority(
      this._cluster,
      mint.publicKey
    );
    return this._program.methods
      .initFaucet(mintAuthorityBump)
      .accounts({
        faucet: faucet,
        mint: mint.publicKey,
        mintAuthority: mintAuthority,
        payer: this._walletPubkey,
        systemProgram: SystemProgram.programId
      })
      .preInstructions(
        await makeCreateMintIxs(
          this._provider,
          mintAuthority,
          mint.publicKey,
          decimals
        )
      )
      .signers([mint])
      .rpc();
  }

  async getRequestInstr(
    mint: PublicKey,
    target: PublicKey
  ): Promise<TransactionInstruction> {
    const faucet = FaucetClient.deriveFaucetAddress(this._cluster, mint);
    const [mintAuthority] = FaucetClient.deriveMintAuthority(
      this._cluster,
      mint
    );

    return this._program.methods
      .request()
      .accounts({
        faucet,
        mint,
        target,
        mintAuthority,
        tokenProgram: TOKEN_PROGRAM_ID
      })
      .instruction();
  }

  async mint(mint: PublicKey) {
    const associatedTokenAddr = await getAssociatedTokenAddress(
      this._walletPubkey,
      mint
    );
    const info = await this._program.provider.connection.getAccountInfo(
      associatedTokenAddr,
      this._program.provider.connection.commitment
    );
    const tx = new Transaction();
    if (info === null) {
      tx.add(
        await createAssociatedTokenAccount(
          this._walletPubkey,
          this._walletPubkey,
          mint
        )
      );
    }
    tx.add(await this.getRequestInstr(mint, associatedTokenAddr));
    return this._provider.sendAndConfirm(tx);
  }
}
