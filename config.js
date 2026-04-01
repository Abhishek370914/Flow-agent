require('dotenv').config();

module.exports = {
  // Floe Credit API
  FLOE_API_URL: 'https://credit-api.floelabs.xyz',
  
  // Base Network
  RPC_URL: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
  CHAIN_ID: 8453,

  // Agent Settings
  DEFAULT_BORROW_AMOUNT: process.env.BORROW_AMOUNT || '1000000000', // 1,000 USDC
  DEFAULT_COLLATERAL_AMOUNT: process.env.COLLATERAL_AMOUNT || '1000000000000000000', // 1 WETH
  DEFAULT_MAX_INTEREST_RATE_BPS: process.env.MAX_INTEREST_RATE_BPS || '1500',
  DEFAULT_DURATION: process.env.DURATION || '2592000', // 30 days
  MAX_RETRIES: 2,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 5000,
  TRANSACTION_TIMEOUT_MS: 60000
};
