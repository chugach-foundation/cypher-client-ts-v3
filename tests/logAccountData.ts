import {
  CacheAccount,
  Clearing,
  CypherAccount,
  CypherSubAccount,
  PerpetualMarket,
} from '@cypher-client/accounts'
import { CypherClient } from '@cypher-client/client'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { confirmOpts, loadAccs, fetchGraphqlData, loadAndSubscribeCache } from './utils'
import { Cluster } from '@cypher-client/types'
import { splToUiAmountFixed, encodeStrToUint8Array, sleep } from '@cypher-client/utils'
import { deriveMarketAddress } from '../src/utils/pda'
import { I80F48 } from '@blockworks-foundation/mango-client'
import { loadWallet } from './utils/wallet-loader'
import { PublicKey } from '@solana/web3.js'
import { splToUiAmount } from '../src/utils/tokenAmount'

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

// c-ratio (current ratio)
export const getCRatioRelatedData = (
  cacheAccount: CacheAccount,
  acc: CypherAccount,
  subAccounts: CypherSubAccount[],
) => {
  return acc.getCRatio(cacheAccount, subAccounts)
}

// initial portfolio margin ratio (lowest c-ratio before not being able to open trade)
export const getInitialMarginRatio = async (clearing: Clearing) => {
  return (clearing.state.config as ClearingCofig).initMargin
}

// portfolio maintenance ratio (lowest c-ratio before being open for liquidation)
export const getMaintenanceMarginRatio = async (clearing: Clearing) => {
  return (clearing.state.config as ClearingCofig).maintMargin
}

// leverage raito (portfolio leverage multiple)
export const getLeverageRatio = (assetsValueFixed: I80F48, liabsValueFixed: I80F48) => {
  const liabsValue = Number(liabsValueFixed.toFixed(6))
  const assetsValue = Number(assetsValueFixed.toFixed(6))
  return liabsValue / (assetsValue - liabsValue)
}

// portfolio value - unweighted
export const getUnweightedPortfoliovalue = (assetsValueFixed: I80F48, liabsValueFixed: I80F48) => {
  const liabsValue = Number(liabsValueFixed.toFixed(6))
  const assetsValue = Number(assetsValueFixed.toFixed(6))
  return assetsValue - liabsValue
}

// portfolio value - weighted (margin value on ui)
export const getWeightedPortfoliovalue = (assetsValueFixed: I80F48, liabsValueFixed: I80F48) => {
  const liabsValue = Number(liabsValueFixed.toFixed(6))
  const assetsValue = Number(assetsValueFixed.toFixed(6))
  return assetsValue - liabsValue
}

// returns positon size for a given perp market, can be used for futures as well
export const getPerpPosition = (subAccs: CypherSubAccount[], perpMarket: PerpetualMarket) => {
  // find the sub account that has a position for the given perp market
  const subAcc = subAccs.find((acc) => {
    const position = acc.getDerivativePosition(perpMarket.address)
    if (position) {
      return true
    } else {
      return false
    }
  })
  if (subAcc) {
    const perpPosition = subAcc.getDerivativePosition(perpMarket.address)
    const basePosition = perpPosition.basePosition
    const basePositionUi = Number(
      splToUiAmountFixed(basePosition, perpMarket.state.inner.config.decimals).toFixed(6),
    )
    const totalPosition = perpPosition.totalPosition
    const totalPositionUi = Number(
      splToUiAmountFixed(totalPosition, perpMarket.state.inner.config.decimals).toFixed(6),
    )

    console.log(
      'coinFree ',
      Number(
        splToUiAmount(
          perpPosition.state.openOrdersCache.coinFree,
          perpMarket.state.inner.config.decimals,
        ).toFixed(6),
      ),
      'coinTotal',
      Number(
        splToUiAmount(
          perpPosition.state.openOrdersCache.coinTotal,
          perpMarket.state.inner.config.decimals,
        ).toFixed(6),
      ),
      'pcFree',
      Number(splToUiAmount(perpPosition.state.openOrdersCache.pcFree, 6).toFixed(6)),
      'pcTotal',
      Number(splToUiAmount(perpPosition.state.openOrdersCache.pcTotal, 6).toFixed(6)),
    )

    console.log('basePos ', basePositionUi, 'filledPos ', totalPositionUi)

    return totalPositionUi
  } else {
    return undefined
  }
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

export const getAccountData = async (
  cacheAccount: CacheAccount,
  clearing: Clearing,
  account: CypherAccount,
  subAccounts: CypherSubAccount[],
  perpMarket: PerpetualMarket,
) => {
  const {
    assetsValue,
    liabilitiesValue,
    assetsValueUnweighted,
    liabilitiesValueUnweighted,
    cRatio,
  } = getCRatioRelatedData(cacheAccount, account, subAccounts)
  const unweightedPortfolioValue = getUnweightedPortfoliovalue(
    assetsValueUnweighted,
    liabilitiesValueUnweighted,
  )
  const weightedPortfolioValue = getWeightedPortfoliovalue(assetsValue, liabilitiesValue)
  const cRatioPerc = Number(cRatio.toFixed(6)) * 100 // * 100 turns c-ratio unto %, same format as init and maintenance ratios
  const initMarginRatio = await getInitialMarginRatio(clearing)
  const maintMarginRatio = await getMaintenanceMarginRatio(clearing)
  const leverageRatio = getLeverageRatio(assetsValue, liabilitiesValue)
  const perpPosition = await getPerpPosition(subAccounts, perpMarket)

  return {
    unweightedPortfolioValue,
    weightedPortfolioValue,
    cRatioPerc,
    initMarginRatio,
    maintMarginRatio,
    leverageRatio,
    perpPosition,
  }
}

export const main = async () => {
  let cacheAccount: CacheAccount = null
  let cypherAccount: CypherAccount = null
  const cypherSubAccounts: CypherSubAccount[] = []

  const wallet = loadWallet(KP_PATH)
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)

  const [marketPubkey, marketBump] = deriveMarketAddress(
    encodeStrToUint8Array(MARKET),
    client.cypherPID,
  )
  const perpMarket = await PerpetualMarket.load(client, marketPubkey)

  const cache = await loadAndSubscribeCache(client, (cache) => {
    cacheAccount = cache
  })
  cacheAccount = cache

  // currently this only fetches one sub account, but it should be reworked to fetch all of them
  const [account, subAccount] = await loadAccs(
    client,
    wallet,
    (acc) => {
      cypherAccount = acc
    },
    (subAccount) => {
      const idx = cypherSubAccounts.findIndex(
        (acc) => acc.address.toString() == subAccount.address.toString(),
      )
      // if the account is not in the array yet, let's just push it
      if (idx == -1) {
        cypherSubAccounts.push(subAccount)
      } else {
        cypherSubAccounts[idx] = subAccount
      }
    },
  )
  cypherAccount = account
  cypherSubAccounts.push(subAccount)

  const clearing = await Clearing.load(client, account.state.clearing)

  while (true) {
    getAccountData(cacheAccount, clearing, cypherAccount, cypherSubAccounts, perpMarket).then(
      console.log,
    )
    await sleep(500)
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
