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
  SpotPositionState,
  StateUpdateHandler
} from '../types';
import { CacheAccount } from './cacheAccount';
import { SpotPosition } from '../viewers/spotPosition';
import { DerivativePosition } from '../viewers/derivativePosition';
import { QUOTE_TOKEN_DECIMALS } from '../constants/shared';

export class CypherSubAccount {
  constructor(
    readonly client: CypherClient,
    readonly address: PublicKey,
    public state: CypherSubAccountState,
    private _onStateUpdate?: StateUpdateHandler<CypherSubAccountState>
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
    onStateUpdateHandler?: StateUpdateHandler<CypherSubAccountState>
  ) {
    const state = (await client.accounts.cypherSubAccount.fetchNullable(
      address
    )) as CypherSubAccountState;
    return new CypherSubAccount(client, address, state, onStateUpdateHandler);
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

  getAssetsValue(cacheAccount: CacheAccount): I80F48 {
    const assetsValue = I80F48.fromNumber(0);

    for (const { spot, derivative } of this.state.positions) {
      if (!spot.tokenMint.equals(PublicKey.default)) {
        const priceCache = cacheAccount.getCache(spot.cacheIndex);
        const openOrdersCache = spot.openOrdersCache;
        const oraclePrice = new I80F48(priceCache.oraclePrice);

        const weight = I80F48.fromNumber(priceCache.spotInitAssetWeight).div(
          I80F48.fromNumber(100)
        );

        const basePosition = new I80F48(spot.position);
        if (basePosition.isPos()) {
          const positionValue = splToUiAmountFixed(
            basePosition,
            priceCache.decimals
          )
            .mul(oraclePrice)
            .mul(weight);
          assetsValue.iadd(positionValue);

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

        if (openOrdersCache.coinTotal != ZERO_BN) {
          assetsValue.iadd(
            splToUiAmountFixed(
              I80F48.fromU64(openOrdersCache.coinTotal),
              QUOTE_TOKEN_DECIMALS
            )
              .mul(oraclePrice)
              .mul(weight)
          );
        }
        assetsValue.iadd(
          splToUiAmountFixed(
            I80F48.fromU64(openOrdersCache.pcTotal),
            QUOTE_TOKEN_DECIMALS
          )
        );
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

        const basePosition = new I80F48(derivative.basePosition);
        if (basePosition.isPos()) {
          const positionValue = splToUiAmountFixed(basePosition, decimals)
            .mul(derivPrice)
            .mul(weight);
          assetsValue.iadd(positionValue);

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

        if (openOrdersCache.coinTotal != ZERO_BN) {
          assetsValue.iadd(
            splToUiAmountFixed(
              I80F48.fromU64(openOrdersCache.coinTotal),
              QUOTE_TOKEN_DECIMALS
            )
              .mul(derivPrice)
              .mul(weight)
          );
        }
        assetsValue.iadd(
          splToUiAmountFixed(
            I80F48.fromU64(openOrdersCache.pcTotal),
            QUOTE_TOKEN_DECIMALS
          )
        );
      }
    }

    return assetsValue;
  }

  getLiabilitiesValue(cacheAccount: CacheAccount): I80F48 {
    const liabilitiesValue = I80F48.fromNumber(0);

    for (const { spot, derivative } of this.state.positions) {
      if (!spot.tokenMint.equals(PublicKey.default)) {
        const priceCache = cacheAccount.getCache(spot.cacheIndex);

        const oraclePrice = new I80F48(priceCache.oraclePrice);

        const weight = I80F48.fromNumber(priceCache.spotInitLiabWeight).div(
          I80F48.fromNumber(100)
        );

        const basePosition = new I80F48(spot.position);
        if (basePosition.isNeg()) {
          const positionValue = splToUiAmountFixed(
            basePosition.abs(),
            priceCache.decimals
          )
            .mul(oraclePrice)
            .mul(weight);
          liabilitiesValue.iadd(positionValue);

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
          weight = I80F48.fromNumber(priceCache.perpInitLiabWeight).div(
            I80F48.fromNumber(100)
          );
        } else {
          weight = I80F48.fromNumber(priceCache.futuresInitLiabWeight).div(
            I80F48.fromNumber(100)
          );
        }

        const basePosition = new I80F48(derivative.basePosition);
        if (basePosition.isNeg()) {
          const positionValue = splToUiAmountFixed(basePosition.abs(), decimals)
            .mul(derivPrice)
            .mul(weight);
          liabilitiesValue.iadd(positionValue);

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

    return liabilitiesValue;
  }

  subscribe() {
    this.client.accounts.cypherSubAccount
      .subscribe(this.address)
      .on('change', (state: CypherSubAccountState) => {
        this.state = state;
        if (this._onStateUpdate) {
          this._onStateUpdate(this.state);
        }
      });
  }

  async unsubscribe() {
    await this.client.accounts.cypherSubAccount.unsubscribe(this.address);
  }
}
