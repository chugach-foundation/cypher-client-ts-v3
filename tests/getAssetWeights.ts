import {
  CacheAccount,
  Clearing,
  CypherAccount,
  CypherSubAccount,
  PerpetualMarket,
} from '@cypher-client/accounts'
import { CypherClient } from '@cypher-client/client'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { confirmOpts, loadAccs, fetchGraphqlData } from './utils'
import { Cluster } from '@cypher-client/types'
import { splToUiAmountFixed, encodeStrToUint8Array } from '@cypher-client/utils'
import { deriveMarketAddress } from '../src/utils/pda'
import { CONFIGS } from '@cypher-client/constants'
import { loadWallet } from './utils/wallet-loader'

// INFO:
// Example in this file is only guaranteed to work with a cypher account that has one main subaccount

interface ClearingCofig {
  initMargin: number
  maintMargin: number
}

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
const MARKET = process.env.MARKET

// get futures market for a specified market
export const getPerpsMkt = async (client: CypherClient, mktName: string) => {
  const encodedMkt = encodeStrToUint8Array(mktName)
  const [mktPubkey, number] = deriveMarketAddress(encodedMkt, client.cypherPID)
  const perpMkt = await PerpetualMarket.load(client, mktPubkey)

  return perpMkt
}

// get cache account for specified market
export const getPerpsCache = async (client: CypherClient) => {
  const cacheAddress = CONFIGS[CLUSTER].CACHE
  const perpCache = await CacheAccount.load(client, cacheAddress)

  return perpCache
}

export const getAssetWeights = (CacheAccount: CacheAccount, idx: number) => {
  const cache = CacheAccount.getCache(idx)
  const initAssetWeight = cache.perpInitAssetWeight / 100
  const initLiabsWeight = cache.perpInitLiabWeight / 100
  const maintAssetWeight = cache.perpMaintAssetWeight / 100
  const maintLiabsWeight = cache.perpMaintLiabWeight / 100

  return {
    initAssetWeight,
    initLiabsWeight,
    maintAssetWeight,
    maintLiabsWeight,
  }
}

export const main = async () => {
  const wallet = loadWallet(KP_PATH)
  const MARKET = process.env.MARKET
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const perpMkt = await getPerpsMkt(client, MARKET)
  const perpCache = await getPerpsCache(client)
  const idx = perpMkt.state.inner.config.cacheIndex

  const weights = getAssetWeights(perpCache, idx)

  console.log(weights)
}

main()

/* NOTE:
 
Because custom paths are used for imports this file might not run without custom args.
 
As this is an example file, it is not intended to be run directly, but if you wish to:
 
Run this from root directory:
 
```
  ts-node --project ./tests/tsconfig.json --require tsconfig-paths/register ./tests/getAssetWeights.ts
```
*/
