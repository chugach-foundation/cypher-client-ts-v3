import { CypherAccount, CypherSubAccount } from '@cypher-client/accounts'
import {
  deriveAccountAddress,
  derivePrivateClearingAddress,
  derivePublicClearingAddress,
  encodeStrToUint8Array,
  getDefaultPriorityFeeIxs,
} from '@cypher-client/utils'
import { confirmOpts, loadWallet } from './utils'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { CypherClient } from '@cypher-client/client'
import { Cluster } from '@cypher-client/types'
import { PublicKey } from '@solana/web3.js'

// Load  Env Variables
require('dotenv').config({
  path: __dirname + `/default.env`,
})

require('dotenv').config({
  path: __dirname + `/args.env`, // Can also be used to override default env variables
})

const KP_PATH = process.env.KEYPAIR_PATH
const CLUSTER = process.env.CLUSTER as Cluster
const RPC_ENDPOINT = process.env.RPC_ENDPOINT

export const createAccs = async () => {
  const wallet = loadWallet(KP_PATH)
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const authority = wallet.publicKey
  const cypherPID = client.cypherPID
  const [masterAccountAddress] = deriveAccountAddress(authority, 0, cypherPID)
  const [clearingAddress] = derivePublicClearingAddress(cypherPID)
  const masterAccountData = await CypherAccount.create(client, clearingAddress, authority)

  const subAccountData = await CypherSubAccount.create(
    client,
    authority,
    masterAccountAddress,
    0,
    encodeStrToUint8Array('CYPH0000'),
  )

  try {
    const { modifyComputeUnits, addPriorityFee } = getDefaultPriorityFeeIxs()
    await client.sendAndConfirmIxs(
      [modifyComputeUnits, addPriorityFee, ...masterAccountData.ixs, ...subAccountData.ixs],
      [wallet],
    )
  } catch (e) {
    console.error('Failed to create account/subaccount', e)
    throw e
  }
}

export const createMasterAcc = async () => {
  const wallet = loadWallet(KP_PATH)
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const authority = wallet.publicKey
  const cypherPID = client.cypherPID
  const [clearingAddress] = derivePublicClearingAddress(cypherPID)
  const masterAccountData = await CypherAccount.create(client, clearingAddress, authority)

  try {
    const { modifyComputeUnits, addPriorityFee } = getDefaultPriorityFeeIxs()
    await client.sendAndConfirmIxs(
      [modifyComputeUnits, addPriorityFee, ...masterAccountData.ixs],
      [wallet],
    )
  } catch (e) {
    console.error('Failed to create master account', e)
    throw e
  }
}

export const createSubAcc = async () => {
  const wallet = loadWallet(KP_PATH)
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const authority = wallet.publicKey
  const cypherPID = client.cypherPID
  const [masterAccountAddress] = deriveAccountAddress(authority, 0, cypherPID)

  const subAccountData = await CypherSubAccount.create(
    client,
    authority,
    masterAccountAddress,
    0,
    encodeStrToUint8Array('CYPH0000Main'),
  )

  try {
    const { modifyComputeUnits, addPriorityFee } = getDefaultPriorityFeeIxs()
    await client.sendAndConfirmIxs(
      [modifyComputeUnits, addPriorityFee, ...subAccountData.ixs],
      [wallet],
    )
  } catch (e) {
    console.error('Failed to create subaccount', e)
    throw e
  }
}

export const createWhitelistedMasterAcc = async () => {
  const wallet = loadWallet(KP_PATH)
  const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
  const authority = wallet.publicKey
  const cypherPID = client.cypherPID

  const [privateClearing] = derivePrivateClearingAddress(1, cypherPID)
  console.log(privateClearing.toString())
  const whitelistAccount = new PublicKey('DVser61Jg9PSWuBAhSmxhCiVBpjbJXLFzk4ESxvWc7DS')
  console.log(whitelistAccount.toString())

  const masterAccountData = await CypherAccount.createWhitelisted(
    client,
    privateClearing,
    whitelistAccount,
    authority,
    0,
  )

  try {
    const { modifyComputeUnits, addPriorityFee } = getDefaultPriorityFeeIxs()
    await client.sendAndConfirmIxs(
      [modifyComputeUnits, addPriorityFee, ...masterAccountData.ixs],
      [wallet],
    )
  } catch (e) {
    console.error('Failed to create master account', e)
    throw e
  }
}

createWhitelistedMasterAcc()
