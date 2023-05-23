import { extendEnvironment, extendConfig } from "hardhat/config";

import { getVerifiedContractAt, getContractCodeAt } from "./functions";
import "./type-extensions";
import "./fetchTask";

extendConfig((config, userConfig) => {
  config.etherscan = userConfig.etherscan || { apiKey: "" };
});

extendEnvironment((hre) => {
  hre.getVerifiedContractAt = getVerifiedContractAt.bind(null, hre);
  hre.getContractCodeAt = getContractCodeAt.bind(null, hre);
});

