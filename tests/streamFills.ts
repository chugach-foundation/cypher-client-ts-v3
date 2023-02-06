import { PerpetualMarket } from '@cypher-client/accounts'
import { CypherClient } from '@cypher-client/client'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { loadWallet, confirmOpts } from 'utils'
import { Cluster } from '@cypher-client/types'
import { deriveMarketAddress, sleep } from '@cypher-client/utils'
import { PerpMarketViewer } from '@cypher-client/viewers'
import { FillsListenerCB, Fills } from '../lib/types/index'
import { FillsExtended } from '../src/types/index';

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

// encoding string for deriving market addresses
export const encodeStrToUint8Array = (str: string): number[] => {
  const encoder = new TextEncoder()
  const empty = Array(32).fill(0)
  const encodedArr = Array.from(encoder.encode(str))
  return empty.map((_, i) => encodedArr[i] || 0)
}

// get perp market for a specified market
export const getPerpMkt = async (client: CypherClient, mktName: string) => {
  const encodedMkt = encodeStrToUint8Array(mktName)
  const [mktPubkey, number] = deriveMarketAddress(encodedMkt, client.cypherPID)
  const perpMkt = await PerpetualMarket.load(client, mktPubkey)

  return perpMkt
}

export const fillListener = (perpViewer: PerpMarketViewer) => {
  const fillsHandler: FillsListenerCB = (fills: FillsExtended) => {
    for (const fill of fills) {
      console.log(
        'amount: ' +
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

  perpViewer.addFillsListener(fillsHandler)
}

export const loadFills = async (perpViewer: PerpMarketViewer) => {
  const fills = await perpViewer.loadFills()
  console.log('---------------------------------------------------')
  for (const fill of fills) {
    console.log('amount: ' + fill.amount + ' price: ' + fill.price)
  }
  console.log('---------------------------------------------------')
}

export const main = async () => {
  const wallet = loadWallet(KP_PATH)
  const MARKET = process.env.MARKET
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const perpMkt = await getPerpMkt(client, MARKET)
  const perpMktViewer = new PerpMarketViewer(client, perpMkt)

  await loadFills(perpMktViewer)
  fillListener(perpMktViewer)

  while (true) {
    await sleep(100)
  }
}

main()
