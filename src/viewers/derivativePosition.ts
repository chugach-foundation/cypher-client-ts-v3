import { DerivativePositionState } from '../types';
import { BN } from '@project-serum/anchor';

export class DerivativePosition {
  constructor(public state: DerivativePositionState) {}

  get totalPosition(): BN {
    return this.state.basePosition.add(
      this.state.openOrdersCache.coinTotal.sub(
        this.state.openOrdersCache.coinFree
      )
    );
  }
}
