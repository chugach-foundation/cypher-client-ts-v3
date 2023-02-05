import { Clearing, CypherAccount, CypherSubAccount, PerpetualMarket } from '@cypher-client/accounts'
import { CypherClient } from '@cypher-client/client'
import { CONFIGS } from '@cypher-client/constants'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { loadWallet, confirmOpts, loadAccs, fetchGraphqlData } from 'utils'
import { Cluster, OrderbookListenerCB, ParsedOrderbook } from '@cypher-client/types'
import { deriveMarketAddress, sleep, splToUiAmountFixed } from '@cypher-client/utils'
import { I80F48 } from '@blockworks-foundation/mango-client'
import { PerpMarketViewer } from '@cypher-client/viewers'
import { AccountChangeCallback } from '@solana/web3.js'


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


export const bookListeners = (perpViewer: PerpMarketViewer) => {

    const bidHandler: OrderbookListenerCB = (bid: ParsedOrderbook) => {
        for (let order of bid) {
            console.log('bids: '
                + ' | price: ' + order[0]
                + ' | size: ' + order[1])
        }
        console.log('---------------------------------------------------')
    }

    const askHandler: OrderbookListenerCB = (ask: ParsedOrderbook) => {
        for (let order of ask) {
            console.log('asks: '
                + ' | price: ' + order[0]
                + ' | size: ' + order[1])
        }
        console.log('---------------------------------------------------')
    }

    perpViewer.addBidsListener(bidHandler)
    perpViewer.addAsksListener(askHandler)
}

export const main = async () => {
    const wallet = loadWallet(KP_PATH)
    const MARKET = process.env.MARKET
    const client = new CypherClient(CLUSTER, RPC_ENDPOINT, new NodeWallet(wallet), confirmOpts)
    const perpMkt = await getPerpMkt(client, MARKET)
    const perpMktViewer = new PerpMarketViewer(client, perpMkt)

    bookListeners(perpMktViewer)


    while (true) {
        await sleep(100)
    }

}

main()