/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { deriveSubAccountAddress, splToUiAmountFixed } from '../utils';
import { CypherClient } from '../client';
import {
  I80F48,
  ZERO_BN,
  ZERO_I80F48
} from '@blockworks-foundation/mango-client';
import type {
  CypherSubAccountState,
  DerivativePositionState,
  ErrorCB,
  SpotPositionState,
  StateUpdateHandler
} from '../types';
import { CacheAccount } from './cacheAccount';
import { SpotPosition } from '../viewers/spotPosition';
import { DerivativePosition } from '../viewers/derivativePosition';
import { QUOTE_TOKEN_DECIMALS } from '../constants/shared';

export class CypherSubAccount {
  private _listener: number;
  constructor(
    readonly client: CypherClient,
    readonly address: PublicKey,
    public state: CypherSubAccountState,
    private _onStateUpdate?: StateUpdateHandler<CypherSubAccountState>,
    private _errorCallback?: ErrorCB
  ) {
    _onStateUpdate && this.subscribe();
  }

  static async create(
    client: CypherClient,
    authority: PublicKey,
    masterAccount: PublicKey,
    accountNumber = 0,
    accountAlias: number[] = Array(32).fill(0)
  ) {
    const [subAccount, bump] = deriveSubAccountAddress(
      masterAccount,
      accountNumber,
      client.cypherPID
    );
    const ix = await client.methods
      .createSubAccount(accountNumber, bump, accountAlias)
      .accountsStrict({
        masterAccount,
        subAccount,
        authority,
        payer: client.walletPubkey,
        systemProgram: SystemProgram.programId
      })
      .instruction();

    return {
      subAccount,
      ixs: [ix],
      signers: []
    };
  }

  static async load(
    client: CypherClient,
    address: PublicKey,
    onStateUpdateHandler?: StateUpdateHandler<CypherSubAccountState>,
    errorCallback?: ErrorCB
  ) {
    const state = (await client.accounts.cypherSubAccount.fetchNullable(
      address
    )) as CypherSubAccountState;
    return new CypherSubAccount(
      client,
      address,
      state,
      onStateUpdateHandler,
      errorCallback
    );
  }

  getSpotPosition(tokenMint: PublicKey): SpotPosition {
    for (const position of this.state.positions) {
      if (position.spot.tokenMint.equals(tokenMint)) {
        return new SpotPosition(position.spot);
      }
    }
    return null;
  }

  // The position does not account for deposit or borrow interest
  // To get the actual value of the position
  // If its a deposit, multiply it by the deposit interest rate
  // If its a borrow, multiply it by the borrow interest rate
  // The index can be found in the resp cypher pool
  getSpotPositionsInfo(): SpotPositionState[] {
    const positions: SpotPositionState[] = [];
    for (const position of this.state.positions) {
      if (!position.spot.tokenMint.equals(PublicKey.default)) {
        positions.push(position.spot);
      }
    }
    return positions;
  }

  getSpotPositions(): SpotPosition[] {
    const positions: SpotPosition[] = [];
    for (const position of this.state.positions) {
      if (!position.spot.tokenMint.equals(PublicKey.default)) {
        positions.push(new SpotPosition(position.spot));
      }
    }
    return positions;
  }

  getDerivativePosition(market: PublicKey): DerivativePosition | null {
    for (const position of this.state.positions) {
      if (position.derivative.market.equals(market)) {
        return new DerivativePosition(position.derivative);
      }
    }
    return null;
  }

  getDerivativePositionsInfo(): DerivativePositionState[] {
    const positions: DerivativePositionState[] = [];
    for (const position of this.state.positions) {
      if (!position.derivative.market.equals(PublicKey.default)) {
        positions.push(position.derivative);
      }
    }
    return positions;
  }

  getDerivativePositions(): DerivativePosition[] {
    const positions: DerivativePosition[] = [];
    for (const position of this.state.positions) {
      if (!position.derivative.market.equals(PublicKey.default)) {
        positions.push(new DerivativePosition(position.derivative));
      }
    }
    return positions;
  }

