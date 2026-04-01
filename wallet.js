const { ethers } = require('ethers');
const config = require('./config');
require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;
const walletAddress = process.env.WALLET_ADDRESS;

if (!privateKey || !walletAddress) {
  console.warn('WARNING: PRIVATE_KEY or WALLET_ADDRESS missing in .env');
}

const provider = new ethers.JsonRpcProvider(config.RPC_URL);
const wallet = privateKey ? new ethers.Wallet(privateKey, provider) : null;

/**
 * Generates Floe Credit API authentication headers.
 * Signs: "Floe Credit API\nTimestamp: <unix_seconds>"
 */
async function getAuthHeaders() {
  if (!wallet) throw new Error('Wallet not initialized. Check PRIVATE_KEY in .env');

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const message = `Floe Credit API\nTimestamp: ${timestamp}`;
  
  // signMessage uses EIP-191 by default in ethers
  const signature = await wallet.signMessage(message);

  return {
    'X-Wallet-Address': walletAddress,
    'X-Signature': signature,
    'X-Timestamp': timestamp,
    'Content-Type': 'application/json'
  };
}

/**
 * Executes a sequence of transactions on the blockchain.
 * @param {Array} transactions - Array of {to, data, value, description}
 */
async function executeTransactions(transactions) {
  if (!wallet) throw new Error('Wallet not initialized.');

  console.log(`Starting execution of ${transactions.length} transactions...`);

  for (const txData of transactions) {
    console.log(`Executing: ${txData.description || 'Blockchain Transaction'}`);
    
    const txResponse = await wallet.sendTransaction({
      to: txData.to,
      data: txData.data,
      value: txData.value || '0x0',
      chainId: config.CHAIN_ID
    });

    console.log(`Transaction sent: ${txResponse.hash}. Waiting for confirmation...`);
    
    const receipt = await txResponse.wait();
    
    if (receipt.status === 0) {
      throw new Error(`Transaction failed: ${txData.description}`);
    }
    
    console.log(`Confirmed in block ${receipt.blockNumber}`);
  }

  console.log('All transactions executed successfully.');
}

module.exports = {
  getAuthHeaders,
  executeTransactions,
  wallet,
  provider
};
