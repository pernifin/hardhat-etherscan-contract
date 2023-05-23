# hardhat-etherscan-contract [![hardhat](https://hardhat.org/buidler-plugin-badge.svg?1)](https://hardhat.org)

[Hardhat](https://hardhat.org) plugin that fetches verified contract ABI and source code from [Etherscan](https://etherscan.io).

## What

This plugin adds extra features on top of `@nomiclabs/hardhat-ethers` and allows creating contract instances without
manually downloading ABI: `getVerifiedContractAt('<address>')`. It supports Mainnet, BSC, and most testnets.
It can also retrieve full source code of verified contracts using `getContractCodeAt(<address>)`.

## Installation

```bash
// Not yet published to npm
// npm install --save-dev hardhat-etherscan-contract
```

And add the following statement to your `hardhat.config.js`:

```js
require("hardhat-etherscan-contract");
```

Or, if you are using TypeScript, add this to your `hardhat.config.ts`:

```js
import "hardhat-etherscan-contract";
```

## Tasks

This plugin adds fetchSource task that retrieves source code of a verified contract located on `--address`.
Sources are stored to default contracts location, unless explicit `--path` is specified.
Using `--all` flag allows to save all dependencies tree of the requested contract.

## Environment extensions

This object has adds some extra `hardhat-etherscan-contract` specific functionalities by adding new extra fields to `hre`

### Helpers

These helpers are added to the `hre` object:

```typescript
export async function getVerifiedContractAt(
  hre: HardhatRuntimeEnvironment,
  address: string,
  signer?: ethers.Signer
): Promise<ethers.Contract>;

export async function getContractCodeAt(
  hre: HardhatRuntimeEnvironment,
  address: string,
  chainId?: number
): Promise<GetSourceCodeReponse[]>;
```

## Usage

You need to add the following Etherscan config to your `hardhat.config.js` file. Etherscan API key is optional but without it Etherscan allows only 1 request per 5 seconds.

```js
module.exports = {
  networks: {
    mainnet: { ... }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "YOUR_ETHERSCAN_API_KEY"

    // Keys can be set separately for each network, the currently loaded network by hardhat will be used
    // apiKey: {
    //   mainnet: "",
    //   polygon: ""
    // }
  }
};
```

Then use the function:

```js
const contract = await hre.getVerifiedContractAt('<address>');
```

It requires only contract address and will fetch the ABI for the contract automatically from Etherscan
