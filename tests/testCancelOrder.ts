import { getMarketTypeFromMarketName } from './utils'
import { makeCancelFirstDerivOrder } from './orders/cancel-deriv-order'

// Load  Env Variables
require('dotenv').config({
  path: __dirname + `/default.env`,
})

require('dotenv').config({
  path: __dirname + `/args.env`, // Can also be used to override default env variables
})

// Constants
const MARKET = process.env.MARKET // ETH-PERP, BTC-PERP, SOL, ETH, SOL-FUTURES, etc

// General cancel order fn
export const makeCancelOrder = async () => {
  const marketType = getMarketTypeFromMarketName(MARKET)
  if (marketType === 'spot') {
    return console.log('not implemented yet')
  }

  return await makeCancelFirstDerivOrder(marketType)
}

makeCancelOrder()

/* NOTE: 

Because custom paths are used for imports this file might not run without custom args.

As this is an example file, it is not intended to be run directly, but if you wish to:

Run this from root directory:

```
  ts-node --project ./tests/tsconfig.json --require tsconfig-paths/register ./tests/testCancelOrder.ts
```
*/
