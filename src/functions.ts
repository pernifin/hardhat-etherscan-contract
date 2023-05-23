import callBlockscanApi from "./blockscan";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";
import { ethers } from "ethers";

const pluginName = "hardhat-etherscan-abi";

type GetSourceCodeBaseReponse = {
  ContractName: string,
  CompilerVersion: string,
  OptimizationUsed: string,
  Runs: string,
  ConstructorArguments: string,
  EVMVersion: string,
  Library: string,
  LicenseType: string,
  Proxy: string,
  Implementation: string,
  SwarmSource: string
};

type GetSourceCodeAPIReponse = GetSourceCodeBaseReponse & {
  SourceCode: string,
  ABI: string
}

export type GetSourceCodeReponse = GetSourceCodeBaseReponse & {
  SourceCode: {
    language: string,
    sources: Record<string, { content: string }>,
    settings: Record<string, object>
  },
  ABI: object[]
};

function getApiKey({ config: { etherscan }, network }: HardhatRuntimeEnvironment) {
  if (typeof etherscan.apiKey === "string") {
    return etherscan.apiKey;
  } else if (typeof etherscan.apiKey === "object" && etherscan.apiKey[network.name]) {
    return etherscan.apiKey[network.name];
  }

  throw new NomicLabsHardhatPluginError(pluginName, "Etherscan api key is not provided.");
}

export async function getVerifiedContractAt(
  hre: HardhatRuntimeEnvironment,
  address: string,
  signer?: ethers.Signer
): Promise<ethers.Contract> {
  if (!hre.ethers.utils.isAddress(address)) {
    throw new NomicLabsHardhatPluginError(pluginName, `${address} is an invalid address.`);
  }

  const { chainId } = await hre.ethers.provider.getNetwork();
  const abi = await callBlockscanApi<string>(chainId, {
    apikey: getApiKey(hre),
    module: "contract",
    action: "getabi",
    address,
  });

  try {
    return hre.ethers.getContractAt(JSON.parse(abi), address, signer);
  } catch (error) {
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `Failure parsing ABI JSON from Etherscan.\nReason: ${(error as Error).message}`,
      (error as Error)
    );
  }
}

export async function getContractCodeAt(
  hre: HardhatRuntimeEnvironment,
  address: string,
  chainId?: number
) {
  if (!hre.ethers.utils.isAddress(address)) {
    throw new NomicLabsHardhatPluginError(pluginName, `${address} is an invalid address.`);
  }

  if (!chainId) {
    ({ chainId } = await hre.ethers.provider.getNetwork());
  }

  const sourceCode = await callBlockscanApi<GetSourceCodeAPIReponse[]>(chainId, {
    apikey: getApiKey(hre),
    module: "contract",
    action: "getsourcecode",
    address,
  });
  
  return sourceCode.map<GetSourceCodeReponse>((contract) => ({
    ...contract,
    SourceCode: JSON.parse(contract.SourceCode.substring(1, contract.SourceCode.length - 1)),
    ABI: JSON.parse(contract.ABI)
  }));
}