import { PublicKey } from '@solana/web3.js';
import { LiquidityIncentiveClient } from '../../client/liquidityIncentiveProgram';
import { CampaignState, ErrorCB } from '../../types';
import { StateUpdateHandler } from '../../types/index';
import {
  deriveCampaignRewardVault,
  deriveCampaignRewardVaultAuthority
} from '../../utils/pda';

export class Campaign {
  private _listener: number;
  constructor(
    readonly client: LiquidityIncentiveClient,
    readonly address: PublicKey,
    public state: CampaignState,
    private _onStateUpdate?: StateUpdateHandler<CampaignState>,
    private _errorCallback?: ErrorCB
  ) {
    _onStateUpdate && this.subscribe();
  }

  static async load(
    client: LiquidityIncentiveClient,
    address: PublicKey,
    onStateUpdateHandler?: StateUpdateHandler<CampaignState>,
    errorCallback?: ErrorCB
  ) {
    const state = (await client.accounts.campaign.fetch(
      address
    )) as CampaignState;
    return new Campaign(
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

  rewardVaultAddress(): PublicKey {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [address, _] = deriveCampaignRewardVault(
      this.address,
      this.client.programId
    );
    return address;
  }

  rewardVaultAuthorityAddress(): PublicKey {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [address, _] = deriveCampaignRewardVaultAuthority(
      this.address,
      this.client.programId
    );
    return address;
  }

  private addListener() {
    this._listener = this.client.connection.onAccountChange(
      this.address,
      ({ data }) => {
        this.state = this.client.program.coder.accounts.decode(
          'Campaign',
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
