import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { Market } from '@project-serum/serum';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { CypherClient } from '../client';
import {
  derivePoolAddress,
  derivePoolNodeAddress,
  derivePoolNodeVaultAddress
} from '../utils';
import type {
  CreatePoolArgs,
  ErrorCB,
  PoolState,
  StateUpdateHandler
} from '../types';
import { I80F48, ZERO_I80F48 } from '@blockworks-foundation/mango-client';

export class Pool {
  private _listener: number;
  constructor(
    readonly client: CypherClient,
    readonly address: PublicKey,
    public state: PoolState,
    readonly market?: Market,
    private _onStateUpdate?: StateUpdateHandler<PoolState>,
    private _errorCallback?: ErrorCB
  ) {
    _onStateUpdate && this.subscribe();
  }

  static async create(
    client: CypherClient,
    clearing: PublicKey,
    cacheAccount: PublicKey,
    tokenMint: PublicKey,
    authority: PublicKey,
    dexMarket: PublicKey,
    oracleProducts: PublicKey,
    args: CreatePoolArgs
  ) {
    const [pool, poolBump] = derivePoolAddress(args.poolName, client.cypherPID);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [poolNode, poolNodeBump] = derivePoolNodeAddress(
      pool,
      0,
      client.cypherPID
    );
    const [tokenVault] = derivePoolNodeVaultAddress(poolNode, client.cypherPID);
    args.poolBump = poolBump;
    await client.methods
      .createPool(args)
      .accounts({
        clearing,
        cacheAccount,
        pool,
        tokenMint,
        tokenVault,
        oracleProducts,
        dexMarket,
        authority,
        payer: client.walletPubkey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY
      })
      .rpc();

    return pool;
  }

  static async load(
    client: CypherClient,
    address: PublicKey,
    onStateUpdateHandler?: StateUpdateHandler<PoolState>,
    errorCallback?: ErrorCB
  ): Promise<Pool> {
    const state = (await client.accounts.pool.fetchNullable(
      address
    )) as PoolState;

    const isUsdcOrNonSerumMarket =
      state.tokenMint.equals(client.quoteMint) ||
      state.dexMarket.equals(SystemProgram.programId);

    const market = isUsdcOrNonSerumMarket
      ? null
      : await Market.load(
          client.connection,
          state.dexMarket,
          {},
          client.dexPID
        );

    return new Pool(
      client,
      address,
      state,
      market,
      onStateUpdateHandler,
      errorCallback
    );
  }

  static async loadAll(client: CypherClient): Promise<Pool[]> {
    const pools: Pool[] = [];
    const queryResult = await client.accounts.pool.all();
    for (const result of queryResult) {
      if (!result.account.tokenMint.equals(client.quoteMint)) {
        const market = await Market.load(
          client.connection,
          result.account.dexMarket,
          {},
          client.dexPID
        );
        pools.push(
          new Pool(
            client,
            result.publicKey,
            result.account as PoolState,
            market
          )
        );
      } else {
        pools.push(
          new Pool(client, result.publicKey, result.account as PoolState)
        );
      }
    }
    return pools;
  }

  get dexMarket(): PublicKey {
    return this.state.dexMarket;
  }

  get maxApr(): I80F48 {
    return I80F48.fromNumber(this.state.config.maxApr);
  }

  get optimalApr(): I80F48 {
    return I80F48.fromNumber(this.state.config.optimalApr);
  }

  get optimalUtil(): I80F48 {
    return I80F48.fromNumber(this.state.config.optimalUtil);
  }

  get deposits(): I80F48 {
    return new I80F48(this.state.deposits);
  }

  get borrows(): I80F48 {
    return new I80F48(this.state.borrows);
  }

  get totalDeposits(): I80F48 {
    return this.deposits.mul(this.depositIndex);
  }

  get totalBorrows(): I80F48 {
    return this.borrows.mul(this.borrowIndex);
  }

  get depositIndex(): I80F48 {
    return new I80F48(this.state.depositIndex);
  }

  get borrowIndex(): I80F48 {
    return new I80F48(this.state.borrowIndex);
  }

  get depositRate(): I80F48 {
    const deposits = this.totalDeposits;
    const borrows = this.totalBorrows;
    const borrowRate = this.borrowRate;

    if (deposits.isZero() && borrows.isZero()) {
      return ZERO_I80F48;
    } else if (deposits.isZero()) {
      return this.maxApr;
    }

    const utilization = borrows.mul(I80F48.fromNumber(100)).div(deposits);

    return borrowRate.mul(utilization).div(I80F48.fromNumber(100));
  }

  get borrowRate(): I80F48 {
    const deposits = this.totalDeposits;
    const borrows = this.totalBorrows;
    const { optimalUtil, optimalApr, maxApr } = this;

    if (deposits.isZero() && borrows.isZero()) {
      return ZERO_I80F48;
    }

    if (borrows.gte(deposits)) {
      return this.maxApr;
    }

    const utilization = borrows.mul(I80F48.fromNumber(100)).div(deposits);

    if (utilization.gte(optimalUtil)) {
      const extraUtil = utilization.sub(optimalUtil);
      const slope = maxApr
        .sub(optimalApr)
        .div(I80F48.fromNumber(100).sub(optimalUtil));
      return optimalApr.add(slope.mul(extraUtil));
    }

    const slope = optimalApr.div(optimalUtil);
    return slope.mul(utilization);
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
        this.state = this.client.program.coder.accounts.decode('Pool', data);
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
