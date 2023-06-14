import {
  Keypair,
  TransactionInstruction,
  SystemProgram,
  PublicKey
} from '@solana/web3.js';
import * as Aaob from '@chugach-foundation/aaob';
import { struct, u8, u32 } from 'buffer-layout';
import { TokenInstructions } from '@project-serum/serum';
import { CypherClient } from '../client';
import { AnchorProvider } from '@project-serum/anchor';

export const makeCreateMarketAccountsIxs = async (client: CypherClient) => {
  const eventCapacity = 50;
  const callbackInfoLen = 34;
  const orderCapacity = 1_000;

  const signers: Keypair[] = [];
  const ixs: TransactionInstruction[] = [];

  // Market account
  const marketFull = new Keypair();
  ixs.push(
    SystemProgram.createAccount({
      fromPubkey: client.walletPubkey,
      lamports: await client.connection.getMinimumBalanceForRentExemption(
        Aaob.MarketState.LEN
      ),
      newAccountPubkey: marketFull.publicKey,
      programId: client.cypherPID,
      space: Aaob.MarketState.LEN
    })
  );
  signers.push(marketFull);

  // Event queue account
  const eventQueueFull = new Keypair();
  const eventQueueSize = Aaob.EventQueue.computeAllocationSize(
    eventCapacity,
    callbackInfoLen
  );
  ixs.push(
    SystemProgram.createAccount({
      fromPubkey: client.walletPubkey,
      lamports: await client.connection.getMinimumBalanceForRentExemption(
        eventQueueSize
      ),
      newAccountPubkey: eventQueueFull.publicKey,
      programId: client.cypherPID,
      space: eventQueueSize
    })
  );
  signers.push(eventQueueFull);

  // Bids account
  const bidsFull = new Keypair();
  const slabSize = Aaob.Slab.computeAllocationSize(
    orderCapacity,
    callbackInfoLen
  );
  ixs.push(
    SystemProgram.createAccount({
      fromPubkey: client.walletPubkey,
      lamports: await client.connection.getMinimumBalanceForRentExemption(
        slabSize
      ),
      newAccountPubkey: bidsFull.publicKey,
      programId: client.cypherPID,
      space: slabSize
    })
  );
  signers.push(bidsFull);

  // Asks account
  const asksFull = new Keypair();
  ixs.push(
    SystemProgram.createAccount({
      fromPubkey: client.walletPubkey,
      lamports: await client.connection.getMinimumBalanceForRentExemption(
        slabSize
      ),
      newAccountPubkey: asksFull.publicKey,
      programId: client.cypherPID,
      space: slabSize
    })
  );
  signers.push(asksFull);

  const priceHistoryFull = new Keypair();
  ixs.push(
    await client.accounts.priceHistory.createInstruction(priceHistoryFull)
  );
  signers.push(priceHistoryFull);

  return {
    orderbook: marketFull.publicKey,
    eventQueue: eventQueueFull.publicKey,
    bids: bidsFull.publicKey,
    asks: asksFull.publicKey,
    priceHistory: priceHistoryFull.publicKey,
    ixs,
    signers
  };
};

export const makeRequestCuIx = (payer: PublicKey, units: number) => {
  const p = new PublicKey('ComputeBudget111111111111111111111111111111');
  const params = { instruction: 0, units, additionalFee: 0 };
  const layout = struct([
    u8('instruction'),
    u32('units'),
    u32('additionalFee')
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode(params, data);
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: false
    }
  ];
  return new TransactionInstruction({
    keys,
    programId: p,
    data
  });
};

export const makeCreateMintIxs = async (
  provider: AnchorProvider,
  authority: PublicKey,
  mint: PublicKey,
  decimals?: number
): Promise<TransactionInstruction[]> => {
  return [
    SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: mint,
      space: 82,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(82),
      programId: TokenInstructions.TOKEN_PROGRAM_ID
    }),
    TokenInstructions.initializeMint({
      mint,
      decimals: decimals ?? 0,
      mintAuthority: authority
    })
  ];
};

export const makeCreateTokenAccountIxs = async (
  provider: AnchorProvider,
  newAccountPubkey: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  lamports?: number
): Promise<TransactionInstruction[]> => {
  if (lamports === undefined) {
    lamports = await provider.connection.getMinimumBalanceForRentExemption(165);
  }
  return [
    SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey,
      space: 165,
      lamports,
      programId: TokenInstructions.TOKEN_PROGRAM_ID
    }),
    TokenInstructions.initializeAccount({
      account: newAccountPubkey,
      mint,
      owner
    })
  ];
};
