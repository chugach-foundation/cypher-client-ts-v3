import { CypherClient, CypherProgramClient } from '@cypher-client/client'
import { CypherAccount } from '@cypher-client/accounts/account'
import { PublicKey } from '@solana/web3.js'
import { CypherSubAccount } from '@cypher-client/accounts/subAccount'
import { CacheAccount } from '@cypher-client/accounts/cacheAccount'
import { CONFIGS } from '@cypher-client/constants'

// Load  Env Variables
require('dotenv').config({
  path: __dirname + `/default.env`,
})

const client = new CypherClient('mainnet-beta', process.env.RPC_ENDPOINT)

const cypherAccountPubkey = new PublicKey('4R476ZsZfQaJhbmt6iam4o49mD4vjbfALkgWxehtnLMY')

async function testRun(cypherClient: CypherProgramClient) {
  const cacheAccount = await CacheAccount.load(cypherClient, CONFIGS['mainnet-beta'].CACHE)
  const account = await CypherAccount.load(cypherClient, cypherAccountPubkey)
  const subAccountCaches = account.state.subAccountCaches.filter(
    (sac) => sac.subAccount.toString() != PublicKey.default.toString(),
  )
  const subAccounts = await Promise.all(
    subAccountCaches.map(async (sac) => {
      return await CypherSubAccount.load(cypherClient, sac.subAccount)
    }),
  )

  console.log('///// Master Account \\\\\\')
  if (account != null) {
    const masterCRatio = account.getCRatio(cacheAccount, subAccounts)
    console.log('Assets Value: ', masterCRatio.assetsValue.toFixed(8))
    console.log('Liabilities Value: ', masterCRatio.liabilitiesValue.toFixed(8))
    console.log('C Ratio: ', masterCRatio.cRatio.toFixed(8))
  }
  console.log('///// Master Account \\\\\\\n')
}

testRun(client as CypherProgramClient)
