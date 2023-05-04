import { CypherAccount } from '@cypher-client/accounts'
import { CONFIGS } from '@cypher-client/constants'
import { fetchGraphqlData } from '../utils'
import { Cluster } from '@cypher-client/types'

interface OpenPosition {
  side: 'bid' | 'ask'
  price: number
  masterAccount: string
  subAccount: string
  market: string
  dateTime: string
  coinQty: number
}

// Load  Env Variables
require('dotenv').config({
  path: __dirname + `/default.env`,
})

require('dotenv').config({
  path: __dirname + `/args.env`, // Can also be used to override default env variables
})

const CLUSTER = process.env.CLUSTER as Cluster

export const getOpenPositions = async (acc: CypherAccount) => {
  const config = CONFIGS[CLUSTER]
  const query = `
  	query ($masterAaccountAddr: String) {
  		open_position(
  			order_by: { date_time: desc },
  			where: { master_account: { _eq: $masterAaccountAddr } }
  		) {
  			side
  			price
  			master_account
  			sub_account
  			market
  			date_time
  			coin_qty
  		}
  	}
  `
  const apiData = await fetchGraphqlData(config.HISTORY_API_REST, query, {
    masterAaccountAddr: acc.address.toString(),
  })

  return apiData.open_position as unknown as OpenPosition[]
}
