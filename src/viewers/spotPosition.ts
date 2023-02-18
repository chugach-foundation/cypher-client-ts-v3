import { Cache, SpotPositionState } from '../types';
import { I80F48, ZERO_I80F48 } from '@blockworks-foundation/mango-client';

export class SpotPosition {
  constructor(public state: SpotPositionState) {}

  totalDeposits(cache: Cache): I80F48 {
    if (this.state.position.isNeg()) return ZERO_I80F48;
    return new I80F48(this.state.position).mul(new I80F48(cache.depositIndex));
  }

  totalBorrows(cache: Cache): I80F48 {
    if (this.state.position.isNeg())
      return new I80F48(this.state.position).mul(new I80F48(cache.borrowIndex));
    return ZERO_I80F48;
  }
}
