const axios = require('axios');
const { getAuthHeaders, executeTransactions } = require('./wallet');
const { getAvailableOffers } = require('./market');
const config = require('./config');

/**
 * Executes a borrow flow using the Floe Credit API.
 * Handles both dynamic discovery (for hex IDs) and direct borrowing (for numeric IDs).
 */
async function borrow(params = {}) {
  console.log('-----------------------------------------');
  console.log('Step 2: Initiating Authenticated Borrow Flow...');
  
  // 1. Determine Market ID and Format
  let marketId = params.marketId || process.env.MARKET_ID || "1";
  
  // Check if it's a numeric pilot ID or a full bytes32 hex
  const isHexId = typeof marketId === 'string' && marketId.startsWith('0x') && marketId.length > 10;
  
  let borrowAmount = params.borrowAmount || config.DEFAULT_BORROW_AMOUNT;
  let retryCount = 0;
  let lastError = null;

  while (retryCount <= config.MAX_RETRIES) {
    try {
      let selectedMaxRate = params.maxInterestRateBps || config.DEFAULT_MAX_INTEREST_RATE_BPS;

      // 2. Market Discovery (Only if it's a hex ID)
      if (isHexId) {
        const offers = await getAvailableOffers(marketId);
        if (offers.length > 0) {
          const bestOffer = offers[0];
          console.log(`Selected best offer: ${bestOffer.offerHash} | Rate: ${bestOffer.minInterestRateBps} bps`);
          selectedMaxRate = bestOffer.minInterestRateBps;
        } else {
          console.warn('No specific offers found via discovery. Attempting direct borrow with default params...');
        }
      } else {
        console.log(`Numeric Market ID detected (${marketId}). Bypassing discovery and proceeding directly to borrow...`);
      }

      console.log(`Borrowing ${borrowAmount} units for market ${marketId}...`);

      const headers = await getAuthHeaders();
      
      const borrowData = {
        marketId: marketId,
        borrowAmount: borrowAmount.toString(),
        collateralAmount: params.collateralAmount || config.DEFAULT_COLLATERAL_AMOUNT,
        maxInterestRateBps: selectedMaxRate.toString(),
        duration: params.duration || config.DEFAULT_DURATION
      };

      // 3. Call Instant Borrow
      const response = await axios.post(
        `${config.FLOE_API_URL}/v1/credit/instant-borrow`,
        borrowData,
        { headers }
      );

      const { transactions, selectedOffer } = response.data;
      
      console.log(`API returned ${transactions.length} transactions. Executing...`);
      await executeTransactions(transactions);
      
      console.log('Borrow flow completed successfully.');
      return selectedOffer;

    } catch (error) {
      lastError = error;
      const isLiquidityError = error.response && error.response.data && error.response.data.error === 'NoLiquidityError';
      
      if (isLiquidityError && retryCount < config.MAX_RETRIES) {
        retryCount++;
        borrowAmount = (BigInt(borrowAmount) / 2n).toString();
        console.warn(`[Liquidity Warning] Retrying with ${borrowAmount} units... (Attempt ${retryCount}/${config.MAX_RETRIES})`);
        continue;
      }
      
      const apiError = error.response ? JSON.stringify(error.response.data) : error.message;
      console.error('Borrowing process failed:', apiError);
      throw new Error(`Borrowing failed: ${apiError}`);
    }
  }

  throw lastError;
}

module.exports = borrow;
