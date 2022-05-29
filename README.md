# ethers-flashbots

Create a wrapped Signer object that will send transactions via eth_sendPrivateTransaction, as supported by the Alchemy free tier API or flashbots relay RPC itself.

## Usage

```js

const { makePrivateSigner } = require('ethers-flashbots');


(async () => {
  const [ signer ] = ethers.getSigners();
  const contract = new Contract(address, ['function stateChangingFunction()'], makePrivateSigner({
    signer,
    getMaxBlockNumber: async (signer, tx) => {
      return ethers.utils.hexlify(Number(await signer.provider.getBlockNumber()) + 100);
    },
    getPreferences: async () => ({ fast: true }) // default behavior
  }));
  const tx = await contract.stateChangingFunction();
  console.log(await tx.wait());
})().catch(console.error);
```

## Author

Freelog Studio LLC
