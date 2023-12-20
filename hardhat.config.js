require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require('dotenv').config();
require('hardhat-deploy');

module.exports = {
  solidity: {
    version: "0.8.7",
    ...(process.env.DEPLOY === "true" &&
    {
      settings: {
        optimizer: {
          enabled: true,
          runs: 999999,
        },
      },
    }
    )
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    hardhat: {
    },
    snowtrace: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [process.env.PRIVATEKEY]
    },
  },
  etherscan: {
    apiKey: {
      snowtrace: "snowtrace", // apiKey is not required, just set a placeholder
    },
    customChains: [
      {
        network: "snowtrace",
        chainId: 43113,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan",
          browserURL: "https://avalanche.testnet.routescan.io"
        }
      }
    ]
  },
};
