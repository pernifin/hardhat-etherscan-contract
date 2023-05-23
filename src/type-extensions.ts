import { ethers } from "ethers";
import "hardhat/types/config";
import "hardhat/types/runtime";

import type { GetSourceCodeReponse } from './functions';

export interface EtherscanConfig { 
  apiKey: string | Record<string, string>;
};

declare module "hardhat/types/config" {
  interface HardhatUserConfig {
    etherscan?: EtherscanConfig;
  }

  interface HardhatConfig {
    etherscan: EtherscanConfig;
  }
}

declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    getVerifiedContractAt: (address: string, signer?: ethers.Signer) => Promise<ethers.Contract>;
    getContractCodeAt: (address: string, chainId?: number) => Promise<GetSourceCodeReponse[]>;
  }
}
