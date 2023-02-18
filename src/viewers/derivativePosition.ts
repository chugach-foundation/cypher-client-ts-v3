import { DerivativePositionState } from '../types';
import { I80F48 } from '@blockworks-foundation/mango-client';

export class DerivativePosition {
  constructor(public state: DerivativePositionState) {}

  get totalPosition(): I80F48 {
    return this.basePosition.add(
      I80F48.fromU64(this.state.openOrdersCache.coinTotal)
    );
  }

  get basePosition(): I80F48 {
    return new I80F48(this.state.basePosition);
  }
}
