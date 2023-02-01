import { CypherClient } from '@cypher-client/client'
import { CypherAccount } from '@cypher-client/accounts/account'
import { PublicKey } from '@solana/web3.js'
import { CypherSubAccount } from '@cypher-client/accounts/subAccount'
import { CacheAccount } from '@cypher-client/accounts/cacheAccount'
import { CONFIGS } from '@cypher-client/constants'

// Load  Env Variables
require('dotenv').config({
  path: __dirname + `/default.env`,
})

const client = new CypherClient('devnet', process.env.RPC_ENDPOINT)

const cypherAccountPubkey = new PublicKey('F6aEixL5NsjzNwUuzs3xA4nY5Rgn6m3GASPTJqHqB1Qk')
const cypherSubAccountPubkey = new PublicKey('68GjaPgHT3Fk5baBg3CZWYfLoCpzLfawqgGiKfdUqhtn')

async function testRun(cypherClient: CypherClient) {
  const cacheAccount = await CacheAccount.load(cypherClient, CONFIGS['devnet'].CACHE)
  const account = await CypherAccount.load(cypherClient, cypherAccountPubkey)
  const subAccount = await CypherSubAccount.load(cypherClient, cypherSubAccountPubkey)

  console.log('///// Master Account \\\\\\')
  if (account != null) {
    const masterCRatio = account.getCRatio()
    console.log('Assets Value: ', masterCRatio.assetsValue.toFixed(8))
    console.log('Liabilities Value: ', masterCRatio.liabilitiesValue.toFixed(8))
    console.log('C Ratio: ', masterCRatio.cRatio.toFixed(8))
  }
  console.log('///// Master Account \\\\\\\n')

  console.log('///// Sub Account \\\\\\')
  if (subAccount != null) {
    const assetsValue = subAccount.getAssetsValue(cacheAccount)
    const liabilitiesValue = subAccount.getLiabilitiesValue(cacheAccount)
    console.log('Assets Value: ', assetsValue.toFixed(8))
    console.log('Liabilities Value: ', liabilitiesValue.toFixed(8))
    if (liabilitiesValue.isZero()) {
      console.log('C Ratio: MAX')
    } else {
      console.log('C Ratio: ', assetsValue.div(liabilitiesValue).toFixed(8))
    }
  }
  console.log('///// Sub Account \\\\\\\n')
}

testRun(client)
