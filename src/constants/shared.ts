import { PublicKey } from '@solana/web3.js';
import type { Cluster, Config } from '../types';

export const CALLBACK_INFO_LEN = 34;
export const BPS_100_PERCENT = 10_000;

export const CONFIGS: { [key in Cluster]: Config } = {
  localnet: {
    CYPHER_PID: new PublicKey('E2hQJAedG6bX2w3rbPQ5XrBnPvC7u3mAorKLvU6XPxwe'),
    PYTH_PID: new PublicKey('gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s'),
    DEX_PID: new PublicKey('EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj'),
    FAUCET_PID: new PublicKey('2gCkR5aaUiTVRiKDB79EWXm5PAVDWtNTnp9mGuu4ZKdY'),
    QUOTE_MINT: new PublicKey('GE2GoxjfHo9uPJGDxwVifPFomBybhsh4m5SMqaw7vPBw'),
    PYTH_QUOTE_PRODUCT: new PublicKey(
      '6NpdXrQEpmDZ3jZKmM2rhdmkd3H6QAk23j2x8bkXcHKA'
    ),
    CACHE: new PublicKey('DV1umVB5KzBkPuav7JbDNNKUzaDk9v2zAUNudR3kKRmZ'),
    HISTORY_API_GRAPHQL: 'http://localhost:8081/v1/graphql',
    HISTORY_API_REST: 'http://localhost:8081/api/rest'
  },
  devnet: {
    CYPHER_PID: new PublicKey('E2hQJAedG6bX2w3rbPQ5XrBnPvC7u3mAorKLvU6XPxwe'),
    PYTH_PID: new PublicKey('gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s'),
    DEX_PID: new PublicKey('EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj'),
    FAUCET_PID: new PublicKey('2gCkR5aaUiTVRiKDB79EWXm5PAVDWtNTnp9mGuu4ZKdY'),
    QUOTE_MINT: new PublicKey('GE2GoxjfHo9uPJGDxwVifPFomBybhsh4m5SMqaw7vPBw'),
    PYTH_QUOTE_PRODUCT: new PublicKey(
      '6NpdXrQEpmDZ3jZKmM2rhdmkd3H6QAk23j2x8bkXcHKA'
    ),
    CACHE: new PublicKey('DV1umVB5KzBkPuav7JbDNNKUzaDk9v2zAUNudR3kKRmZ'),
    HISTORY_API_GRAPHQL: 'devnet-v3.cypher-history.com/v1/graphql',
    HISTORY_API_REST: 'devnet-v3.cypher-history.com/api/rest'
  },
  'mainnet-beta': {
    CYPHER_PID: new PublicKey('CYPH3o83JX6jY6NkbproSpdmQ5VWJtxjfJ5P8veyYVu3'),
    PYTH_PID: new PublicKey('FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH'),
    DEX_PID: new PublicKey('srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX'),
    QUOTE_MINT: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    PYTH_QUOTE_PRODUCT: new PublicKey(
      '8GWTTbNiXdmyZREXbjsZBmCRuzdPrW55dnZGDkTRjWvb'
    ),
    CACHE: new PublicKey('6x5U4c41tfUYGEbTXofFiHcfyx3rqJZsT4emrLisNGGL'),
    HISTORY_API_GRAPHQL: 'https://mainnet-v3.cypher-history.com/v1/graphql',
    HISTORY_API_REST: 'https://mainnet-v3.cypher-history.com/api/rest'
  }
};
