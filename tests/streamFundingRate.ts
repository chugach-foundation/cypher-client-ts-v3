import { CacheAccount, PerpetualMarket } from '@cypher-client/accounts'
import { CypherClient } from '@cypher-client/client'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { Cluster, ErrorCB, OrderbookListenerCB, ParsedOrderbook } from '@cypher-client/types'
import { deriveMarketAddress, encodeStrToUint8Array, sleep } from '@cypher-client/utils'
import { PerpMarketViewer } from '@cypher-client/viewers'
import { loadWallet } from './utils/wallet-loader'
import { CONFIGS } from '@cypher-client/constants'
import { confirmOpts, loadAndSubscribeCache } from './utils'
import { I80F48 } from '@blockworks-foundation/mango-client'

// INFO:
// Example in this file is only guaranteed to work with a cypher account that has one main subaccount

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

// get perp market for a specified market
export const getPerpMkt = async (client: CypherClient, mktName: string) => {
  const encodedMkt = encodeStrToUint8Array(mktName)
  const [mktPubkey, number] = deriveMarketAddress(encodedMkt, client.cypherPID)
  const perpMkt = await PerpetualMarket.load(client, mktPubkey)

  return perpMkt
}

export const calcImpactPrice = (size: number, orderBook: ParsedOrderbook) => {
  if (!orderBook) return null
  if (orderBook.length === 0) return null

  let accumQty = 0
  let price = 0
  for (const [orderPrice, orderQty] of orderBook) {
    accumQty += orderQty
    if (accumQty >= size) {
      price = orderPrice
      break
    }
  }

  return price
}

export const calculateFundingRate = (
  cacheAccount: CacheAccount,
  marketViewer: PerpMarketViewer,
  bidSide: ParsedOrderbook,
  askSide: ParsedOrderbook,
) => {
  const minFunding = marketViewer.market.state.minFunding / 100
  const maxFunding = marketViewer.market.state.maxFunding / 100
  const impactQty =
    marketViewer.market.state.impactQuantity.toNumber() /
    Math.pow(10, marketViewer.market.state.inner.config.decimals)
  console.log(
    'Min Funding: ' + minFunding + ' Max Funding: ' + maxFunding + ' Impact Qty: ' + impactQty,
  )
  const impactBidPrice = calcImpactPrice(impactQty, bidSide)
  const impactAskPrice = calcImpactPrice(impactQty, askSide)
  console.log('Impact Ask: ' + impactAskPrice + ' Impact Bid: ' + impactBidPrice)

  if (!impactBidPrice && !impactAskPrice) {
    return 0
  }

  if (!impactBidPrice) {
    return minFunding * 100
  }

  if (!impactAskPrice) {
    return maxFunding * 100
  }

  const cacheIndex = marketViewer.market.state.inner.config.cacheIndex
  const cache = cacheAccount.getCache(cacheIndex)
  // TODO: check if we should use market price or oracle price
  const oraclePrice = new I80F48(cache.oraclePrice).toNumber()

  const mid = (impactBidPrice + impactAskPrice) / 2
  const fundingRate = mid / oraclePrice - 1

  const clampedFundingRate = Math.min(maxFunding, Math.max(minFunding, fundingRate))
  return clampedFundingRate * 100
}

export const bookListeners = (
  perpViewer: PerpMarketViewer,
  onBidSideUpdate: (bids: ParsedOrderbook) => void,
  onAskSideUpdate: (asks: ParsedOrderbook) => void,
) => {
  // bid side handler
  const bidHandler: OrderbookListenerCB = (bid: ParsedOrderbook) => {
    console.log('---------------------------------------------------')
    // for (const order of bid) {
    //   console.log('BID: ' + ' | price: ' + order[0] + ' | size: ' + order[1])
    // }
    console.log('---------------------------------------------------')
    onBidSideUpdate(bid)
  }
  const bidErrorHandler: ErrorCB = (error: unknown) => {
    console.log(error)
    perpViewer.addBidsListener(bidHandler, bidErrorHandler)
  }
  // ask side handler
  const askHandler: OrderbookListenerCB = (ask: ParsedOrderbook) => {
    console.log('---------------------------------------------------')
    // for (const order of ask) {
    //   console.log('ASK: ' + ' | price: ' + order[0] + ' | size: ' + order[1])
    // }
    console.log('---------------------------------------------------')
    onAskSideUpdate(ask)
  }
  const askErrorHandler: ErrorCB = (error: unknown) => {
    console.log(error)
    perpViewer.addAsksListener(bidHandler, askErrorHandler)
  }

  perpViewer.addBidsListener(bidHandler, bidErrorHandler)
  perpViewer.addAsksListener(askHandler, askErrorHandler)
}

export const main = async () => {
  let bidSide: ParsedOrderbook = null
  let askSide: ParsedOrderbook = null

  const wallet = loadWallet(KP_PATH)
  const MARKET = process.env.MARKET
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)

  const perpMkt = await getPerpMkt(client, MARKET)
  const perpMktViewer = new PerpMarketViewer(client, perpMkt)

  let cacheAccount = await loadAndSubscribeCache(client, (cache) => {
    cacheAccount = cache
    const fundingRate = calculateFundingRate(cacheAccount, perpMktViewer, bidSide, askSide)
    console.log(
      'Funding Rate: ' +
        (fundingRate / 24).toFixed(4) +
        '% per hour - ' +
        (fundingRate * 365).toFixed(4) +
        '% APR',
    )
  })

  bookListeners(
    perpMktViewer,
    (bid) => {
      bidSide = bid
      const fundingRate = calculateFundingRate(cacheAccount, perpMktViewer, bidSide, askSide)
      console.log(
        'Funding Rate: ' +
          (fundingRate / 24).toFixed(4) +
          '% per hour - ' +
          (fundingRate * 365).toFixed(4) +
          '% APR',
      )
    },
    (ask) => {
      askSide = ask
      const fundingRate = calculateFundingRate(cacheAccount, perpMktViewer, bidSide, askSide)
      console.log(
        'Funding Rate: ' +
          (fundingRate / 24).toFixed(4) +
          '% per hour - ' +
          (fundingRate * 365).toFixed(4) +
          '% APR',
      )
    },
  )

  while (true) {
    await sleep(100)
  }
}

main()
