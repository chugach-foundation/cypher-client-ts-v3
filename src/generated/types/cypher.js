"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = void 0;
exports.IDL = {
    "version": "0.1.0",
    "name": "cypher",
    "instructions": [
        {
            "name": "cacheMarketOraclePrice",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "market",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "oracleProducts",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "cachePoolOraclePrice",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "pool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "oracleProducts",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "closeFuturesOpenOrders",
            "accounts": [
                {
                    "name": "masterAccount",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "market",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "openOrders",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "closeMarket",
            "accounts": [
                {
                    "name": "market",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "orderbook",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "bids",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "asks",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "eventQueue",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "createAccount",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "accountNumber",
                    "type": "u8"
                },
                {
                    "name": "accountBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "createClearing",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "args",
                    "type": {
                        "defined": "CreateClearingArgs"
                    }
                }
            ]
        },
        {
            "name": "createFuturesOpenOrders",
            "accounts": [
                {
                    "name": "masterAccount",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "market",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "openOrders",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "createMarket",
            "accounts": [
                {
                    "name": "market",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "priceHistory",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "oracleProducts",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "baseMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "quoteMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "baseVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "quoteVault",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "quotePool",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "orderbook",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "bids",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "asks",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "eventQueue",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "args",
                    "type": {
                        "defined": "CreateMarketArgs"
                    }
                }
            ]
        },
        {
            "name": "createPool",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "pool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "oracleProducts",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "dexMarket",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "args",
                    "type": {
                        "defined": "CreatePoolArgs"
                    }
                }
            ]
        },
        {
            "name": "createSubAccount",
            "accounts": [
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "subAccountNumber",
                    "type": "u8"
                },
                {
                    "name": "subAccountBump",
                    "type": "u8"
                },
                {
                    "name": "subAccountAlias",
                    "type": {
                        "array": [
                            "u8",
                            32
                        ]
                    }
                }
            ]
        },
        {
            "name": "createWhitelist",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "whitelist",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "accountOwner",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "createWhitelistedAccount",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "whitelist",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "accountNumber",
                    "type": "u8"
                },
                {
                    "name": "accountBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "depositDeliverable",
            "accounts": [
                {
                    "name": "market",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "pool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "sourceTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "depositFunds",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "pool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "sourceTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "editSubAccountMargining",
            "accounts": [
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "marginingType",
                    "type": {
                        "defined": "SubAccountMargining"
                    }
                }
            ]
        },
        {
            "name": "initOracleProducts",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "oracleProducts",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "productsType",
                    "type": {
                        "defined": "ProductsType"
                    }
                },
                {
                    "name": "totalNumProducts",
                    "type": "u8"
                },
                {
                    "name": "weights",
                    "type": {
                        "vec": "u16"
                    }
                }
            ]
        },
        {
            "name": "liquidateCollateral",
            "accounts": [
                {
                    "name": "liqorAccount",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "liqorSubAccount",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "liqeeAccount",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "liqeeSubAccount",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "assetMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "liabilityMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "setAccountDelegate",
            "accounts": [
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "delegate",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "setSubAccountDelegate",
            "accounts": [
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "delegate",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "settlePosition",
            "accounts": [
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "market",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "quoteMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "quotePool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "oracleProducts",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "signer",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "transferBetweenSubAccounts",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "fromSubAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "toSubAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "assetMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "assetPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "updateAccountMargin",
            "accounts": [
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "signer",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "updateSubAccountMargin",
            "accounts": [
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "signer",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "isSpot",
                    "type": "bool"
                }
            ]
        },
        {
            "name": "updateTokenIndex",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "pool",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "withdrawFunds",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "pool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "destinationTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "cancelSpotOrder",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "assetPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "quotePool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "assetMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "quoteMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "assetVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "quoteVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "oracleProducts",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "dex",
                    "accounts": [
                        {
                            "name": "market",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "openOrders",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "eventQueue",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "bids",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "asks",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "coinVault",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "pcVault",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "vaultSigner",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "tokenProgram",
                            "isMut": false,
                            "isSigner": false
                        },
                        {
                            "name": "dexProgram",
                            "isMut": false,
                            "isSigner": false
                        }
                    ]
                }
            ],
            "args": [
                {
                    "name": "args",
                    "type": {
                        "defined": "CancelOrderArgs"
                    }
                }
            ]
        },
        {
            "name": "closeSpotOpenOrders",
            "accounts": [
                {
                    "name": "masterAccount",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "assetPool",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "dexMarket",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "openOrders",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "dexProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "initSpotOpenOrders",
            "accounts": [
                {
                    "name": "masterAccount",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "pool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "dexMarket",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "openOrders",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "dexProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "newSpotOrder",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "assetPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "quotePool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "assetMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "quoteMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "assetVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "quoteVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "oracleProducts",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "dex",
                    "accounts": [
                        {
                            "name": "market",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "openOrders",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "eventQueue",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "requestQueue",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "bids",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "asks",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "coinVault",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "pcVault",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "vaultSigner",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "rent",
                            "isMut": false,
                            "isSigner": false
                        },
                        {
                            "name": "tokenProgram",
                            "isMut": false,
                            "isSigner": false
                        },
                        {
                            "name": "dexProgram",
                            "isMut": false,
                            "isSigner": false
                        }
                    ]
                }
            ],
            "args": [
                {
                    "name": "args",
                    "type": {
                        "defined": "NewSpotOrderArgs"
                    }
                }
            ]
        },
        {
            "name": "settleSpotFunds",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "assetPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "quotePool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "assetMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "quoteMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "assetVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "quoteVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "oracleProducts",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "dex",
                    "accounts": [
                        {
                            "name": "market",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "openOrders",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "coinVault",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "pcVault",
                            "isMut": true,
                            "isSigner": false
                        },
                        {
                            "name": "vaultSigner",
                            "isMut": false,
                            "isSigner": false
                        },
                        {
                            "name": "tokenProgram",
                            "isMut": false,
                            "isSigner": false
                        },
                        {
                            "name": "dexProgram",
                            "isMut": false,
                            "isSigner": false
                        }
                    ]
                }
            ],
            "args": []
        },
        {
            "name": "cancelFuturesOrder",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "market",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "openOrders",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "orderbook",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "eventQueue",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "bids",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "asks",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "assetMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "quoteMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "quotePool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "oracleProducts",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "args",
                    "type": {
                        "defined": "CancelOrderArgs"
                    }
                }
            ]
        },
        {
            "name": "consumeEvents",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "market",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "orderbook",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "eventQueue",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "limit",
                    "type": "u16"
                }
            ]
        },
        {
            "name": "newFuturesOrder",
            "accounts": [
                {
                    "name": "clearing",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "market",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "openOrders",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "priceHistory",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "orderbook",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "eventQueue",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "bids",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "asks",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "assetMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "quoteMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "quotePool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "oracleProducts",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "args",
                    "type": {
                        "defined": "NewFuturesOrderArgs"
                    }
                }
            ]
        },
        {
            "name": "settleFuturesFunds",
            "accounts": [
                {
                    "name": "masterAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "subAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "openOrders",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "market",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "assetMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "quotePool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "clearing",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bumpSeed",
                        "type": {
                            "array": [
                                "u8",
                                1
                            ]
                        }
                    },
                    {
                        "name": "clearingType",
                        "docs": [
                            "the type of the clearing"
                        ],
                        "type": {
                            "defined": "ClearingType"
                        }
                    },
                    {
                        "name": "padding1",
                        "type": {
                            "array": [
                                "u8",
                                6
                            ]
                        }
                    },
                    {
                        "name": "clearingNumberSeed",
                        "type": {
                            "array": [
                                "u16",
                                1
                            ]
                        }
                    },
                    {
                        "name": "padding2",
                        "type": {
                            "array": [
                                "u16",
                                3
                            ]
                        }
                    },
                    {
                        "name": "authority",
                        "docs": [
                            "the clearing's authority"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "feeMint",
                        "docs": [
                            "the mint of the token used to calculate fee tiers"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "quoteMint",
                        "docs": [
                            "the mint of the token used as the quote mint condition for position margining"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "feeTiers",
                        "docs": [
                            "the fee tiers"
                        ],
                        "type": {
                            "array": [
                                {
                                    "defined": "FeeTier"
                                },
                                10
                            ]
                        }
                    },
                    {
                        "name": "config",
                        "docs": [
                            "the config of the clearing"
                        ],
                        "type": {
                            "defined": "ClearingConfig"
                        }
                    }
                ]
            }
        },
        {
            "name": "whitelist",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "clearing",
                        "docs": [
                            "the corresponding clearing"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "authority",
                        "docs": [
                            "the clearing's authority"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "accountOwner",
                        "docs": [
                            "the account owner"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "account",
                        "docs": [
                            "the actual cypher account"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "status",
                        "docs": [
                            "whitelist status",
                            "i.e, when a whitelist status is revoked, the authority of the clearing should be able",
                            "to suspend a cypher account"
                        ],
                        "type": {
                            "defined": "WhitelistStatus"
                        }
                    },
                    {
                        "name": "padding1",
                        "type": {
                            "array": [
                                "u8",
                                7
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "market",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "config",
                        "docs": [
                            "the config of the market"
                        ],
                        "type": {
                            "defined": "MarketConfig"
                        }
                    },
                    {
                        "name": "marketName",
                        "docs": [
                            "the name of the market, which is also used as a seed"
                        ],
                        "type": {
                            "array": [
                                "u8",
                                32
                            ]
                        }
                    },
                    {
                        "name": "authority",
                        "docs": [
                            "the authority of the market"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "priceHistory",
                        "docs": [
                            "the price history account for on-chain twap"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "oracleProducts",
                        "docs": [
                            "the oracle products account"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "tokenMint",
                        "docs": [
                            "the mint of the token this derivative market represents"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "underlyingMint",
                        "docs": [
                            "the mint of the underlying token this derivative market may physically deliver"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "orderBook",
                        "docs": [
                            "the order book for this market"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "bids",
                        "docs": [
                            "the bids account for this market"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "asks",
                        "docs": [
                            "the asks account for this market"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "eventQueue",
                        "docs": [
                            "the asks account for this market"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "quoteMint",
                        "docs": [
                            "the quote mint for this market"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "baseVault",
                        "docs": [
                            "the base vault for this market"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "quoteVault",
                        "docs": [
                            "the quote vault for this market"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "minBaseOrderSize",
                        "docs": [
                            "the market's minimum allowed order size in base token amount"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "tickSize",
                        "docs": [
                            "the tick size of the market"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "baseMultiplier",
                        "docs": [
                            "the base currency multiplier"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "quoteMultiplier",
                        "docs": [
                            "the quote currency multiplier"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "tokenSupply",
                        "docs": [
                            "the supply of the derivative token",
                            "i.e in the case of a market being for physical delivery of the underlying asset",
                            "the token supply should be equal to the amount of tokens available for delivery"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "activatesAt",
                        "docs": [
                            "timestamp at which the market becomes active"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "expiresAt",
                        "docs": [
                            "timestamp at which the market expires"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "positionsCount",
                        "docs": [
                            "number of open positions in this market"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "protocolFees",
                        "docs": [
                            "the currently accumulated trading fees"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "marketPrice",
                        "docs": [
                            "the twap price"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "oraclePrice",
                        "docs": [
                            "the oracle price"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "oracleUpdateAt",
                        "docs": [
                            "timestamp of the last oracle update"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "totalRaised",
                        "docs": [
                            "the total amount of quote token that is available for the pre-ido token project's team to be collected"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "totalBorrows",
                        "docs": [
                            "the total amount of borrows of the derivative"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "totalPurchased",
                        "docs": [
                            "the total amount of purchased tokens in the case of a pre-ido market"
                        ],
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "futuresOrdersAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "orderCount",
                        "docs": [
                            "number of orders"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "padding",
                        "type": {
                            "array": [
                                "u8",
                                7
                            ]
                        }
                    },
                    {
                        "name": "authority",
                        "docs": [
                            "the account's authority"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "market",
                        "docs": [
                            "the account's authority"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "subAccountsMargining",
                        "docs": [
                            "the margining of each of the sub accounts"
                        ],
                        "type": {
                            "array": [
                                "u8",
                                24
                            ]
                        }
                    },
                    {
                        "name": "baseTokenFree",
                        "docs": [
                            "the amount of base token free"
                        ],
                        "type": {
                            "array": [
                                "u64",
                                24
                            ]
                        }
                    },
                    {
                        "name": "baseTokenLocked",
                        "docs": [
                            "the amount of base token locked"
                        ],
                        "type": {
                            "array": [
                                "u64",
                                24
                            ]
                        }
                    },
                    {
                        "name": "quoteTokenFree",
                        "docs": [
                            "the amount of quote token free"
                        ],
                        "type": {
                            "array": [
                                "u64",
                                24
                            ]
                        }
                    },
                    {
                        "name": "quoteTokenLocked",
                        "docs": [
                            "the amount of quote token locked in orders"
                        ],
                        "type": {
                            "array": [
                                "u64",
                                24
                            ]
                        }
                    },
                    {
                        "name": "openOrders",
                        "docs": [
                            "the open orders in this account"
                        ],
                        "type": {
                            "array": [
                                {
                                    "defined": "FuturesOpenOrder"
                                },
                                128
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "oracleProducts",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "productsType",
                        "type": {
                            "defined": "ProductsType"
                        }
                    },
                    {
                        "name": "padding",
                        "type": {
                            "array": [
                                "u8",
                                7
                            ]
                        }
                    },
                    {
                        "name": "tokenMint",
                        "type": "publicKey"
                    },
                    {
                        "name": "spotMint",
                        "type": "publicKey"
                    },
                    {
                        "name": "products",
                        "type": {
                            "vec": {
                                "array": [
                                    "u8",
                                    32
                                ]
                            }
                        }
                    },
                    {
                        "name": "weights",
                        "type": {
                            "vec": "u16"
                        }
                    }
                ]
            }
        },
        {
            "name": "pool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "signerSeeds",
                        "docs": [
                            "the signer seeds for this account"
                        ],
                        "type": {
                            "array": [
                                "u8",
                                1
                            ]
                        }
                    },
                    {
                        "name": "isMarginable",
                        "docs": [
                            "whether this pool is eligible for margining"
                        ],
                        "type": "bool"
                    },
                    {
                        "name": "padding",
                        "type": {
                            "array": [
                                "u8",
                                14
                            ]
                        }
                    },
                    {
                        "name": "config",
                        "docs": [
                            "the pool config"
                        ],
                        "type": {
                            "defined": "PoolConfig"
                        }
                    },
                    {
                        "name": "authority",
                        "docs": [
                            "the authority over this account"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "tokenMint",
                        "docs": [
                            "the address of the token mint this pool represents"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "tokenVault",
                        "docs": [
                            "the address of the token vault"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "oracleProducts",
                        "docs": [
                            "the oracle products account"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "dexMarket",
                        "docs": [
                            "the dex market for this pool"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "deposits",
                        "docs": [
                            "the amount of deposits"
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "borrows",
                        "docs": [
                            "the amount of borrows"
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "depositIndex",
                        "docs": [
                            "the deposit index"
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "borrowIndex",
                        "docs": [
                            "the borrow index"
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "accumDepositInterestPayment",
                        "docs": [
                            "accumulated deposit interest payments denominated in quote currency."
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "accumBorrowInterestPayment",
                        "docs": [
                            "accumulated borrow interest payments denominated in quote currency."
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "accumBorrows",
                        "docs": [
                            "accumulated borrows"
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "accumRepays",
                        "docs": [
                            "accumulated repays"
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "indexUpdatedAt",
                        "docs": [
                            "timestamp of the last index update"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "oraclePrice",
                        "docs": [
                            "the oracle price for this asset"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "oracleUpdateAt",
                        "docs": [
                            "timestamp of the last oracle update"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "padding2",
                        "type": {
                            "array": [
                                "u64",
                                5
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "priceHistory",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "assetMint",
                        "docs": [
                            "c_asset_mint address of market this price history is for."
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "data",
                        "docs": [
                            "array of price infos."
                        ],
                        "type": {
                            "array": [
                                {
                                    "defined": "PriceWithTs"
                                },
                                14400
                            ]
                        }
                    },
                    {
                        "name": "config",
                        "type": {
                            "defined": "PriceHistoryConfig"
                        }
                    },
                    {
                        "name": "longerHead",
                        "docs": [
                            "head of prices for longer time horizon."
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "shorterHead",
                        "docs": [
                            "head of prices for shorter time horizon."
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "tail",
                        "docs": [
                            "tail of prices(most recently added price)."
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "padding1",
                        "type": "u16"
                    },
                    {
                        "name": "padding2",
                        "type": {
                            "array": [
                                "u64",
                                8
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "cypherAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bumpSeed",
                        "docs": [
                            "the bump seed"
                        ],
                        "type": {
                            "array": [
                                "u8",
                                1
                            ]
                        }
                    },
                    {
                        "name": "accountNumberSeed",
                        "docs": [
                            "the account number seed"
                        ],
                        "type": {
                            "array": [
                                "u8",
                                1
                            ]
                        }
                    },
                    {
                        "name": "accountType",
                        "docs": [
                            "the account type"
                        ],
                        "type": {
                            "defined": "AccountType"
                        }
                    },
                    {
                        "name": "feeTier",
                        "docs": [
                            "the fee tier of this account"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "padding",
                        "type": {
                            "array": [
                                "u8",
                                12
                            ]
                        }
                    },
                    {
                        "name": "clearing",
                        "docs": [
                            "the clearing this account belongs to"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "authority",
                        "docs": [
                            "the account's authority, should match sub accounts authority"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "delegate",
                        "docs": [
                            "the account's delegate"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "subAccountCaches",
                        "docs": [
                            "the sub account cache"
                        ],
                        "type": {
                            "array": [
                                {
                                    "defined": "SubAccountCache"
                                },
                                24
                            ]
                        }
                    },
                    {
                        "name": "updatedAt",
                        "docs": [
                            "slot of the last account update"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "padding2",
                        "type": {
                            "array": [
                                "u8",
                                8
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "cypherSubAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bumpSeed",
                        "docs": [
                            "the bump seed"
                        ],
                        "type": {
                            "array": [
                                "u8",
                                1
                            ]
                        }
                    },
                    {
                        "name": "accountNumberSeed",
                        "docs": [
                            "the account number seed"
                        ],
                        "type": {
                            "array": [
                                "u8",
                                1
                            ]
                        }
                    },
                    {
                        "name": "marginingType",
                        "docs": [
                            "the margining type of this account"
                        ],
                        "type": {
                            "defined": "SubAccountMargining"
                        }
                    },
                    {
                        "name": "padding",
                        "type": {
                            "array": [
                                "u8",
                                13
                            ]
                        }
                    },
                    {
                        "name": "accountAlias",
                        "docs": [
                            "the alias of the account"
                        ],
                        "type": {
                            "array": [
                                "u8",
                                32
                            ]
                        }
                    },
                    {
                        "name": "clearing",
                        "docs": [
                            "the associated clearing"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "masterAccount",
                        "docs": [
                            "the master account"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "authority",
                        "docs": [
                            "the authority"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "delegate",
                        "docs": [
                            "the delegate"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "updatedAt",
                        "docs": [
                            "the slot of the last update of this account"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "padding2",
                        "type": {
                            "array": [
                                "u8",
                                8
                            ]
                        }
                    },
                    {
                        "name": "positions",
                        "docs": [
                            "the positions of this sub account"
                        ],
                        "type": {
                            "array": [
                                {
                                    "defined": "PositionSlot"
                                },
                                24
                            ]
                        }
                    }
                ]
            }
        }
    ],
    "types": [
        {
            "name": "FeeTierArgs",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "balance",
                        "docs": [
                            "the token balance necessary for this tier"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "tier",
                        "docs": [
                            "the tier identifier, should start at 1 up to 10"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "makerBps",
                        "docs": [
                            "the maker fee in bps",
                            "i.e, if this value is not zero, the rebate bps field can't be positive"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "takerBps",
                        "docs": [
                            "the taker fee in bps"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "rebateBps",
                        "docs": [
                            "the maker rebate in bps",
                            "i.e, if this value is positive then the maker bps field should be zero"
                        ],
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "CreateClearingArgs",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "clearingNumber",
                        "docs": [
                            "the clearing number, which is also a seed for the clearing to be a signer"
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "bump",
                        "docs": [
                            "the bump of the clearing's program derived address"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "maintMargin",
                        "docs": [
                            "the maintenance margin"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "initMargin",
                        "docs": [
                            "the initialization margin"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "targetMargin",
                        "docs": [
                            "the target margin used by liquidators"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "liqLiqorFee",
                        "docs": [
                            "the liquidation fee bonus for the liquidator"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "liqInsuranceFee",
                        "docs": [
                            "the liquidation fee for the insurance fund"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "feeMint",
                        "docs": [
                            "the fee mint"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "quoteMint",
                        "docs": [
                            "the quote mint for the clearing"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "clearingType",
                        "docs": [
                            "the clearing type"
                        ],
                        "type": {
                            "defined": "ClearingType"
                        }
                    },
                    {
                        "name": "feeTiers",
                        "docs": [
                            "fee tier config"
                        ],
                        "type": {
                            "vec": {
                                "defined": "FeeTierArgs"
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "CreateMarketArgs",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "marketType",
                        "docs": [
                            "the type of the market"
                        ],
                        "type": {
                            "defined": "MarketType"
                        }
                    },
                    {
                        "name": "deliveryType",
                        "docs": [
                            "the type of settlement"
                        ],
                        "type": {
                            "defined": "SettlementType"
                        }
                    },
                    {
                        "name": "expiresAt",
                        "docs": [
                            "the timestamp at which the market expires"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "activatesAt",
                        "docs": [
                            "the timestamp at which the market activates"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "tokenSupply",
                        "docs": [
                            "the token supply of the derivative asset"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "tokenDecimals",
                        "docs": [
                            "the decimals of the derivative asset"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "marketBump",
                        "docs": [
                            "the market's bump"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "twapLongerTimeHorizon",
                        "docs": [
                            "the twap's longer time horizon"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "twapShorterTimeHorizon",
                        "docs": [
                            "the twap's shorter time horizon"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "twapPriceCollectionTick",
                        "docs": [
                            "the twap price collection tick"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "minBaseOrderSize",
                        "docs": [
                            "the minimum order size in the base token"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "tickSize",
                        "docs": [
                            "the tick size of the market"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "baseMultiplier",
                        "docs": [
                            "the base multiplier for the market"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "quoteMultiplier",
                        "docs": [
                            "the quote multiplier for the market"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "marketName",
                        "docs": [
                            "the market's ticker/name, i.e \"SOL-09/30/22\" for a sept expiry dated future"
                        ],
                        "type": {
                            "array": [
                                "u8",
                                32
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "CreatePoolArgs",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "poolBump",
                        "docs": [
                            "the bump of the pool account"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "optimalApr",
                        "docs": [
                            "the optimal apr ratio for the pool"
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "optimalUtil",
                        "docs": [
                            "the optimal utilization for the pool"
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "maxApr",
                        "docs": [
                            "the max apr for the pool"
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "decimals",
                        "docs": [
                            "the token decimals"
                        ],
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "NewSpotOrderArgs",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "side",
                        "docs": [
                            "the side of the order"
                        ],
                        "type": {
                            "defined": "Side"
                        }
                    },
                    {
                        "name": "limitPrice",
                        "docs": [
                            "the limit price for the order"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "maxCoinQty",
                        "docs": [
                            "the base quantity to buy or sell"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "maxNativePcQtyIncludingFees",
                        "docs": [
                            "the max quote quanity to receive or pay"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "orderType",
                        "docs": [
                            "the order type"
                        ],
                        "type": {
                            "defined": "OrderType"
                        }
                    },
                    {
                        "name": "selfTradeBehavior",
                        "docs": [
                            "the self trade behavior"
                        ],
                        "type": {
                            "defined": "SelfTradeBehavior"
                        }
                    },
                    {
                        "name": "clientOrderId",
                        "docs": [
                            "the client order id"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "limit",
                        "docs": [
                            "the maximum number of orders to be matched against"
                        ],
                        "type": "u16"
                    }
                ]
            }
        },
        {
            "name": "NewFuturesOrderArgs",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "side",
                        "docs": [
                            "the side of the order"
                        ],
                        "type": {
                            "defined": "Side"
                        }
                    },
                    {
                        "name": "limitPrice",
                        "docs": [
                            "the limit price for the order (as FP32)"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "maxBaseQty",
                        "docs": [
                            "the base quantity to buy or sell"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "maxQuoteQty",
                        "docs": [
                            "the max quote quanity to receive or pay"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "orderType",
                        "docs": [
                            "the order type"
                        ],
                        "type": {
                            "defined": "FuturesOrderType"
                        }
                    },
                    {
                        "name": "selfTradeBehavior",
                        "docs": [
                            "the self trade behavior"
                        ],
                        "type": {
                            "defined": "SelfTradeBehavior"
                        }
                    },
                    {
                        "name": "clientOrderId",
                        "docs": [
                            "the client order id"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "limit",
                        "docs": [
                            "the maximum number of orders to be matched against"
                        ],
                        "type": "u16"
                    }
                ]
            }
        },
        {
            "name": "CancelOrderArgs",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "orderId",
                        "docs": [
                            "the order id"
                        ],
                        "type": "u128"
                    },
                    {
                        "name": "side",
                        "docs": [
                            "the side of the order"
                        ],
                        "type": {
                            "defined": "Side"
                        }
                    },
                    {
                        "name": "isClientId",
                        "docs": [
                            "whether the given order id is a a client id"
                        ],
                        "type": "bool"
                    }
                ]
            }
        },
        {
            "name": "FeeTier",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "balance",
                        "docs": [
                            "the balance necessary"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "makerBps",
                        "docs": [
                            "the maker fee in bps",
                            "i.e, this value should be zero whenever the maker rebate is supposed to be positive"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "takerBps",
                        "docs": [
                            "the taker fee in bps"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "rebateBps",
                        "docs": [
                            "the maker rebate in bps",
                            "i.e this value should only be positive whenever the maker rate itself is zero"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "tier",
                        "docs": [
                            "the tier identifier, should start at 1"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "padding1",
                        "type": {
                            "array": [
                                "u8",
                                4
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "ClearingConfig",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "maintMargin",
                        "docs": [
                            "the maintenance margin"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "initMargin",
                        "docs": [
                            "the initialization margin"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "targetMargin",
                        "docs": [
                            "the target margin used by liquidators"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "liqLiqorFee",
                        "docs": [
                            "the liquidation fee bonus for the liquidator"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "liqInsuranceFee",
                        "docs": [
                            "the liquidation fee for the insurance fund"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "padding1",
                        "type": {
                            "array": [
                                "u8",
                                3
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "MarketConfig",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "signerSeeds",
                        "docs": [
                            "the signer seeds for this account"
                        ],
                        "type": {
                            "array": [
                                "u8",
                                1
                            ]
                        }
                    },
                    {
                        "name": "marketType",
                        "docs": [
                            "the type of this market"
                        ],
                        "type": {
                            "defined": "MarketType"
                        }
                    },
                    {
                        "name": "settlementType",
                        "docs": [
                            "the type of delivery for this market in case it is a futures market"
                        ],
                        "type": {
                            "defined": "SettlementType"
                        }
                    },
                    {
                        "name": "isActive",
                        "docs": [
                            "whether the market is active",
                            "i.e, in the case of a market being for physical delivery of the underlying asset",
                            "the market cannot become active until the vault of the underlying asset being delivered has",
                            "a balance equivalent to the token supply of the derivative asset"
                        ],
                        "type": "bool"
                    },
                    {
                        "name": "decimals",
                        "docs": [
                            "the decimals of the derivative asset mint"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "padding",
                        "type": {
                            "array": [
                                "u8",
                                11
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "FuturesOpenOrder",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "side",
                        "docs": [
                            "the side of the order"
                        ],
                        "type": {
                            "defined": "Side"
                        }
                    },
                    {
                        "name": "subAccountIdx",
                        "docs": [
                            "the sub account idx"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "padding",
                        "type": {
                            "array": [
                                "u8",
                                6
                            ]
                        }
                    },
                    {
                        "name": "timestamp",
                        "docs": [
                            "the timestamp that the order was posted"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "clientOrderId",
                        "docs": [
                            "the client's order id"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "orderId",
                        "docs": [
                            "the order id after being posted on the book"
                        ],
                        "type": "u128"
                    }
                ]
            }
        },
        {
            "name": "PoolConfig",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "optimalUtil",
                        "docs": [
                            "optimal utilization ratio for this token (lending pool)."
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "optimalApr",
                        "docs": [
                            "optimal apr for this token (lending pool)."
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "maxApr",
                        "docs": [
                            "maximum apr for this token (lending pool)."
                        ],
                        "type": "u16"
                    },
                    {
                        "name": "padding",
                        "type": {
                            "array": [
                                "u16",
                                1
                            ]
                        }
                    },
                    {
                        "name": "decimals",
                        "docs": [
                            "spl token decimals of the token mint"
                        ],
                        "type": "u8"
                    },
                    {
                        "name": "padding2",
                        "type": {
                            "array": [
                                "u8",
                                7
                            ]
                        }
                    },
                    {
                        "name": "padding3",
                        "type": {
                            "array": [
                                "u64",
                                2
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "PriceHistoryConfig",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "longerTimeHorizon",
                        "type": "u64"
                    },
                    {
                        "name": "shorterTimeHorizon",
                        "type": "u64"
                    },
                    {
                        "name": "priceCollectionTick",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "PriceWithTs",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "price",
                        "type": "u64"
                    },
                    {
                        "name": "timestamp",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "SubAccountCache",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "assetsValue",
                        "docs": [
                            "the value of the assets of this account"
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "liabilitiesValue",
                        "docs": [
                            "the value of the liabilities of this account"
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "cRatio",
                        "docs": [
                            "the margin c-ratio of this sub account"
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "updatedAt",
                        "docs": [
                            "slot of the last cache update"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "margining",
                        "docs": [
                            "the sub account margining"
                        ],
                        "type": {
                            "defined": "SubAccountMargining"
                        }
                    },
                    {
                        "name": "padding",
                        "docs": [
                            "57"
                        ],
                        "type": {
                            "array": [
                                "u8",
                                7
                            ]
                        }
                    },
                    {
                        "name": "subAccount",
                        "docs": [
                            "the sub account"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "padding2",
                        "type": {
                            "array": [
                                "u64",
                                4
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "PositionSlot",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "spot",
                        "docs": [
                            "the spot position"
                        ],
                        "type": {
                            "defined": "Position"
                        }
                    },
                    {
                        "name": "derivative",
                        "docs": [
                            "the derivative position"
                        ],
                        "type": {
                            "defined": "Position"
                        }
                    }
                ]
            }
        },
        {
            "name": "Position",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "tokenMint",
                        "docs": [
                            "the token mint that this position pertains to",
                            "i.e, this will either be a spot mint or a derivative asset mint"
                        ],
                        "type": "publicKey"
                    },
                    {
                        "name": "deposits",
                        "docs": [
                            "the amount of deposits in this position"
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "borrows",
                        "docs": [
                            "the amount of borrows in this position"
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "openOrdersCache",
                        "docs": [
                            "the open orders cache"
                        ],
                        "type": {
                            "defined": "OpenOrdersCache"
                        }
                    },
                    {
                        "name": "oraclePrice",
                        "docs": [
                            "the oracle price the last time the position was updated"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "depositIndex",
                        "docs": [
                            "the deposit index of the spot token"
                        ],
                        "type": "i128"
                    },
                    {
                        "name": "borrowIndex",
                        "docs": [
                            "the borrow index of the spot token"
                        ],
                        "type": "i128"
                    }
                ]
            }
        },
        {
            "name": "OpenOrdersCache",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "coinTotal",
                        "type": "u64"
                    },
                    {
                        "name": "coinFree",
                        "type": "u64"
                    },
                    {
                        "name": "pcTotal",
                        "type": "u64"
                    },
                    {
                        "name": "pcFree",
                        "type": "u64"
                    },
                    {
                        "name": "referrerRebatesAccrued",
                        "type": "u64"
                    },
                    {
                        "name": "padding",
                        "type": {
                            "array": [
                                "u64",
                                1
                            ]
                        }
                    }
                ]
            }
        },
        {
            "name": "OrderType",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Limit"
                    },
                    {
                        "name": "ImmediateOrCancel"
                    },
                    {
                        "name": "PostOnly"
                    }
                ]
            }
        },
        {
            "name": "FuturesOrderType",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Limit"
                    },
                    {
                        "name": "ImmediateOrCancel"
                    },
                    {
                        "name": "FillOrKill"
                    },
                    {
                        "name": "PostOnly"
                    }
                ]
            }
        },
        {
            "name": "Side",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Bid"
                    },
                    {
                        "name": "Ask"
                    }
                ]
            }
        },
        {
            "name": "SelfTradeBehavior",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "DecrementTake"
                    },
                    {
                        "name": "AbortTransaction"
                    },
                    {
                        "name": "CancelProvide"
                    }
                ]
            }
        },
        {
            "name": "AccountAction",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Create"
                    },
                    {
                        "name": "Close"
                    },
                    {
                        "name": "SetDelegate"
                    }
                ]
            }
        },
        {
            "name": "SubAccountAction",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Create"
                    },
                    {
                        "name": "Close"
                    },
                    {
                        "name": "ChangeMarginingType"
                    }
                ]
            }
        },
        {
            "name": "ClearingAction",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Create"
                    },
                    {
                        "name": "Close"
                    },
                    {
                        "name": "SweepFee"
                    }
                ]
            }
        },
        {
            "name": "FuturesOrdersAccountAction",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Create"
                    },
                    {
                        "name": "Close"
                    }
                ]
            }
        },
        {
            "name": "ClearingType",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Public"
                    },
                    {
                        "name": "Private"
                    }
                ]
            }
        },
        {
            "name": "WhitelistStatus",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Pending"
                    },
                    {
                        "name": "Active"
                    },
                    {
                        "name": "Revoked"
                    }
                ]
            }
        },
        {
            "name": "MarketType",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "PreIDO"
                    },
                    {
                        "name": "PairFuture"
                    },
                    {
                        "name": "IndexFuture"
                    }
                ]
            }
        },
        {
            "name": "SettlementType",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "CashSettled"
                    },
                    {
                        "name": "PhysicalDelivery"
                    }
                ]
            }
        },
        {
            "name": "ProductsType",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Pyth"
                    },
                    {
                        "name": "Switchboard"
                    }
                ]
            }
        },
        {
            "name": "SubAccountMargining",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Cross"
                    },
                    {
                        "name": "Isolated"
                    }
                ]
            }
        },
        {
            "name": "AccountType",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Regular"
                    },
                    {
                        "name": "Whitelisted"
                    }
                ]
            }
        }
    ],
    "events": [
        {
            "name": "AccountActionLog",
            "fields": [
                {
                    "name": "account",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "authority",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "delegate",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "action",
                    "type": {
                        "defined": "AccountAction"
                    },
                    "index": false
                }
            ]
        },
        {
            "name": "SubAccountActionLog",
            "fields": [
                {
                    "name": "subAccount",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "authority",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "delegate",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "action",
                    "type": {
                        "defined": "SubAccountAction"
                    },
                    "index": false
                }
            ]
        },
        {
            "name": "ClearingActionLog",
            "fields": [
                {
                    "name": "clearing",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "authority",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "quoteMint",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "feeMint",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "action",
                    "type": {
                        "defined": "ClearingAction"
                    },
                    "index": false
                }
            ]
        },
        {
            "name": "MarketCreationLog",
            "fields": [
                {
                    "name": "market",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "orderbook",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "bids",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "asks",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "tokenMint",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "quoteMint",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "baseVault",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "quoteVault",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "marketType",
                    "type": {
                        "defined": "MarketType"
                    },
                    "index": false
                },
                {
                    "name": "settlementType",
                    "type": {
                        "defined": "SettlementType"
                    },
                    "index": false
                },
                {
                    "name": "tokenDecimals",
                    "type": "u8",
                    "index": false
                },
                {
                    "name": "tokenSupply",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "activatesAt",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "expiresAt",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "minBaseOrderSize",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "tickSize",
                    "type": "u64",
                    "index": false
                }
            ]
        },
        {
            "name": "PoolCreationLog",
            "fields": [
                {
                    "name": "pool",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "tokenMint",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "tokenVault",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "oracleProducts",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "dexMarket",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "optimalUtil",
                    "type": "u16",
                    "index": false
                },
                {
                    "name": "optimalApr",
                    "type": "u16",
                    "index": false
                },
                {
                    "name": "maxApr",
                    "type": "u16",
                    "index": false
                }
            ]
        },
        {
            "name": "WhitelistCreationLog",
            "fields": [
                {
                    "name": "clearing",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "whitelist",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "whitelisted",
                    "type": "publicKey",
                    "index": false
                }
            ]
        },
        {
            "name": "FuturesOrdersAccountActionLog",
            "fields": [
                {
                    "name": "openOrders",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "account",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "authority",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "action",
                    "type": {
                        "defined": "FuturesOrdersAccountAction"
                    },
                    "index": false
                }
            ]
        },
        {
            "name": "SettlePositionLog",
            "fields": [
                {
                    "name": "masterAccount",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "subAccount",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "market",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "tokenMint",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "deposits",
                    "type": "i128",
                    "index": false
                },
                {
                    "name": "borrows",
                    "type": "i128",
                    "index": false
                },
                {
                    "name": "settlementPrice",
                    "type": "i128",
                    "index": false
                }
            ]
        },
        {
            "name": "LiquidateCollateralLog",
            "fields": [
                {
                    "name": "liqeeMasterAccount",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "liqeeSubAccount",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "liqorMasterAccount",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "liqorSubAccount",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "assetMint",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "liabilityMint",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "assetPrice",
                    "type": "i128",
                    "index": false
                },
                {
                    "name": "liabilityPrice",
                    "type": "i128",
                    "index": false
                },
                {
                    "name": "preAssetDeposits",
                    "type": "i128",
                    "index": false
                },
                {
                    "name": "preLiabBorrows",
                    "type": "i128",
                    "index": false
                },
                {
                    "name": "postAssetDeposits",
                    "type": "i128",
                    "index": false
                },
                {
                    "name": "postLiabBorrows",
                    "type": "i128",
                    "index": false
                }
            ]
        },
        {
            "name": "DepositOrWithdrawLog",
            "fields": [
                {
                    "name": "masterAccount",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "subAccount",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "pool",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "tokenMint",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "tokenVault",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "amount",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "isDeposit",
                    "type": "bool",
                    "index": false
                }
            ]
        },
        {
            "name": "OrderFillLog",
            "fields": [
                {
                    "name": "market",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "maker",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "taker",
                    "type": "publicKey",
                    "index": false
                },
                {
                    "name": "coinQty",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "pcQty",
                    "type": "u64",
                    "index": false
                },
                {
                    "name": "isSpot",
                    "type": "bool",
                    "index": false
                }
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "InvalidSigner",
            "msg": "invalid signer provided"
        },
        {
            "code": 6001,
            "name": "InvalidFuturesOrdersAccountAuthority",
            "msg": "the provided futures orders account authority does not match"
        },
        {
            "code": 6002,
            "name": "InvalidArgument",
            "msg": "invalid argument provided"
        },
        {
            "code": 6003,
            "name": "InvalidOracle",
            "msg": "invalid oracle account provided"
        },
        {
            "code": 6004,
            "name": "InvalidOracleProducts",
            "msg": "invalid oracle products account provided"
        },
        {
            "code": 6005,
            "name": "InvalidDepositAmountForDelivery",
            "msg": "given deposit amount does not equal desired derivative token supply"
        },
        {
            "code": 6006,
            "name": "InvalidDexMarketForQuotePool",
            "msg": "the provided dex market is not valid for the quote pool"
        },
        {
            "code": 6007,
            "name": "InvalidBaseMintForDexMarket",
            "msg": "the provided dex market does not have a valid base mint"
        },
        {
            "code": 6008,
            "name": "InvalidQuoteMintForDexMarket",
            "msg": "the provivded dex market does not have a valid quote mint"
        },
        {
            "code": 6009,
            "name": "InvalidEventQueueForMarket",
            "msg": "the provided event queue account does not belong to the given market"
        },
        {
            "code": 6010,
            "name": "InvalidOrderBookForMarket",
            "msg": "the provided order book account does not belong to the given market"
        },
        {
            "code": 6011,
            "name": "InvalidOrderIndex",
            "msg": "the provided order index is not valid"
        },
        {
            "code": 6012,
            "name": "InvalidFeeTier",
            "msg": "the provided fee tier is not valid"
        },
        {
            "code": 6013,
            "name": "InvalidFeeDiscountAccountMint",
            "msg": "the provided discount token account does not have a valid mint"
        },
        {
            "code": 6014,
            "name": "InvalidFeeDiscountAccountOwner",
            "msg": "the provided discount token account does not have a valid owner"
        },
        {
            "code": 6015,
            "name": "OrderNotFound",
            "msg": "the provided order id could not be found"
        },
        {
            "code": 6016,
            "name": "InvalidOrderSide",
            "msg": "the provided order side is invalid"
        },
        {
            "code": 6017,
            "name": "FuturesOrdersAccountFull",
            "msg": "the futures orders account is full"
        },
        {
            "code": 6018,
            "name": "FuturesOrdersAccountMustBeEmpty",
            "msg": "attempted to close a futures orders account with remaining orders"
        },
        {
            "code": 6019,
            "name": "OracleProductsAlreadyInitialized",
            "msg": "the given oracle products account has already been initialized"
        },
        {
            "code": 6020,
            "name": "StaleOracleCache",
            "msg": "the given oracle products account has a stale cache"
        },
        {
            "code": 6021,
            "name": "PrivateClearing",
            "msg": "attempted to create account in a private clearing"
        },
        {
            "code": 6022,
            "name": "PublicClearing",
            "msg": "attempted to create whitelisted account in a public clearing"
        },
        {
            "code": 6023,
            "name": "ActiveMarketCannotSettlePosition",
            "msg": "active market cannot settle position"
        },
        {
            "code": 6024,
            "name": "MarketNotForPhysicalDelivery",
            "msg": "provided market was not created for physical delivery"
        },
        {
            "code": 6025,
            "name": "SubAccountAliasTooLong",
            "msg": "the provided sub account alias is too long"
        },
        {
            "code": 6026,
            "name": "UnableToFindPosition",
            "msg": "unable to find position"
        },
        {
            "code": 6027,
            "name": "UnableToFindOrderByOrderId",
            "msg": "unable to find order with given order id"
        },
        {
            "code": 6028,
            "name": "UnableToFindOrderByClientId",
            "msg": "unable to find order with given client order id"
        },
        {
            "code": 6029,
            "name": "UnableToPostOrder",
            "msg": "unable to post order"
        },
        {
            "code": 6030,
            "name": "SpotOpenOrdersHasUnsettledFunds",
            "msg": "the provided spot open orders account has unsettled funds"
        },
        {
            "code": 6031,
            "name": "RemainingAccountNotWritable",
            "msg": "specified sub account is not writable"
        },
        {
            "code": 6032,
            "name": "RemainingAccountWithInvalidOwner",
            "msg": "specified sub account is not writable"
        },
        {
            "code": 6033,
            "name": "RemainingAccountWithInvalidAuthority",
            "msg": "specified sub account is not owned by the same authority"
        },
        {
            "code": 6034,
            "name": "RemainingAccountWithInvalidMasterAccount",
            "msg": "specified sub account does not belong to the specified master account"
        },
        {
            "code": 6035,
            "name": "RemainingUserAccountMissing",
            "msg": "remaining user account missing"
        },
        {
            "code": 6036,
            "name": "SubAccountCRatioBelowOptimal",
            "msg": "sub account c-ratio is below optimal"
        },
        {
            "code": 6037,
            "name": "MasterAccountCRatioBelowOptimnal",
            "msg": "master account c-ratio is below optimal"
        },
        {
            "code": 6038,
            "name": "TotalBorrowsGreaterThanDeposits",
            "msg": "pool total borrows amount are greater than total deposits"
        },
        {
            "code": 6039,
            "name": "MarketTotalBorrowsGreaterThanTokenSupply",
            "msg": "market total borrows amount are greater than total token supply"
        },
        {
            "code": 6040,
            "name": "OrderAmountExceedsVaultBalance",
            "msg": "attempted to submit an order with greater amount than is available in the vault"
        },
        {
            "code": 6041,
            "name": "TransactionAborted",
            "msg": "the transaction has been aborted due to predetermined functionality"
        },
        {
            "code": 6042,
            "name": "Default",
            "msg": "Default"
        }
    ]
};
