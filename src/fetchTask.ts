import { task, types } from "hardhat/config";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

task('fetchSource', 'Fetches smart contract code by address using Etherscan API')
  .addParam('address', 'Contract address', undefined, types.string)
  .addOptionalParam('path', 'Path to store source code', undefined, types.string)
  .addFlag('all', 'Save all dependencies with main contract')
  .setAction(async (params: { address: string, path?: string, all?: boolean}, { getContractCodeAt, config }) => {
    const [code, ...more] = await getContractCodeAt(params.address);
    const contractName = `${code.ContractName}.sol`;
    const contractDir = params.path || config.paths.sources;

    mkdirSync(contractDir, { recursive: true });
    if (params.all) {
      Object.entries(code.SourceCode.sources).forEach(([fileName, { content }]) => {
        const filepath = fileName.replace(/^contracts\//, '');

        mkdirSync(`${contractDir}/${dirname(filepath)}`, { recursive: true });
        writeFileSync(`${contractDir}/${filepath}`, content);
      });
    } else if (code.SourceCode.sources[`contracts/${contractName}`]) {
      writeFileSync(
        `${contractDir}/${contractName}`,
        code.SourceCode.sources[`contracts/${contractName}`].content
      );
    } else {
      throw new Error(`Contract ${code.ContractName} not found`);
    }

    if (more.length > 0) {
      console.warn('getContractCodeAt returned more than one result.');
    }
  });