  getAssetsValue(cacheAccount: CacheAccount): {
    assetsValueUnweighted: I80F48;
    assetsValue: I80F48;
    volatileAssetsValue: I80F48;
  } {
    const assetsValueUnweighted = I80F48.fromNumber(0);
    const assetsValue = I80F48.fromNumber(0);
    const volatileAssetsValue = I80F48.fromNumber(0);
    const cumPcTotal = I80F48.fromNumber(0);

    for (const { spot, derivative } of this.state.positions) {
      if (!spot.tokenMint.equals(PublicKey.default)) {
        const priceCache = cacheAccount.getCache(spot.cacheIndex);
        const decimals = priceCache.decimals;
        const openOrdersCache = spot.openOrdersCache;
        const oraclePrice = new I80F48(priceCache.oraclePrice);
        const weight = I80F48.fromNumber(priceCache.spotInitAssetWeight).div(
          I80F48.fromNumber(100)
        );

        let basePosition = new I80F48(spot.position);
        if (basePosition.isPos()) {
          basePosition = basePosition.mul(new I80F48(priceCache.depositIndex));
          const positionValue = splToUiAmountFixed(
            basePosition,
            priceCache.decimals
          ).mul(oraclePrice);

          assetsValueUnweighted.iadd(positionValue);
          assetsValue.iadd(positionValue.mul(weight));
          if (priceCache.safeguard) {
            volatileAssetsValue.iadd(positionValue.mul(weight));
          }

          // console.log(
          //   'Asset ----- Token: ',
          //   spot.tokenMint.toString(),
          //   'Position (Native): ',
          //   basePosition.toFixed(4),
          //   'Position (UI): ',
          //   splToUiAmountFixed(basePosition, priceCache.decimals).toFixed(4),
          //   'Weight: ',
          //   weight.toFixed(4),
          //   'Oracle Price: ',
          //   oraclePrice.toFixed(4),
          //   'Position Value: ',
          //   positionValue.toFixed(4)
          // );
        }

        if (!openOrdersCache.coinTotal.eq(ZERO_BN)) {
          const coinTotalIncl = splToUiAmountFixed(
            I80F48.fromU64(openOrdersCache.coinTotal),
            decimals
          ).mul(oraclePrice);

          assetsValueUnweighted.iadd(coinTotalIncl);
          assetsValue.iadd(coinTotalIncl.mul(weight));
          if (priceCache.safeguard) {
            volatileAssetsValue.iadd(coinTotalIncl.mul(weight));
          }
        }

        const pcTotalIncl = splToUiAmountFixed(
          I80F48.fromU64(openOrdersCache.pcTotal),
          QUOTE_TOKEN_DECIMALS
        );
        cumPcTotal.iadd(pcTotalIncl);
      }

      if (!derivative.market.equals(PublicKey.default)) {
        const priceCache = cacheAccount.getCache(derivative.cacheIndex);
        const openOrdersCache = derivative.openOrdersCache;

        let decimals = 0;
        if ((derivative.marketType as any).perpetualFuture) {
          decimals = priceCache.perpDecimals;
        } else {
          decimals = priceCache.futuresDecimals;
        }

        let derivPrice: I80F48 = ZERO_I80F48;
        if ((derivative.marketType as any).perpetualFuture) {
          derivPrice = new I80F48(priceCache.oraclePrice);
        } else {
          derivPrice = new I80F48(priceCache.marketPrice);
        }

        let weight: I80F48 = ZERO_I80F48;
        if ((derivative.marketType as any).perpetualFuture) {
          weight = I80F48.fromNumber(priceCache.perpInitAssetWeight).div(
            I80F48.fromNumber(100)
          );
        } else {
          weight = I80F48.fromNumber(priceCache.futuresInitAssetWeight).div(
            I80F48.fromNumber(100)
          );
        }

        const basePosition = new I80F48(derivative.basePosition).add(
          new I80F48(openOrdersCache.coinTotal)
        );
        if (basePosition.isPos()) {
          const positionValue = splToUiAmountFixed(basePosition, decimals).mul(
            derivPrice
          );

          assetsValueUnweighted.iadd(positionValue);
          assetsValue.iadd(positionValue.mul(weight));
          if (priceCache.safeguard) {
            volatileAssetsValue.iadd(positionValue.mul(weight));
          }

          // console.log(
          //   'Asset ----- Market: ',
          //   derivative.market.toString(),
          //   'Position (Native): ',
          //   basePosition.toFixed(4),
          //   'Position (UI): ',
          //   splToUiAmountFixed(basePosition, decimals).toFixed(4),
          //   'Weight: ',
          //   weight.toFixed(4),
          //   'Oracle Price: ',
          //   derivPrice.toFixed(4),
          //   'Position Value: ',
          //   positionValue.toFixed(4)
          // );
        }

        const coinLocked = openOrdersCache.coinTotal.sub(
          openOrdersCache.coinFree
        );

        if (!coinLocked.eq(ZERO_BN)) {
          const coinTotalIncl = splToUiAmountFixed(
            I80F48.fromU64(coinLocked),
            decimals
          ).mul(derivPrice);

          assetsValueUnweighted.iadd(coinTotalIncl);
          assetsValue.iadd(coinTotalIncl.mul(weight));
          if (priceCache.safeguard) {
            volatileAssetsValue.iadd(coinTotalIncl.mul(weight));
          }
        }

        const pcTotalIncl = splToUiAmountFixed(
          I80F48.fromU64(openOrdersCache.pcTotal),
          QUOTE_TOKEN_DECIMALS
        );
        cumPcTotal.iadd(pcTotalIncl);
      }
    }

    // this is a bit hacky because we know that the first cache is the usdc one
    // but this should ideally be changed
    const quotePriceCache = cacheAccount.getCache(0);
    const quotePositionValue = cumPcTotal.mul(
      new I80F48(quotePriceCache.oraclePrice)
    );
    const weight = I80F48.fromNumber(quotePriceCache.spotInitAssetWeight).div(
      I80F48.fromNumber(100)
    );

    assetsValueUnweighted.iadd(quotePositionValue);
    assetsValue.iadd(quotePositionValue.mul(weight));
    if (quotePriceCache.safeguard) {
      volatileAssetsValue.iadd(quotePositionValue.mul(weight));
    }

    // console.log(
    //   'Asset ----- Token: USDC',
    //   'Position (UI): ',
    //   cumPcTotal.toFixed(4),
    //   'Weight: ',
    //   weight.toFixed(4),
    //   'Oracle Price: ',
    //   new I80F48(quotePriceCache.oraclePrice).toFixed(4),
    //   'Position Value: ',
    //   quotePositionValue.toFixed(4)
    // );

    return { assetsValueUnweighted, assetsValue, volatileAssetsValue };
  }

