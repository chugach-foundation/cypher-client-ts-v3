import { PerpetualMarket } from '@cypher-client/accounts'
import { CypherClient } from '@cypher-client/client'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { confirmOpts } from './utils'
import { Cluster } from '@cypher-client/types'
import { deriveMarketAddress, sleep } from '@cypher-client/utils'
import { priceLotsToNative, splToUiAmount } from '../src/utils/tokenAmount'
import { BN } from '@project-serum/anchor'
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

export const main = async () => {
  const wallet = loadWallet(KP_PATH)
  const MARKET = process.env.MARKET
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const perpMkt = await getPerpMkt(client, MARKET)

  const tickSizeNativeUnits = priceLotsToNative(
    new BN(perpMkt.state.inner.tickSize),
    perpMkt.state.inner.baseMultiplier,
    perpMkt.state.inner.quoteMultiplier,
    perpMkt.state.inner.config.decimals,
  )
  console.log(tickSizeNativeUnits.toNumber())
  const tickSizeUi = splToUiAmount(tickSizeNativeUnits, 6)
  console.log(tickSizeUi)
}

main()
