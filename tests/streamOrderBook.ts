import { PerpetualMarket } from '@cypher-client/accounts'
import { CypherClient, CypherProgramClient } from '@cypher-client/client'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { confirmOpts } from './utils'
import { Cluster, ErrorCB, OrderbookListenerCB, ParsedOrderbook } from '@cypher-client/types'
import { deriveMarketAddress, encodeStrToUint8Array, sleep } from '@cypher-client/utils'
import { PerpMarketViewer } from '@cypher-client/viewers'
import { loadWallet } from './utils/wallet-loader'

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
export const getPerpMkt = async (client: CypherProgramClient, mktName: string) => {
  const encodedMkt = encodeStrToUint8Array(mktName)
  const [mktPubkey, number] = deriveMarketAddress(encodedMkt, client.cypherPID)
  const perpMkt = await PerpetualMarket.load(client, mktPubkey)

  return perpMkt
}

export const bookListeners = (perpViewer: PerpMarketViewer) => {
  // bid side handler
  const bidHandler: OrderbookListenerCB = (bid: ParsedOrderbook) => {
    for (const order of bid) {
      console.log('bids: ' + ' | price: ' + order[0] + ' | size: ' + order[1])
    }
    console.log('---------------------------------------------------')
  }
  const bidErrorHandler: ErrorCB = (error: unknown) => {
    console.log(error)
    perpViewer.addBidsListener(bidHandler, bidErrorHandler)
  }
  // ask side handler
  const askHandler: OrderbookListenerCB = (ask: ParsedOrderbook) => {
    for (const order of ask) {
      console.log('asks: ' + ' | price: ' + order[0] + ' | size: ' + order[1])
    }
    console.log('---------------------------------------------------')
  }
  const askErrorHandler: ErrorCB = (error: unknown) => {
    console.log(error)
    perpViewer.addAsksListener(bidHandler, askErrorHandler)
  }

  perpViewer.addBidsListener(bidHandler, bidErrorHandler)
  perpViewer.addAsksListener(askHandler, askErrorHandler)
}

export const main = async () => {
  const wallet = loadWallet(KP_PATH)
  const MARKET = process.env.MARKET
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const perpMkt = await getPerpMkt(client as CypherProgramClient, MARKET)
  const perpMktViewer = new PerpMarketViewer(client, perpMkt)

  bookListeners(perpMktViewer)

  while (true) {
    await sleep(100)
  }
}

main()
