/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { CypherClient } from '../../client';
import { deriveAccountAddress } from '../../utils';
import { CypherAccountState, ErrorCB, StateUpdateHandler } from '../../types';
import { I80F48 } from '@blockworks-foundation/mango-client';
import {
  deriveOrdersAccountAddress,
  deriveSerumOrdersAccountAddress
} from '../../utils/pda';
import { Pool } from './pool';
import { DerivativesOrdersAccount } from './ordersAccount';
import { FuturesMarketViewer, PerpMarketViewer } from '../../viewers';
import { getAssociatedTokenAddress } from '@project-serum/associated-token';
import { CypherSubAccount } from './subAccount';
import { CacheAccount } from './cacheAccount';

export class CypherAccount {
  private _listener: number;
  constructor(
    readonly client: CypherClient,
    readonly address: PublicKey,
    public state: CypherAccountState,
    private _onStateUpdate?: StateUpdateHandler<CypherAccountState>,
    private _errorCallback?: ErrorCB
  ) {
    _onStateUpdate && this.subscribe();
  }

  static async create(
    client: CypherClient,
    clearing: PublicKey,
    authority: PublicKey,
    accountNumber = 0
  ) {
    const [account, bump] = deriveAccountAddress(
      authority,
      accountNumber,
      client.cypherPID
    );
    const ix = await client.methods
      .createAccount(accountNumber, bump)
      .accountsStrict({
        clearing,
        masterAccount: account,
        authority,
        payer: client.walletPubkey,
        systemProgram: SystemProgram.programId
      })
      .instruction();

    return {
      account,
      ixs: [ix],
      signers: []
    };
  }

  static async createWhitelisted(
    client: CypherClient,
    clearing: PublicKey,
    whitelist: PublicKey,
    authority: PublicKey,
    accountNumber = 0
  ) {
    const [account, bump] = deriveAccountAddress(
      authority,
      accountNumber,
      client.cypherPID
    );
    const ix = await client.methods
      .createWhitelistedAccount(accountNumber, bump)
      .accountsStrict({
        clearing,
        whitelist,
        masterAccount: account,
        authority,
        payer: client.walletPubkey,
        systemProgram: SystemProgram.programId
      })
      .instruction();

    return {
      account,
      ixs: [ix],
      signers: []
    };
  }

  static async load(
    client: CypherClient,
    address: PublicKey,
    onStateUpdateHandler?: StateUpdateHandler<CypherAccountState>,
    errorCallback?: ErrorCB
  ) {
    const state = await client.accounts.cypherAccount.fetchNullable(address);

    if (state === null) return null;

    return new CypherAccount(
      client,
      address,
      state as CypherAccountState,
      onStateUpdateHandler,
      errorCallback
    );
  }

  static async loadMultiple(
    client: CypherClient,
    accountAddresses: PublicKey[],
    onStateUpdateHandler?: StateUpdateHandler<CypherAccountState>,
    errorCallback?: ErrorCB
  ): Promise<CypherAccount[]> {
    const accounts: CypherAccount[] = [];
    const queryResult = await client.accounts.cypherAccount.fetchMultiple(
      accountAddresses
    );
    let i = 0;
    for (const result of queryResult) {
      if (result) {
        const subAccount = result as CypherAccountState;
        accounts.push(
          new CypherAccount(
            client,
            accountAddresses[i],
            subAccount,
            onStateUpdateHandler,
            errorCallback
          )
        );
      }
      i += 1;
    }
    return accounts;
  }

  getSubAccounts(): PublicKey[] {
    const subAccounts: PublicKey[] = [];

    for (const subAccountCache of this.state.subAccountCaches) {
      if (!subAccountCache.subAccount.equals(PublicKey.default)) {
        subAccounts.push(subAccountCache.subAccount);
      }
    }

    return subAccounts;
  }

