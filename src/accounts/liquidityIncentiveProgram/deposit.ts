import {
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram
} from '@solana/web3.js';
import { LiquidityIncentiveClient } from '../../client/liquidityIncentiveProgram';
import { DepositState, ErrorCB } from '../../types';
import { StateUpdateHandler } from '../../types/index';
import { Campaign } from './campaign';
import {
  deriveAccountAddress,
  deriveDepositAuthority,
  derivePublicClearingAddress,
  deriveSubAccountAddress
} from '../../utils/pda';
import { BN } from '@project-serum/anchor';
import { CONFIGS } from '../../constants/shared';
import { getAssociatedTokenAddress } from '@project-serum/associated-token';
import { Pool, PoolNode } from '../cypher';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

export class Deposit {
  private _listener: number;

  constructor(
    readonly client: LiquidityIncentiveClient,
    readonly address: PublicKey,
    public state: DepositState,
    private _onStateUpdate?: StateUpdateHandler<DepositState>,
    private _errorCallback?: ErrorCB
  ) {
    _onStateUpdate && this.subscribe();
  }

  static async create(
    client: LiquidityIncentiveClient,
    campaign: Campaign,
    pool: Pool,
    poolNode: PoolNode,
    authority: PublicKey,
    amount: BN
  ) {
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
    const [cypherAccount, accountBump] = deriveAccountAddress(
      depositAuthority,
      0,
      client.cypherProgramId
    );
    const [cypherSubAccount, subAccountBump] = deriveSubAccountAddress(
      cypherAccount,
      0,
      client.cypherProgramId
    );

    const fundingAccount = await getAssociatedTokenAddress(
      authority,
      campaign.state.assetMint
    );

    const ix = await client.methods
      .createDeposit(accountBump, subAccountBump, amount)
      .accountsStrict({
        campaign: campaign.address,
        deposit: deposit.publicKey,
        cacheAccount: CONFIGS[client.cluster].CACHE,
        clearing,
        cypherAccount,
        cypherSubAccount,
        depositAuthority,
        fundingAccount,
        tempTokenAccount: tempTokenAccount.publicKey,
        assetMint: campaign.state.assetMint,
        pool: pool.address,
        poolNode: poolNode.address,
        poolNodeVault: poolNode.vaultAddress(),
        payer: authority,
        signer: authority,
        cypherProgram: client.cypherProgramId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId
      })
      .instruction();

    return {
      deposit: deposit.publicKey,
      ixs: [ix],
      signers: [deposit, tempTokenAccount]
    };
  }

  async end(
    client: LiquidityIncentiveClient,
    campaign: Campaign,
    pool: Pool,
    poolNode: PoolNode,
    authority: PublicKey
  ) {
    const tempTokenAccount = new Keypair();

    const campaignRewardVault = campaign.rewardVaultAddress();
    const campaignRewardVaultAuthority = campaign.rewardVaultAuthorityAddress();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [depositAuthority, depositBump] = deriveDepositAuthority(
      this.address,
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
      authority,
      campaign.state.assetMint
    );

    const rewardTokenAccount = await getAssociatedTokenAddress(
      authority,
      campaign.state.rewardMint
    );

    const ix = await client.methods
      .endDeposit()
      .accountsStrict({
        campaign: campaign.address,
        campaignRewardVault,
        campaignRewardVaultAuthority,
        deposit: this.address,
        cacheAccount: CONFIGS[client.cluster].CACHE,
        clearing,
        cypherAccount,
        cypherSubAccount,
        depositAuthority,
        tempTokenAccount: tempTokenAccount.publicKey,
        assetTokenAccount,
        assetMint: campaign.state.assetMint,
        pool: pool.address,
        poolNode: poolNode.address,
        poolNodeVault: poolNode.vaultAddress(),
        poolNodeVaultSigner: poolNode.vaultSignerAddress(),
        rewardTokenAccount,
        rewardMint: campaign.state.rewardMint,
        payer: authority,
        signer: authority,
        cypherProgram: client.cypherProgramId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId
      })
      .instruction();

    return {
      deposit: this.address,
      ixs: [ix],
      signers: [tempTokenAccount]
    };
  }

  static async load(
    client: LiquidityIncentiveClient,
    address: PublicKey,
    onStateUpdateHandler?: StateUpdateHandler<DepositState>,
    errorCallback?: ErrorCB
  ) {
    const state = (await client.accounts.campaign.fetch(
      address
    )) as DepositState;
    return new Deposit(
      client,
      address,
      state,
      onStateUpdateHandler,
      errorCallback
    );
  }

  subscribe() {
    this.removeListener();
    try {
      this.addListener();
    } catch (error: unknown) {
      if (this._errorCallback) {
        this._errorCallback(error);
      }
    }
  }

  private addListener() {
    this._listener = this.client.connection.onAccountChange(
      this.address,
      ({ data }) => {
        this.state = this.client.program.coder.accounts.decode('Deposit', data);
        if (this._onStateUpdate) {
          this._onStateUpdate(this.state);
        }
      },
      'processed'
    );
  }

  private removeListener() {
    if (this._listener)
      this.client.connection.removeAccountChangeListener(this._listener);
  }

  async unsubscribe() {
    this.removeListener();
  }
}
