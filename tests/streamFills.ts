import { PerpetualMarket, Pool } from '@cypher-client/accounts'
import { CypherClient } from '@cypher-client/client'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { confirmOpts } from './utils'
import { Cluster } from '@cypher-client/types'
import {
  deriveMarketAddress,
  derivePoolAddress,
  encodeStrToUint8Array,
  sleep,
} from '@cypher-client/utils'
import { PerpMarketViewer, SpotMarketViewer } from '@cypher-client/viewers'
import { FillsListenerCB, FillsExtended, ErrorCB } from '../lib/types/index'
import { loadWallet } from './utils/wallet-loader'

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
  console.log('Perp Market address: ' + mktPubkey)
  const perpMkt = await PerpetualMarket.load(client, mktPubkey)

  return perpMkt
}

// get perp market for a specified market
export const getSpotMkt = async (client: CypherClient, poolName: string) => {
  const encodedMkt = encodeStrToUint8Array(poolName)
  const [poolPubkey, number] = derivePoolAddress(encodedMkt, client.cypherPID)
  console.log('Pool address: ' + poolPubkey)
  const pool = await Pool.load(client, poolPubkey)

  return pool
}

export const perpFillListener = (perpViewer: PerpMarketViewer) => {
  const fillsHandler: FillsListenerCB = (fills: FillsExtended) => {
    for (const fill of fills) {
      const side = fill.side['bid'] ? 'bid' : 'ask'
      console.log(
        'PERP - ' +
          'side: ' +
          side +
          ' amount: ' +
          fill.amount +
          ' price: ' +
          fill.price +
          ' maker: ' +
          fill.makerAccount +
          ' taker: ' +
          fill.takerAccount,
      )
      // if (fill.makerAccount === OUR_ORDERS_ACCOUNT ) { ... }
    }
    console.log('---------------------------------------------------')
  }

  const errorHandler: ErrorCB = (error: unknown) => {
    console.log(error)
    perpViewer.addFillsListener(fillsHandler, errorHandler)
  }

  perpViewer.addFillsListener(fillsHandler, errorHandler)
}

export const loadPerpFills = async (perpViewer: PerpMarketViewer) => {
  const fills = await perpViewer.loadFills()
  console.log('---------------------------------------------------')
  for (const fill of fills) {
    console.log('PERP - amount: ' + fill.amount + ' price: ' + fill.price)
  }
  console.log('---------------------------------------------------')
}

export const spotFillListener = (spotViewer: SpotMarketViewer) => {
  const fillsHandler: FillsListenerCB = (fills: FillsExtended) => {
    for (const fill of fills) {
      const side = fill.side['bid'] ? 'bid' : 'ask'
      console.log(
        'SPOT - side: ' +
          side +
          ' amount: ' +
          fill.amount +
          ' price: ' +
          fill.price +
          ' maker: ' +
          fill.makerAccount +
          ' taker: ' +
          fill.takerAccount,
      )
      // if (fill.makerAccount === OUR_ORDERS_ACCOUNT ) { ... }
    }
    console.log('---------------------------------------------------')
  }

  const errorHandler: ErrorCB = (error: unknown) => {
    console.log(error)
    spotViewer.addFillsListener(fillsHandler, errorHandler)
  }

  spotViewer.addFillsListener(fillsHandler, errorHandler)
}

export const loadSpotFills = async (spotViewer: SpotMarketViewer) => {
  const fills = await spotViewer.loadFills()
  console.log('---------------------------------------------------')
  for (const fill of fills) {
    console.log('SPOT - amount: ' + fill.amount + ' price: ' + fill.price)
  }
  console.log('---------------------------------------------------')
}

export const main = async () => {
  const wallet = loadWallet(KP_PATH)
  const MARKET = process.env.MARKET
  const POOL = process.env.POOL
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const perpMkt = await getPerpMkt(client, MARKET)
  const perpMktViewer = new PerpMarketViewer(client, perpMkt)

  const spotMkt = await getSpotMkt(client, POOL)
  const spotMktViewer = new SpotMarketViewer(client, spotMkt)

  await loadPerpFills(perpMktViewer)
  perpFillListener(perpMktViewer)

  await loadSpotFills(spotMktViewer)
  spotFillListener(spotMktViewer)

  while (true) {
    await sleep(100)
  }
}

main()
