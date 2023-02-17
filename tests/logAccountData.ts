import { Clearing, CypherAccount, CypherSubAccount, PerpetualMarket } from '@cypher-client/accounts'
import { CypherClient } from '@cypher-client/client'
import { CONFIGS } from '@cypher-client/constants'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { loadWallet, confirmOpts, loadAccs, fetchGraphqlData } from 'utils'
import { Cluster } from '@cypher-client/types'
import {
  deriveMarketAddress,
  encodeStrToUint8Array,
  splToUiAmountFixed
} from '@cypher-client/utils'
import { I80F48 } from '@blockworks-foundation/mango-client'

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

// c-ratio (current ratio)
export const getCRatioRelatedData = (acc: CypherAccount) => {
  return acc.getCRatio()
}

// initial portfolio margin ratio (lowest c-ratio before not being able to open trade)
export const getInitialMarginRatio = async (client: CypherClient, acc: CypherAccount) => {
  const clearing = await Clearing.load(client, acc.state.clearing)

  return (clearing.state.config as ClearingCofig).initMargin
}

// portfolio maintenance ratio (lowest c-ratio before being open for liquidation)
export const getMaintenanceMarginRatio = async (client: CypherClient, acc: CypherAccount) => {
  const clearing = await Clearing.load(client, acc.state.clearing)

  return (clearing.state.config as ClearingCofig).maintMargin
}

// leverage raito (portfolio leverage multiple)
export const getLeverageRatio = (acc: CypherAccount) => {
  const data = getCRatioRelatedData(acc)
  const liabsValue = Number(data.liabilitiesValue.toFixed(6))
  const assetsValue = Number(data.assetsValue.toFixed(6))
  return liabsValue / (assetsValue - liabsValue)
}

// returns positon size for a given perp market, can be used for futures as well
export const getPerpPosition = async (client: CypherClient, acc: CypherAccount, subacc: CypherSubAccount, mktName: string) => {
  const encodedMkt = encodeStrToUint8Array(mktName)
  const [mktPubkey, number] = deriveMarketAddress(encodedMkt, client.cypherPID)
  const perpMkt = await PerpetualMarket.load(client, mktPubkey)
  const basePosition = new I80F48(subacc.getDerivativePosition(mktPubkey).totalPosition)
  const position = Number(splToUiAmountFixed(basePosition, perpMkt.state.inner.config.decimals).toFixed(6))

  return position
}


// unreralized pnl (for your portfolio and a given mkt) WIP!!!
export const getUnrealizedPnl = async (acc: CypherAccount) => {
  // const config = CONFIGS[CLUSTER]
  // const query = `
  // 	query ($masterAaccountAddr: String) {
  // 		open_position(
  // 			order_by: { date_time: desc },
  // 			where: { master_account: { _eq: $masterAaccountAddr } }
  // 		) {
  // 			side
  // 			price
  // 			master_account
  // 			sub_account
  // 			market
  // 			date_time
  // 			coin_qty
  // 		}
  // 	}
  // `
  // const apiData = await fetchGraphqlData(config.HISTORY_API_REST, query, {
  //   masterAaccountAddr: acc.address.toString(),
  // })
  // const openPositions = get(apiData, 'open_position') as unknown as OpenPosition[]
  // let unrealizedPnl = 0
  // for (const pos of openPositions) {
  //   const market = markets[pos.market]
  //   const currentPice = getCurrentPrice(market)
  //   const currentPrice = getPriceWaterfall(market.priceState, market.metadata.marketType)
  //   unrealizedPnl += (currentPrice - pos.price) * pos.coinQty * (pos.side === 'bid' ? 1 : -1)
  // }
}

export const main = async () => {
  const wallet = loadWallet(KP_PATH)
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const [acc, subAcc] = await loadAccs(client, wallet)
  const MARKET = process.env.MARKET

  const cRatioData = getCRatioRelatedData(acc)
  const cRatio = Number(cRatioData.cRatio.toFixed(6)) * 100 // * 100 turns c-ratio unto %, same format as init and maintenance ratios
  const initMarginRatio = await getInitialMarginRatio(client, acc)
  const maintMarginRatio = await getMaintenanceMarginRatio(client, acc)
  const leverageRatio = getLeverageRatio(acc)
  const perpPosition = await getPerpPosition(client, acc, subAcc, MARKET)

  return {
    cRatio,
    initMarginRatio,
    maintMarginRatio,
    leverageRatio,
    perpPosition,
  }
}

main().then(console.log)

/* NOTE: 

Because custom paths are used for imports this file might not run without custom args.

As this is an example file, it is not intended to be run directly, but if you wish to:

Run this from root directory:

```
  ts-node --project ./tests/tsconfig.json --require tsconfig-paths/register ./tests/logAccountData.ts
```
*/
