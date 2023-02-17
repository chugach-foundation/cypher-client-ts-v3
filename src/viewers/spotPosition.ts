import { Cache, SpotPositionState } from '../types';
import { BN } from '@project-serum/anchor';

export class SpotPosition {
  constructor(public state: SpotPositionState) {}

  totalDeposits(cache: Cache): BN {
    if (this.state.position.isNeg()) return new BN(0);
    return this.state.position.mul(cache.depositIndex);
  }

  totalBorrows(cache: Cache): BN {
    if (this.state.position.isNeg())
      return this.state.position.mul(cache.borrowIndex);
    return new BN(0);
  }
}
