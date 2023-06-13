export type LiquidityIncentiveProgram = {
  "version": "0.1.0",
  "name": "liquidity_incentive_program",
  "constants": [
    {
      "name": "CAMPAIGN_SEED",
      "type": "string",
      "value": "\"campaign\""
    },
    {
      "name": "CAMPAIGN_AUTH_SEED",
      "type": "string",
      "value": "\"campaign_auth\""
    },
    {
      "name": "DEPOSIT_AUTH_SIGNER_SEED",
      "type": "string",
      "value": "\"deposit_auth\""
    }
  ],
  "instructions": [
    {
      "name": "createCampaign",
      "accounts": [
        {
          "name": "campaign",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignRewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignRewardVaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolNode",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolNodeVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "campaignAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "minDeposit",
          "type": "u64"
        },
        {
          "name": "lockupPeriod",
          "type": "u64"
        },
        {
          "name": "maxDeposits",
          "type": "u64"
        },
        {
          "name": "maxRewards",
          "type": "u64"
        },
        {
          "name": "depositRewardRatio",
          "type": "u16"
        }
      ]
    },
    {
      "name": "createDeposit",
      "accounts": [
        {
          "name": "campaign",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deposit",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "cacheAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clearing",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cypherAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cypherSubAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tempTokenAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolNodeVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cypherProgram",
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
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountBump",
          "type": "u8"
        },
        {
          "name": "subAccountBump",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "endDeposit",
      "accounts": [
        {
          "name": "campaign",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignRewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignRewardVaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "deposit",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cacheAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clearing",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cypherAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cypherSubAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tempTokenAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "assetTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolNodeVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolNodeVaultSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cypherProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "rewardMintDecimals",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          },
          {
            "name": "depositRewardRatio",
            "type": "u16"
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "assetMint",
            "type": "publicKey"
          },
          {
            "name": "rewardMint",
            "type": "publicKey"
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "poolNode",
            "type": "publicKey"
          },
          {
            "name": "poolNodeVault",
            "type": "publicKey"
          },
          {
            "name": "lockupPeriod",
            "type": "u64"
          },
          {
            "name": "minDeposit",
            "type": "u64"
          },
          {
            "name": "maxDeposits",
            "type": "u64"
          },
          {
            "name": "remainingCapacity",
            "type": "u64"
          },
          {
            "name": "maxRewards",
            "type": "u64"
          },
          {
            "name": "remainingRewards",
            "type": "u64"
          },
          {
            "name": "rewardsMaturing",
            "type": "u64"
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u64",
                15
              ]
            }
          }
        ]
      }
    },
    {
      "name": "deposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "campaign",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "expectedReward",
            "type": "u64"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CampaignCreated",
      "fields": [
        {
          "name": "campaign",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "assetMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "lockupPeriod",
          "type": "u64",
          "index": false
        },
        {
          "name": "minDeposit",
          "type": "u64",
          "index": false
        },
        {
          "name": "maxDeposits",
          "type": "u64",
          "index": false
        },
        {
          "name": "maxRewards",
          "type": "u64",
          "index": false
        },
        {
          "name": "depositRewardRatio",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "DepositCreated",
      "fields": [
        {
          "name": "deposit",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "expectedReward",
          "type": "u64",
          "index": false
        },
        {
          "name": "startTime",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "DepositEnded",
      "fields": [
        {
          "name": "deposit",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "interestEarned",
          "type": "u64",
          "index": false
        },
        {
          "name": "reward",
          "type": "u64",
          "index": false
        },
        {
          "name": "endTime",
          "type": "i64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidMinDeposit",
      "msg": "The given min deposit value is invalid."
    },
    {
      "code": 6001,
      "name": "InvalidMaxDeposits",
      "msg": "The given max deposit value is invalid."
    },
    {
      "code": 6002,
      "name": "InvalidMaxRewards",
      "msg": "The given max rewards value is invalid."
    },
    {
      "code": 6003,
      "name": "InvalidLockupPeriod",
      "msg": "The given lockup period value is invalid."
    },
    {
      "code": 6004,
      "name": "InactiveCampaign",
      "msg": "This Campaign is inactive."
    },
    {
      "code": 6005,
      "name": "InvalidDepositAmount",
      "msg": "The given deposit amount is invalid."
    },
    {
      "code": 6006,
      "name": "DepositAmountTooLarge",
      "msg": "Deposit amount is to large"
    },
    {
      "code": 6007,
      "name": "DepositNotMature",
      "msg": "Deposit hasn't matured yet"
    }
  ]
};

export const IDL: LiquidityIncentiveProgram = {
  "version": "0.1.0",
  "name": "liquidity_incentive_program",
  "constants": [
    {
      "name": "CAMPAIGN_SEED",
      "type": "string",
      "value": "\"campaign\""
    },
    {
      "name": "CAMPAIGN_AUTH_SEED",
      "type": "string",
      "value": "\"campaign_auth\""
    },
    {
      "name": "DEPOSIT_AUTH_SIGNER_SEED",
      "type": "string",
      "value": "\"deposit_auth\""
    }
  ],
  "instructions": [
    {
      "name": "createCampaign",
      "accounts": [
        {
          "name": "campaign",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignRewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignRewardVaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolNode",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolNodeVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "campaignAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "minDeposit",
          "type": "u64"
        },
        {
          "name": "lockupPeriod",
          "type": "u64"
        },
        {
          "name": "maxDeposits",
          "type": "u64"
        },
        {
          "name": "maxRewards",
          "type": "u64"
        },
        {
          "name": "depositRewardRatio",
          "type": "u16"
        }
      ]
    },
    {
      "name": "createDeposit",
      "accounts": [
        {
          "name": "campaign",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "deposit",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "cacheAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clearing",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cypherAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cypherSubAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tempTokenAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolNodeVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cypherProgram",
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
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountBump",
          "type": "u8"
        },
        {
          "name": "subAccountBump",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "endDeposit",
      "accounts": [
        {
          "name": "campaign",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignRewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignRewardVaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "deposit",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cacheAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clearing",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cypherAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "cypherSubAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tempTokenAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "assetTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolNodeVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolNodeVaultSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cypherProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "rewardMintDecimals",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          },
          {
            "name": "depositRewardRatio",
            "type": "u16"
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "assetMint",
            "type": "publicKey"
          },
          {
            "name": "rewardMint",
            "type": "publicKey"
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "poolNode",
            "type": "publicKey"
          },
          {
            "name": "poolNodeVault",
            "type": "publicKey"
          },
          {
            "name": "lockupPeriod",
            "type": "u64"
          },
          {
            "name": "minDeposit",
            "type": "u64"
          },
          {
            "name": "maxDeposits",
            "type": "u64"
          },
          {
            "name": "remainingCapacity",
            "type": "u64"
          },
          {
            "name": "maxRewards",
            "type": "u64"
          },
          {
            "name": "remainingRewards",
            "type": "u64"
          },
          {
            "name": "rewardsMaturing",
            "type": "u64"
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u64",
                15
              ]
            }
          }
        ]
      }
    },
    {
      "name": "deposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "campaign",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "expectedReward",
            "type": "u64"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CampaignCreated",
      "fields": [
        {
          "name": "campaign",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "assetMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "lockupPeriod",
          "type": "u64",
          "index": false
        },
        {
          "name": "minDeposit",
          "type": "u64",
          "index": false
        },
        {
          "name": "maxDeposits",
          "type": "u64",
          "index": false
        },
        {
          "name": "maxRewards",
          "type": "u64",
          "index": false
        },
        {
          "name": "depositRewardRatio",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "DepositCreated",
      "fields": [
        {
          "name": "deposit",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "expectedReward",
          "type": "u64",
          "index": false
        },
        {
          "name": "startTime",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "DepositEnded",
      "fields": [
        {
          "name": "deposit",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "interestEarned",
          "type": "u64",
          "index": false
        },
        {
          "name": "reward",
          "type": "u64",
          "index": false
        },
        {
          "name": "endTime",
          "type": "i64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidMinDeposit",
      "msg": "The given min deposit value is invalid."
    },
    {
      "code": 6001,
      "name": "InvalidMaxDeposits",
      "msg": "The given max deposit value is invalid."
    },
    {
      "code": 6002,
      "name": "InvalidMaxRewards",
      "msg": "The given max rewards value is invalid."
    },
    {
      "code": 6003,
      "name": "InvalidLockupPeriod",
      "msg": "The given lockup period value is invalid."
    },
    {
      "code": 6004,
      "name": "InactiveCampaign",
      "msg": "This Campaign is inactive."
    },
    {
      "code": 6005,
      "name": "InvalidDepositAmount",
      "msg": "The given deposit amount is invalid."
    },
    {
      "code": 6006,
      "name": "DepositAmountTooLarge",
      "msg": "Deposit amount is to large"
    },
    {
      "code": 6007,
      "name": "DepositNotMature",
      "msg": "Deposit hasn't matured yet"
    }
  ]
};
