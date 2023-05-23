// See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md#list-of-chain-ids
export enum NetworkID {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  // Binance Smart Chain
  BSC = 56,
  BSC_TESTNET = 97,
  // Polygon
  POLYGON = 137,
  MUMBAI = 80001,
  // Arbitrum
  ARBITRUM = 42161,
  // Fantom Opera
  FANTOM = 250,
  // Snowtrace
  AVALANCHE = 43114,
  FUJI = 43113
}

export type EtherscanURLs = {
  apiURL: string;
  browserURL: string;
};

export type NetworkMap = Record<NetworkID, EtherscanURLs>;

export const endpoints: NetworkMap = {
  [NetworkID.MAINNET]: {
    apiURL: "https://api.etherscan.io/api",
    browserURL: "https://etherscan.io/",
  },
  [NetworkID.ROPSTEN]: {
    apiURL: "https://api-ropsten.etherscan.io/api",
    browserURL: "https://ropsten.etherscan.io",
  },
  [NetworkID.RINKEBY]: {
    apiURL: "https://api-rinkeby.etherscan.io/api",
    browserURL: "https://rinkeby.etherscan.io",
  },
  [NetworkID.GOERLI]: {
    apiURL: "https://api-goerli.etherscan.io/api",
    browserURL: "https://goerli.etherscan.io",
  },
  [NetworkID.KOVAN]: {
    apiURL: "https://api-kovan.etherscan.io/api",
    browserURL: "https://kovan.etherscan.io",
  },
  [NetworkID.BSC]: {
    apiURL: "https://api.bscscan.com/api",
    browserURL: "https://bscscan.com",
  },
  [NetworkID.BSC_TESTNET]: {
    apiURL: "https://api-testnet.bscscan.com/api",
    browserURL: "https://testnet.bscscan.com",
  },
  [NetworkID.POLYGON]: {
    apiURL: "https://api.polygonscan.com/api",
    browserURL: "https://polygonscan.com"
  },
  [NetworkID.MUMBAI]: {
    apiURL: "https://api-testnet.polygonscan.com/api",
    browserURL: "https://mumbai.polygonscan.com"
  },
  [NetworkID.ARBITRUM]: {
    apiURL: "https://api.arbiscan.io/api",
    browserURL: "https://arbiscan.io",
  },
  [NetworkID.FANTOM]: {
    apiURL: "https://api.ftmscan.com/api",
    browserURL: "https://ftmscan.com/",
  },
  [NetworkID.AVALANCHE]: {
    apiURL: "https://api.snowtrace.io/api",
    browserURL: "https://snowtrace.io/",
  },
  [NetworkID.FUJI]: {
    apiURL: "https://api-testnet.snowtrace.io/api",
    browserURL: "https://testnet.snowtrace.io/",
  }
};