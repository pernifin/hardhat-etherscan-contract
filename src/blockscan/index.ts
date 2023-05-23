import fetch from "node-fetch";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";

import { endpoints, NetworkID } from "./networks";

const pluginName = "hardhat-etherscan-contract";

export interface EtherscanContractRequest {
  apikey: string;
  module: "contract";
  action: "getabi" | "getsourcecode";
  address: string;
}

export type ApiResponse<T> = {
  status: string,
  message: string,
  result: T
};

export default async function callBlockscanApi<R>(chainID: NetworkID, request: EtherscanContractRequest) {
  const { apiURL } = endpoints[chainID] || {};
  if (apiURL === undefined) {
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `An etherscan endpoint could not be found for this network.\nChainID: ${chainID}.`
    );
  }

  const urlWithQuery = new URL(apiURL);
  const parameters = new URLSearchParams({ ...request });
  urlWithQuery.search = parameters.toString();

  let response;
  try {
    response = await fetch(urlWithQuery);
  } catch (error) {
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `Failure sending request to Etherscan.\nEndpoint URL: ${urlWithQuery}\nReason: ${(error as Error).message}`,
      (error as Error)
    );
  }

  if (!response.ok) {
    // This could be always interpreted as JSON if there were any such guarantee in the Etherscan API.
    const responseText = await response.text();
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `The HTTP server response is not ok.\nStatus code: ${response.status}\nResponse text: ${responseText}`
    );
  }

  const apiResponse = await response.json() as ApiResponse<R>;
  if (apiResponse.status === "0") {
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `The Etherscan API responded with a failure status.\nReason: ${apiResponse.result}`
    );
  }

  return apiResponse.result;
}