  getLiabilitiesValue(cacheAccount: CacheAccount): {
    liabilitiesValueUnweighted: I80F48;
    liabilitiesValue: I80F48;
    volatileLiabilitiesValue: I80F48;
  } {
    const liabilitiesValueUnweighted = I80F48.fromNumber(0);
    const liabilitiesValue = I80F48.fromNumber(0);
    const volatileLiabilitiesValue = I80F48.fromNumber(0);

    for (const { spot, derivative } of this.state.positions) {
      if (!spot.tokenMint.equals(PublicKey.default)) {
        const priceCache = cacheAccount.getCache(spot.cacheIndex);
        const oraclePrice = new I80F48(priceCache.oraclePrice);
        const weight = I80F48.fromNumber(priceCache.spotInitLiabWeight).div(
          I80F48.fromNumber(100)
        );

        let basePosition = new I80F48(spot.position);
        if (basePosition.isNeg()) {
          basePosition = basePosition.mul(new I80F48(priceCache.borrowIndex));
          const positionValue = splToUiAmountFixed(
            basePosition.abs(),
            priceCache.decimals
          ).mul(oraclePrice);

          liabilitiesValueUnweighted.iadd(positionValue);
          liabilitiesValue.iadd(positionValue.mul(weight));
          if (priceCache.safeguard) {
            volatileLiabilitiesValue.iadd(positionValue.mul(weight));
          }

          // console.log(
          //   'Liability ----- Token: ',
          //   spot.tokenMint.toString(),
          //   'Position (Native): ',
          //   basePosition.toFixed(4),
          //   'Position (UI): ',
          //   splToUiAmountFixed(basePosition, priceCache.decimals).toFixed(4),
          //   'Weight: ',
          //   weight.toFixed(4),
          //   'Oracle Price: ',
          //   oraclePrice.toFixed(4),
          //   'Position Value: ',
          //   positionValue.toFixed(4)
          // );
        }
      }
      if (!derivative.market.equals(PublicKey.default)) {
        const priceCache = cacheAccount.getCache(derivative.cacheIndex);

        let decimals = 0;
        let derivPrice: I80F48 = ZERO_I80F48;
        let weight: I80F48 = ZERO_I80F48;
        if ((derivative.marketType as any).perpetualFuture) {
          decimals = priceCache.perpDecimals;
          derivPrice = new I80F48(priceCache.oraclePrice);
          weight = I80F48.fromNumber(priceCache.perpInitLiabWeight).div(
            I80F48.fromNumber(100)
          );
        } else {
          decimals = priceCache.futuresDecimals;
          derivPrice = new I80F48(priceCache.marketPrice);
          weight = I80F48.fromNumber(priceCache.futuresInitLiabWeight).div(
            I80F48.fromNumber(100)
          );
        }

        const basePosition = new I80F48(derivative.basePosition);
        if (basePosition.isNeg()) {
          const positionValue = splToUiAmountFixed(
            basePosition.abs(),
            decimals
          ).mul(derivPrice);

          liabilitiesValueUnweighted.iadd(positionValue);
          liabilitiesValue.iadd(positionValue.mul(weight));
          if (priceCache.safeguard) {
            volatileLiabilitiesValue.iadd(positionValue.mul(weight));
          }

          // console.log(
          //   'Liability ----- Market: ',
          //   derivative.market.toString(),
          //   'Position (Native): ',
          //   basePosition.toFixed(4),
          //   'Position (UI): ',
          //   splToUiAmountFixed(basePosition, decimals).toFixed(4),
          //   'Weight: ',
          //   weight.toFixed(4),
          //   'Oracle Price: ',
          //   derivPrice.toFixed(4),
          //   'Position Value: ',
          //   positionValue.toFixed(4)
          // );
        }
      }
    }

    return {
      liabilitiesValueUnweighted,
      liabilitiesValue,
      volatileLiabilitiesValue
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
          'CypherSubAccount',
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
}
