'use strict';

const { VoidSigner } = require('@ethersproject/abstract-signer');

const PrivateSigner = exports.PrivateSigner = class PrivateSigner extends VoidSigner {
  constructor({
    signer,
    getMaxBlockNumber,
    getPreferences
  }) {
    super(signer.getAddress(), signer.provider);
    this.signer = signer;
    this.getMaxBlockNumber = getMaxBlockNumber && async function (tx) { return await getMaxBlockNumber(this, tx); } || (async () => '0xffffffffff');
    this.getPreferences = getPreferences && async function (tx) { return await getPreferences(this, tx); } || (async () => ({ fast: true }));
  }
  async sendTransaction(transaction) {
    this._checkProvider('sendTransaction');
    const tx = await this.signer.populateTransaction(transaction);
    const signedTx = await this.signer.signTransaction(tx);
    const formattedTransaction = this.provider.formatter.transaction(signedTx);
    const blockNumber = await this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
    const hash = await this.provider.send('eth_sendPrivateTransaction', [{
      tx: signedTx,
      preferences: await this.getPreferences(tx),
      maxBlockNumber: await this.getMaxBlockNumber(tx)
    }]);
    return this.provider._wrapTransaction(formattedTransaction, hash, blockNumber);
  }
}

exports.makePrivateSigner = ({
  signer,
  getMaxBlockNumber,
  getPreferences
}) => {
  return new PrivateSigner({
    signer,
    getMaxBlockNumber,
    getPreferences
  });
};
  
