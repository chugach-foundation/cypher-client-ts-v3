import {
  CypherAccount,
  CypherSubAccount,
  DerivativesOrdersAccount,
  FuturesMarket,
  PerpetualMarket,
} from '@cypher-client/accounts'
import { CypherClient } from '@cypher-client/client'
import { makeCreateDerivativesOrdersAccountIx } from '@cypher-client/instructions'
import {
  deriveAccountAddress,
  deriveSubAccountAddress,
  getDefaultPriorityFeeIxs,
} from '@cypher-client/utils'
import { FuturesMarketViewer, PerpMarketViewer } from '@cypher-client/viewers'
import { Keypair, Transaction, PublicKey, ConfirmOptions } from '@solana/web3.js'
import fs from 'fs'
import { createAccs, createSubAcc } from '../testCreateAccount'

export const loadWallet = (KP_PATH: string): Keypair => {
  try {
    const keypair = JSON.parse(fs.readFileSync(__dirname + '/../' + KP_PATH, 'utf8'))
    return Keypair.fromSecretKey(Uint8Array.from(keypair))
  } catch (e) {
    console.error('Failed to load wallet', e)
    throw e
  }
}

// Default ConfirmOpts
export const confirmOpts: ConfirmOptions = {
  commitment: 'processed',
  skipPreflight: true,
}

export const loadAccs = async (client: CypherClient, wallet: Keypair) => {
  const [acctAddress] = deriveAccountAddress(wallet.publicKey, 0, client.cypherPID)
  let acc = await CypherAccount.load(client, acctAddress)

  if (acc === null) {
    await createAccs()
    acc = await CypherAccount.load(client, acctAddress)
    throw new Error('Account not found')
  }

  const [subAcctAddress] = deriveSubAccountAddress(acc.address, 0, client.cypherPID)
  let subAcc = await CypherSubAccount.load(client, subAcctAddress)

  if (subAcc === null) {
    await createSubAcc()
    subAcc = await CypherSubAccount.load(client, subAcctAddress)
    throw new Error('Account not found')
  }

  return [acc, subAcc] as const
}

export const getDerivativeOpenOrdersAcc = async (
  client: CypherClient,
  acc: CypherAccount,
  marketPubkey: PublicKey,
) => {
  const openOrdersAddress = acc.getDerivativesOpenOrdersAddress(marketPubkey)

  if (!(await acc.hasDerivativeOpenOrders(marketPubkey))) {
    const ix = await makeCreateDerivativesOrdersAccountIx(
      client,
      acc.address,
      marketPubkey,
      openOrdersAddress,
      client.walletPubkey,
      client.walletPubkey,
    )

    const { modifyComputeUnits, addPriorityFee } = getDefaultPriorityFeeIxs()

    const tx = new Transaction()
    tx.add(modifyComputeUnits)
    tx.add(addPriorityFee)
    tx.add(ix)

    await client.sendAndConfirm(tx)
  }

  return await DerivativesOrdersAccount.load(client, openOrdersAddress)
}

export const getMarketTypeFromMarketName = (marketName: string) => {
  if (marketName.includes('!')) {
    return 'pairFuture'
  }
  if (marketName.includes('-PERP')) {
    return 'perpetualFuture'
  }

  return 'spot'
}

export const getDerivMarketAndViewer = async (
  client: CypherClient,
  marketPubkey: PublicKey,
  marketType: 'pairFuture' | 'perpetualFuture',
) => {
  if (marketType === 'pairFuture') {
    const market = await FuturesMarket.load(client, marketPubkey)
    return [market, new FuturesMarketViewer(client, market)] as const
  }

  const market = await PerpetualMarket.load(client, marketPubkey)
  return [market, new PerpMarketViewer(client, market)] as const
}

export const fetchGraphqlData = async (api: string, query: string, variables?: Object) => {
  const res = await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })

  return await res.json()
}