  getCRatio(
    cacheAccount: CacheAccount,
    subAccounts: CypherSubAccount[]
  ): {
    assetsValue: I80F48;
    assetsValueUnweighted: I80F48;
    volatileAssetsValue: I80F48;
    liabilitiesValue: I80F48;
    liabilitiesValueUnweighted: I80F48;
    volatileLiabilitiesValue: I80F48;
    cRatio: I80F48;
    volatileCRatio: I80F48;
  } {
    const totalAssetsValue = I80F48.fromNumber(0);
    const totalAssetsValueUnweighted = I80F48.fromNumber(0);
    const totalVolatileAssetsValue = I80F48.fromNumber(0);
    const totalLiabilitiesValue = I80F48.fromNumber(0);
    const totalLiabilitiesValueUnweighted = I80F48.fromNumber(0);
    const totalVolatileLiabilitiesValue = I80F48.fromNumber(0);

    for (const subAccount of subAccounts) {
      const { assetsValue, assetsValueUnweighted, volatileAssetsValue } =
        subAccount.getAssetsValue(cacheAccount);
      const {
        liabilitiesValue,
        liabilitiesValueUnweighted,
        volatileLiabilitiesValue
      } = subAccount.getLiabilitiesValue(cacheAccount);

      if ((subAccount.state.marginingType as any).cross) {
        totalAssetsValue.iadd(assetsValue);
        totalAssetsValueUnweighted.iadd(assetsValueUnweighted);
        totalVolatileAssetsValue.iadd(volatileAssetsValue);
        totalLiabilitiesValue.iadd(liabilitiesValue);
        totalLiabilitiesValueUnweighted.iadd(liabilitiesValueUnweighted);
        totalVolatileLiabilitiesValue.iadd(volatileLiabilitiesValue);
      }
      // const cRatio = assetsValue.div(liabsValue);
      // console.log(
      //   'SubAccount:',
      //   subAccount.address.toString(),
      //   'Assets:',
      //   assetsValue.toFixed(4),
      //   'Liabilities:',
      //   liabsValue.toFixed(4),
      //   'C-Ratio:',
      //   cRatio.toFixed(4)
      // );
    }

    return {
      assetsValue: totalAssetsValue,
      assetsValueUnweighted: totalAssetsValueUnweighted,
      volatileAssetsValue: totalVolatileAssetsValue,
      liabilitiesValue: totalLiabilitiesValue,
      liabilitiesValueUnweighted: totalLiabilitiesValueUnweighted,
      volatileLiabilitiesValue: totalVolatileLiabilitiesValue,
      cRatio: totalLiabilitiesValue.isZero()
        ? new I80F48(I80F48.MAX_BN)
        : totalAssetsValue.div(totalLiabilitiesValue),
      volatileCRatio: totalVolatileLiabilitiesValue.isZero()
        ? new I80F48(I80F48.MAX_BN)
        : totalVolatileAssetsValue.div(totalVolatileLiabilitiesValue)
    };
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
        this.state = this.client.program.coder.accounts.decode(
          'CypherAccount',
          data
        );
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

  getSpotOpenOrdersAddress(dexMarket: PublicKey, subAccount: PublicKey) {
    const [address] = deriveSerumOrdersAccountAddress(
      dexMarket,
      this.address,
      subAccount,
      this.client.cypherPID
    );
    return address;
  }

  getDerivativesOpenOrdersAddress(market: PublicKey) {
    const [address] = deriveOrdersAccountAddress(
      this.address,
      market,
      this.client.cypherPID
    );
    return address;
  }

  async hasSpotOpenOrders(dexMarket: PublicKey, subAccount: PublicKey) {
    const spotOpenOrders = this.getSpotOpenOrdersAddress(dexMarket, subAccount);
    const accountState = await this.client.connection.getAccountInfo(
      spotOpenOrders
    );
    if (accountState) {
      return true;
    } else {
      return false;
    }
  }

  async hasDerivativeOpenOrders(market: PublicKey) {
    const ordersAccountAddress = this.getDerivativesOpenOrdersAddress(market);
    const accountState = await this.client.accounts.ordersAccount.fetchNullable(
      ordersAccountAddress
    );
    if (accountState) {
      return true;
    } else {
      return false;
    }
  }

  async getSpotMarketOrders(pool: Pool) {
    if (pool.market)
      return await pool.market.loadOrdersForOwner(
        this.client.connection,
        this.address
      );
    return [];
  }

  async getDerivativeMarketOrders(
    market: FuturesMarketViewer | PerpMarketViewer
  ) {
    const ordersAccountAddress = this.getDerivativesOpenOrdersAddress(
      market.address
    );
    const ordersAccount = await DerivativesOrdersAccount.load(
      this.client,
      ordersAccountAddress
    );
    return ordersAccount.getOrders(market);
  }

  async getAssociatedTokenAddress(tokenMint: PublicKey): Promise<PublicKey> {
    return getAssociatedTokenAddress(this.client.walletPubkey, tokenMint);
  }
}
