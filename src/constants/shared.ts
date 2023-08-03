import { PublicKey } from '@solana/web3.js';
import type { Cluster, Config } from '../types';

export const CALLBACK_INFO_LEN = 34;
export const BPS_100_PERCENT = 10_000;
export const QUOTE_TOKEN_DECIMALS = 6;

export const CONFIGS: { [key in Cluster]: Config } = {
  localnet: {
    CYPHER_PID: new PublicKey('9i1FSiiXcLSLPfeWcBMaLa19ueQ2zZopzHvw4s7hT7ty'),
    CYPHER_TOKEN_MINT: new PublicKey('11111111111111111111111111111111'),
    LIP_PID: new PublicKey('F1HVQ92YoF27Z652KBETWoyagY7Vej6F6mtvKDvYK3rX'),
    PYTH_PID: new PublicKey('gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s'),
    SEQ_ENFORCER_PID: new PublicKey('11111111111111111111111111111111'),
    DEX_PID: new PublicKey('EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj'),
    FAUCET_PID: new PublicKey('2gCkR5aaUiTVRiKDB79EWXm5PAVDWtNTnp9mGuu4ZKdY'),
    QUOTE_MINT: new PublicKey('GE2GoxjfHo9uPJGDxwVifPFomBybhsh4m5SMqaw7vPBw'),
    PYTH_QUOTE_PRODUCT: new PublicKey(
      '6NpdXrQEpmDZ3jZKmM2rhdmkd3H6QAk23j2x8bkXcHKA'
    ),
    CACHE: new PublicKey('9j2BAs64tYjQdaHsMbFnY4VKUnsLMTc8vrXpXcvP6ujz'),
    HISTORY_API_GRAPHQL: 'http://localhost:8081/v1/graphql',
    HISTORY_API_REST: 'http://localhost:8081/api/rest'
  },
  devnet: {
    CYPHER_PID: new PublicKey('9i1FSiiXcLSLPfeWcBMaLa19ueQ2zZopzHvw4s7hT7ty'),
    CYPHER_TOKEN_MINT: new PublicKey(
      'CYPHK4sZe7A4tdgTgLSotkkEzadtxqKu5JjuvaQRkYah'
    ),
    LIP_PID: new PublicKey('F1HVQ92YoF27Z652KBETWoyagY7Vej6F6mtvKDvYK3rX'),
    PYTH_PID: new PublicKey('gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s'),
    SEQ_ENFORCER_PID: new PublicKey(
      'FBngRHN4s5cmHagqy3Zd6xcK3zPJBeX5DixtHFbBhyCn'
    ),
    DEX_PID: new PublicKey('EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj'),
    FAUCET_PID: new PublicKey('2gCkR5aaUiTVRiKDB79EWXm5PAVDWtNTnp9mGuu4ZKdY'),
    QUOTE_MINT: new PublicKey('GE2GoxjfHo9uPJGDxwVifPFomBybhsh4m5SMqaw7vPBw'),
    PYTH_QUOTE_PRODUCT: new PublicKey(
      '6NpdXrQEpmDZ3jZKmM2rhdmkd3H6QAk23j2x8bkXcHKA'
    ),
    CACHE: new PublicKey('9j2BAs64tYjQdaHsMbFnY4VKUnsLMTc8vrXpXcvP6ujz'),
    HISTORY_API_GRAPHQL: 'devnet-v3.cypher-history.com/v1/graphql',
    HISTORY_API_REST: 'devnet-v3.cypher-history.com/api/rest'
  },
  'mainnet-beta': {
    CYPHER_PID: new PublicKey('CYPH3o83JX6jY6NkbproSpdmQ5VWJtxjfJ5P8veyYVu3'),
    CYPHER_TOKEN_MINT: new PublicKey(
      'CYPHK4sZe7A4tdgTgLSotkkEzadtxqKu5JjuvaQRkYah'
    ),
    LIP_PID: new PublicKey('cLip5AGrwoNJaYxdNicRg6uXMZbVCNGvYPC3rKuyASS'),
    PYTH_PID: new PublicKey('FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH'),
    SEQ_ENFORCER_PID: new PublicKey(
      'GDDMwNyyx8uB6zrqwBFHjLLG3TBYk2F8Az4yrQC5RzMp'
    ),
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
