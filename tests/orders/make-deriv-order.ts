import { Transaction } from '@solana/web3.js'
import { CypherClient } from '@cypher-client/client'
import { CacheAccount, Clearing, Pool } from '@cypher-client/accounts'
import {
  derivePoolAddress,
  derivePoolNodeAddress,
  derivePublicClearingAddress,
  deriveMarketAddress,
  createObjectWithKeyFromString,
  encodeStrToUint8Array,
  getDefaultPriorityFeeIxs,
  getArgsInLots,
} from '@cypher-client/utils'
import { CONFIGS } from '@cypher-client/constants'
import { Cluster } from '@cypher-client/types'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { BN } from '@project-serum/anchor'
import { makeNewPerpOrderIx, makeSettlePerpFundsIx } from '@cypher-client/instructions'
import {
  confirmOpts,
  getDerivativeOpenOrdersAcc,
  getDerivMarketAndViewer,
  loadAccs,
} from '../utils'
import { loadWallet } from '../utils/wallet-loader'

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
const SELF_TRADE_BEHAVIOR = process.env.SELF_TRADE_BEHAVIOR
const USDC = 'USDC'

// Args
const SIZE = parseFloat(process.env.SIZE || '0')
const PRICE = parseFloat(process.env.PRICE || '0')
const ORDER_TYPE = process.env.ORDER_TYPE || 'limit'
const SIDE = (process.env.SIDE || 'buy') as 'buy' | 'sell'

// Make Deriv Order
export const makeDerivOrder = async (marketType: 'pairFuture' | 'perpetualFuture') => {
  const wallet = loadWallet(KP_PATH)
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const [acc, subAcc] = await loadAccs(client, wallet)
  const [mktAddress] = deriveMarketAddress(encodeStrToUint8Array(MARKET), client.cypherPID)
  const derivOpenOrdersAcc = await getDerivativeOpenOrdersAcc(client, acc, mktAddress)
  const [market, marketViewer] = await getDerivMarketAndViewer(client, mktAddress, marketType)
  const cacheacct = await CacheAccount.load(client, CONFIGS[CLUSTER].CACHE)
  const [clearingAddress] = derivePublicClearingAddress(client.cypherPID)
  const [poolAddress] = derivePoolAddress(encodeStrToUint8Array(USDC), client.cypherPID)
  const pool = await Pool.load(client, poolAddress)
  const [poolnodeAddress] = derivePoolNodeAddress(pool.address, 0, client.cypherPID)
  const clearing = await Clearing.load(client, clearingAddress)
  const { bids, asks } = await marketViewer.getOrderBook()
  // When market order and orderbook empty, this fn can error out...
  const price =
    ORDER_TYPE === 'market' ? marketViewer.calcMarketOrderPrice(SIZE, SIDE, bids, asks) : PRICE
  const baseLotSize = market.state.inner.baseMultiplier
  const quoteLotSize = market.state.inner.quoteMultiplier

  const { priceInLots, sizeInLots, quoteInLots } = getArgsInLots({
    clearing,
    baseLotSize,
    quoteLotSize,
    price,
    account: acc,
    decimals: market.state.inner.config.decimals,
    size: SIZE,
  })

  const ix = await makeNewPerpOrderIx(
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
      limit: price,
      side: createObjectWithKeyFromString(SIDE === 'buy' ? 'bid' : 'ask'),
      limitPrice: priceInLots,
      orderType: createObjectWithKeyFromString(ORDER_TYPE), // for maker orders -> 'PostOnly'
      selfTradeBehavior: createObjectWithKeyFromString(SELF_TRADE_BEHAVIOR),
      clientOrderId: new BN(0), // enter your custom clientOrderId here
      maxBaseQty: sizeInLots,
      maxQuoteQty: quoteInLots,
      maxTs: new BN('18446744073709551615'),
    },
  )

  // you can tx.add(settleFundsix) into tx 
  // or have this in its own tx that you call periodically
  // since program will auto settle funds if you are canceling 
  // and replacing orders, but if you plan to leave orders on book 
  // after fills (without requoting), would suggest having this as 
  // its own tx that you place on some set interval
  const settleFundsix = await makeSettlePerpFundsIx(
    client,
    clearingAddress,
    cacheacct.address,
    acc.address,
    subAcc.address,
    derivOpenOrdersAcc.address,
    mktAddress,
    poolnodeAddress
  )

  const { modifyComputeUnits, addPriorityFee } = getDefaultPriorityFeeIxs()
  const tx = new Transaction()
  tx.add(modifyComputeUnits)
  tx.add(addPriorityFee)
  tx.add(ix)

  return await client.sendAndConfirm(tx, [wallet], confirmOpts)
}
