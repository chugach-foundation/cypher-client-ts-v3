import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import { LiquidityIncentiveProgramClient } from '../client';
import { BN } from '@project-serum/anchor';
import { CONFIGS } from '../constants/shared';
import { TransactionInstruction } from '@solana/web3.js';
import {
  deriveDepositAuthority,
  derivePublicClearingAddress,
  deriveAccountAddress,
  deriveSubAccountAddress
} from '../utils/pda';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

export const makeCreateDepositIx = async (
  client: LiquidityIncentiveProgramClient,
  campaign: PublicKey,
  poolAddress: PublicKey,
  poolNodeAddress: PublicKey,
  poolNodeVaultAddress: PublicKey,
  assetMint: PublicKey,
  rewardMint: PublicKey,
  amount: BN
): Promise<{
  signers: Keypair[];
  ixs: TransactionInstruction[];
}> => {
  const deposit = new Keypair();
  const tempTokenAccount = new Keypair();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [depositAuthority, depositBump] = deriveDepositAuthority(
    deposit.publicKey,
    client.programId
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clearing, clearingBump] = derivePublicClearingAddress(
    client.cypherProgramId
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cypherAccount, accountBump] = deriveAccountAddress(
    depositAuthority,
    0,
    client.cypherProgramId
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cypherSubAccount, subAccountBump] = deriveSubAccountAddress(
    cypherAccount,
    0,
    client.cypherProgramId
  );

  const fundingAccount = await getAssociatedTokenAddress(
    client.walletPubkey,
    assetMint
  );

  return {
    signers: [deposit, tempTokenAccount],
    ixs: [
      await client.methods
        .createDeposit(accountBump, subAccountBump, amount)
        .accountsStrict({
          campaign: campaign,
          deposit: deposit.publicKey,
          cacheAccount: CONFIGS[client.cluster].CACHE,
          clearing,
          cypherAccount,
          cypherSubAccount,
          depositAuthority,
          fundingAccount,
          tempTokenAccount: tempTokenAccount.publicKey,
          assetMint: assetMint,
          pool: poolAddress,
          poolNode: poolNodeAddress,
          poolNodeVault: poolNodeVaultAddress,
          payer: client.walletPubkey,
          signer: client.walletPubkey,
          cypherProgram: client.cypherProgramId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId
        })
        .instruction()
    ]
  };
};

export const makeEndDepositIx = async (
  client: LiquidityIncentiveProgramClient,
  campaign: PublicKey,
  campaignRewardVault: PublicKey,
  campaignRewardVaultAuthority: PublicKey,
  deposit: PublicKey,
  pool: PublicKey,
  poolNode: PublicKey,
  poolNodeVault: PublicKey,
  poolNodeVaultSigner: PublicKey,
  assetMint: PublicKey,
  rewardMint: PublicKey
): Promise<{
  signers: Keypair[];
  ixs: TransactionInstruction[];
}> => {
  const tempTokenAccount = new Keypair();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [depositAuthority, depositBump] = deriveDepositAuthority(
    deposit,
    client.programId
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clearing, clearingBump] = derivePublicClearingAddress(
    client.cypherProgramId
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cypherAccount, accountBump] = deriveAccountAddress(
    depositAuthority,
    0,
    client.cypherProgramId
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cypherSubAccount, subAccountBump] = deriveSubAccountAddress(
    cypherAccount,
    0,
    client.cypherProgramId
  );

  const assetTokenAccount = await getAssociatedTokenAddress(
    client.walletPubkey,
    assetMint
  );

  const rewardTokenAccount = await getAssociatedTokenAddress(
    client.walletPubkey,
    rewardMint
  );
  return {
    signers: [tempTokenAccount],
    ixs: [
      await client.methods
        .endDeposit()
        .accountsStrict({
          campaign: campaign,
          campaignRewardVault,
          campaignRewardVaultAuthority,
          deposit,
          cacheAccount: CONFIGS[client.cluster].CACHE,
          clearing,
          cypherAccount,
          cypherSubAccount,
          depositAuthority,
          tempTokenAccount: tempTokenAccount.publicKey,
          assetTokenAccount,
          assetMint: assetMint,
          pool,
          poolNode,
          poolNodeVault,
          poolNodeVaultSigner,
          rewardTokenAccount,
          rewardMint,
          payer: client.walletPubkey,
          signer: client.walletPubkey,
          cypherProgram: client.cypherProgramId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId
        })
        .instruction()
    ]
  };
};
