import { CypherClient } from '@cypher-client/client/index'
import { PerpetualMarket } from '@cypher-client/accounts/perpMarket'
import { PerpMarketViewer } from '@cypher-client/viewers/perpMarket'
import { FuturesMarket } from '@cypher-client/accounts/futuresMarket'
import { FuturesMarketViewer } from '@cypher-client/viewers/futuresMarket'
import { Pool } from '@cypher-client/accounts/pool'
import { SpotMarketViewer } from '@cypher-client/viewers/spotMarket'

// Load  Env Variables
require('dotenv').config({
  path: __dirname + `/default.env`,
})

require('dotenv').config({
  path: __dirname + `/args.env`, // Can also be used to override default env variables
})

const RPC_ENDPOINT = process.env.RPC_ENDPOINT

const client = new CypherClient('devnet', RPC_ENDPOINT)

async function testRun(cypherClient: CypherClient) {
  console.log('-------------- Perpetual Markets --------------')
  const perpMarkets = await PerpetualMarket.loadAll(cypherClient)

  for (const market of perpMarkets) {
    const viewer = new PerpMarketViewer(cypherClient, market)
    const fills = await viewer.loadFills()
    const orderBook = await viewer.getOrderBook()
    console.log('Market:', market.address.toString(), 'Fills:', fills)
    for (const bid of orderBook.bids) {
      console.log('Bid - Price:', bid[0], 'Size:', bid[1])
    }
    for (const ask of orderBook.asks) {
      console.log('Ask - Price:', ask[0], 'Size:', ask[1])
    }
  }

  console.log('-------------- Futures Markets --------------')
  const futuresMarkets = await FuturesMarket.loadAll(cypherClient)

  for (const market of futuresMarkets) {
    const viewer = new FuturesMarketViewer(cypherClient, market)
    const fills = await viewer.loadFills()
    const orderBook = await viewer.getOrderBook()
    console.log('Market:', market.address.toString(), 'Fills:', fills)
    for (const bid of orderBook.bids) {
      console.log('Bid - Price:', bid[0], 'Size:', bid[1])
    }
    for (const ask of orderBook.asks) {
      console.log('Ask - Price:', ask[0], 'Size:', ask[1])
    }
  }

  console.log('-------------- Pools --------------')
  const pools = await Pool.loadAll(cypherClient)

  for (const pool of pools) {
    if (pool.market != null) {
      const viewer = new SpotMarketViewer(cypherClient, pool)
      const fills = await viewer.loadFills()
      const orderBook = await viewer.getOrderBook()
      console.log(
        'Pool:',
        pool.address.toString(),
        'Dex Market:',
        pool.dexMarket.toString(),
        'Fills:',
        fills,
      )
      if (orderBook != null) {
        for (const bid of orderBook.bids) {
          console.log('Bid - Price:', bid[0], 'Size:', bid[1])
        }
        for (const ask of orderBook.asks) {
          console.log('Ask - Price:', ask[0], 'Size:', ask[1])
        }
      }
    }
  }
}

testRun(client)
