import { PublicKey } from '@solana/web3.js';
import { BN, utils as anchorUtils } from '@project-serum/anchor';

export const getDexVaultSigner = (
  dexMarket: PublicKey,
  vaultSignerNonce: BN,
  dexPID: PublicKey
) => {
  return PublicKey.createProgramAddressSync(
    [dexMarket.toBuffer(), vaultSignerNonce.toArrayLike(Buffer, 'le', 8)],
    dexPID
  );
};

export const derivePublicClearingAddress = (cypherPID: PublicKey) => {
  const B_CLEARING = anchorUtils.bytes.utf8.encode('CYPHER_CLEARING');

  return anchorUtils.publicKey.findProgramAddressSync(
    [B_CLEARING, Buffer.from([0])],
    cypherPID
  );
};

export const derivePrivateClearingAddress = (
  clearingNumber: number,
  cypherPID: PublicKey
) => {
  const B_CLEARING = anchorUtils.bytes.utf8.encode('CYPHER_CLEARING');
  return anchorUtils.publicKey.findProgramAddressSync(
    [B_CLEARING, Buffer.from([1]), Buffer.from([clearingNumber])],
    cypherPID
  );
};

export const derivePoolAddress = (poolName: number[], cypherPID: PublicKey) => {
  const B_POOL = anchorUtils.bytes.utf8.encode('CYPHER_POOL');
  return anchorUtils.publicKey.findProgramAddressSync(
    [B_POOL, Buffer.from(poolName)],
    cypherPID
  );
};

export const derivePoolNodeAddress = (
  pool: PublicKey,
  nodeNumber: number,
  cypherPID: PublicKey
) => {
  const B_POOL_NODE = anchorUtils.bytes.utf8.encode('CYPHER_POOL_NODE');
  return anchorUtils.publicKey.findProgramAddressSync(
    [B_POOL_NODE, pool.toBuffer(), Buffer.from([nodeNumber])],
    cypherPID
  );
};

export const derivePoolNodeVaultAddress = (
  poolNode: PublicKey,
  cypherPID: PublicKey
) => {
  const B_POOL_VAULT = anchorUtils.bytes.utf8.encode('CYPHER_POOL_NODE_VAULT');
  return anchorUtils.publicKey.findProgramAddressSync(
    [B_POOL_VAULT, poolNode.toBuffer()],
    cypherPID
  );
};

export const derivePoolNodeVaultSigner = (
  poolNode: PublicKey,
  cypherPID: PublicKey
) => {
  const B_POOL_NODE_VAULT_SIGNER = anchorUtils.bytes.utf8.encode(
    'CYPHER_POOL_NODE_VAULT_SIGNER'
  );
  return anchorUtils.publicKey.findProgramAddressSync(
    [B_POOL_NODE_VAULT_SIGNER, poolNode.toBuffer()],
    cypherPID
  );
};

export const deriveMarketAddress = (
  marketName: number[],
  cypherPID: PublicKey
) => {
  const B_CYPHER_MARKET = anchorUtils.bytes.utf8.encode('CYPHER_MARKET');
  return anchorUtils.publicKey.findProgramAddressSync(
    [B_CYPHER_MARKET, Buffer.from(marketName)],
    cypherPID
  );
};

export const deriveOracleProductsAddress = (
  symbol: number[],
  cypherPID: PublicKey
) => {
  const B_CYPHER_MARKET = anchorUtils.bytes.utf8.encode(
    'CYPHER_ORACLE_PRODUCTS'
  );
  return anchorUtils.publicKey.findProgramAddressSync(
    [B_CYPHER_MARKET, Buffer.from(symbol)],
    cypherPID
  );
};

export const deriveAccountAddress = (
  authority: PublicKey,
  accountNumber: number,
  cypherPID: PublicKey
) => {
  const B_CYPHER_ACCOUNT = anchorUtils.bytes.utf8.encode('CYPHER_ACCOUNT');
  return anchorUtils.publicKey.findProgramAddressSync(
    [B_CYPHER_ACCOUNT, authority.toBuffer(), Buffer.from([accountNumber])],
    cypherPID
  );
};

export const deriveSubAccountAddress = (
  masterAccount: PublicKey,
  accountNumber: number,
  cypherPID: PublicKey
) => {
  const B_CYPHER_SUB_ACCOUNT =
    anchorUtils.bytes.utf8.encode('CYPHER_SUB_ACCOUNT');
  return anchorUtils.publicKey.findProgramAddressSync(
    [
      B_CYPHER_SUB_ACCOUNT,
      masterAccount.toBuffer(),
      Buffer.from([accountNumber])
    ],
    cypherPID
  );
};

export const deriveOrdersAccountAddress = (
  masterAccount: PublicKey,
  market: PublicKey,
  cypherPID: PublicKey
) => {
  const B_ORDERS_ACCOUNT = anchorUtils.bytes.utf8.encode(
    'CYPHER_ORDERS_ACCOUNT'
  );
  return anchorUtils.publicKey.findProgramAddressSync(
    [B_ORDERS_ACCOUNT, market.toBuffer(), masterAccount.toBuffer()],
    cypherPID
  );
};

export const deriveSerumOrdersAccountAddress = (
  dexMarket: PublicKey,
  masterAccount: PublicKey,
  subAccount: PublicKey,
  cypherPID: PublicKey
) => {
  const B_OPEN_ORDERS = anchorUtils.bytes.utf8.encode('OPEN_ORDERS');
  return anchorUtils.publicKey.findProgramAddressSync(
    [
      B_OPEN_ORDERS,
      dexMarket.toBuffer(),
      masterAccount.toBuffer(),
      subAccount.toBuffer()
    ],
    cypherPID
  );
};
