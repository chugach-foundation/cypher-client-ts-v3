import {
  PublicKey,
  SystemProgram,
  TransactionInstruction
} from '@solana/web3.js';
import BN from 'bn.js';
import { createHash } from 'crypto';

export function makeInitSequenceInstruction(
  sequenceAccount: PublicKey,
  ownerPk: PublicKey,
  bump: number,
  sym: string,
  programId: PublicKey
): TransactionInstruction {
  const keys = [
    { isSigner: false, isWritable: true, pubkey: sequenceAccount },
    { isSigner: true, isWritable: true, pubkey: ownerPk },
    { isSigner: false, isWritable: false, pubkey: SystemProgram.programId }
  ];

  const variant = createHash('sha256')
    .update('global:initialize')
    .digest()
    .slice(0, 8);

  const bumpData = new BN(bump).toBuffer('le', 1);
  const strLen = new BN(sym.length).toBuffer('le', 4);
  const symEncoded = Buffer.from(sym);

  const data = Buffer.concat([variant, bumpData, strLen, symEncoded]);

  return new TransactionInstruction({
    keys,
    data,
    programId
  });
}

export function makeCheckAndSetSequenceNumberInstruction(
  sequenceAccount: PublicKey,
  ownerPk: PublicKey,
  seqNum: number,
  programId: PublicKey
): TransactionInstruction {
  const keys = [
    { isSigner: false, isWritable: true, pubkey: sequenceAccount },
    { isSigner: true, isWritable: false, pubkey: ownerPk }
  ];
  const variant = createHash('sha256')
    .update('global:check_and_set_sequence_number')
    .digest()
    .slice(0, 8);

  const seqNumBuffer = new BN(seqNum).toBuffer('le', 8);
  const data = Buffer.concat([variant, seqNumBuffer]);
  return new TransactionInstruction({
    keys,
    data,
    programId
  });
}

export function makeResetSequnceNumberInstruction(
  sequenceAccount: PublicKey,
  ownerPk: PublicKey,
  seqNum: number,
  programId: PublicKey
): TransactionInstruction {
  const keys = [
    { isSigner: false, isWritable: true, pubkey: sequenceAccount },
    { isSigner: true, isWritable: false, pubkey: ownerPk }
  ];
  const variant = createHash('sha256')
    .update('global:reset_sequence_number')
    .digest()
    .slice(0, 8);

  const seqNumBuffer = new BN(seqNum).toBuffer('le', 8);
  const data = Buffer.concat([variant, seqNumBuffer]);
  return new TransactionInstruction({
    keys,
    data,
    programId
  });
}
