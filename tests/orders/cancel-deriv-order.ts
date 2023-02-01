import { Transaction } from '@solana/web3.js'
import { CypherClient } from '@cypher-client/client'
import { CacheAccount, Pool } from '@cypher-client/accounts'
import {
  derivePoolAddress,
  derivePoolNodeAddress,
  derivePublicClearingAddress,
  deriveMarketAddress,
  encodeStrToUint8Array,
  getDefaultPriorityFeeIxs,
} from '@cypher-client/utils'
import { CONFIGS } from '@cypher-client/constants'
import { Cluster } from '@cypher-client/types'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { makeCancelPerpOrderIx } from '@cypher-client/instructions'
import {
  confirmOpts,
  getDerivativeOpenOrdersAcc,
  getDerivMarketAndViewer,
  loadAccs,
  loadWallet,
} from '../utils'

// Load  Env Variables
require('dotenv').config({
  path: __dirname + `/default.env`,
})

require('dotenv').config({
  path: __dirname + `/args.env`, // Can also be used to override default env variables
})

// Constants
const CLUSTER = process.env.CLUSTER as Cluster
const RPC_ENDPOINT = process.env.RPC_ENDPOINT
const KP_PATH = process.env.KEYPAIR_PATH
const MARKET = process.env.MARKET // ETH-PERP, BTC-PERP, SOL, ETH, SOL-FUTURES, etc
const USDC = 'USDC'

// Cancel First Deriv Order
export const makeCancelFirstDerivOrder = async (marketType: 'pairFuture' | 'perpetualFuture') => {
  const wallet = loadWallet(KP_PATH)
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const [acc, subAcc] = await loadAccs(client, wallet)
  const [mktAddress] = deriveMarketAddress(encodeStrToUint8Array(MARKET), client.cypherPID)
  const derivOpenOrdersAcc = await getDerivativeOpenOrdersAcc(client, acc, mktAddress)
  const [market, marketViewer] = await getDerivMarketAndViewer(client, mktAddress, marketType)
  const derivOpenOrders = await derivOpenOrdersAcc.getOrders(marketViewer)
  const cacheacct = await CacheAccount.load(client, CONFIGS[CLUSTER].CACHE)
  const [clearingAddress] = derivePublicClearingAddress(client.cypherPID)
  const [poolAddress] = derivePoolAddress(encodeStrToUint8Array(USDC), client.cypherPID)
  const pool = await Pool.load(client, poolAddress)
  const [poolnodeAddress] = derivePoolNodeAddress(pool.address, 0, client.cypherPID)

  const ix = await makeCancelPerpOrderIx(
    client,
    clearingAddress,
    cacheacct.address,
    acc.address,
    subAcc.address,
    mktAddress,
    derivOpenOrdersAcc.address,
    market.state.inner.orderbook,
    market.state.inner.eventQueue,
    market.state.inner.bids,
    market.state.inner.asks,
    poolnodeAddress,
    wallet.publicKey,
    {
      side: derivOpenOrders[0].side, // change logic here for custom order id
      orderId: derivOpenOrders[0].orderId, // change logic here for custom order id
      isClientId: false,
    },
  )
  const { modifyComputeUnits, addPriorityFee } = getDefaultPriorityFeeIxs()
  const tx = new Transaction()
  tx.add(modifyComputeUnits)
  tx.add(addPriorityFee)
  tx.add(ix)
  return await client.sendAndConfirm(tx, [wallet], confirmOpts)
}
