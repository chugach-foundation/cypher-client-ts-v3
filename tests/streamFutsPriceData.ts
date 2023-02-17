import { CacheAccount, FuturesMarket } from '@cypher-client/accounts'
import { CypherClient } from '@cypher-client/client'
import { CONFIGS } from '@cypher-client/constants'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { loadWallet, confirmOpts } from 'utils'
import { CacheListenerCB, Cache, Cluster } from '@cypher-client/types'
import { deriveMarketAddress, encodeStrToUint8Array, sleep } from '@cypher-client/utils'
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

// get futures market for a specified market
export const getFuturersMkt = async (client: CypherClient, mktName: string) => {
  const encodedMkt = encodeStrToUint8Array(mktName)
  const [mktPubkey, number] = deriveMarketAddress(encodedMkt, client.cypherPID)
  const futsMkt = await FuturesMarket.load(client, mktPubkey)

  return futsMkt
}

// get cache account for specified market
export const getFuturersCache = async (client: CypherClient) => {
  const cacheAddress = CONFIGS[CLUSTER].CACHE
  const futsCache = await CacheAccount.load(client, cacheAddress)

  return futsCache
}

export const cacheListner = (cache: CacheAccount, idx: number) => {
  const cacheHandler: CacheListenerCB = (cache: Cache) => {
    console.log(Number(new I80F48(cache.marketPrice).toFixed(20)))
  }

  cache.addCacheListener(cacheHandler, idx)
}

export const main = async () => {
  const wallet = loadWallet(KP_PATH)
  const MARKET = process.env.MARKET
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const futsMkt = await getFuturersMkt(client, MARKET)
  const futsCache = await getFuturersCache(client)
  const idx = futsMkt.state.inner.config.cacheIndex

  cacheListner(futsCache, idx)

  while (true) {
    await sleep(100)
  }
}

main()
