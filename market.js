const axios = require('axios');
const config = require('./config');

/**
 * Fetches available lender offers from Floe Credit API.
 * @param {string} marketId - Required Market ID (bytes32).
 * @param {number} maxResults - Max results to return.
 * @returns {Promise<Array>} List of filtered offers.
 */
async function getAvailableOffers(marketId, maxResults = 10) {
  if (!marketId) {
    throw new Error('MARKET_ID is required for discovering lender offers.');
  }

  console.log('-----------------------------------------');
  console.log(`Step 1: Discovering offers for market: ${marketId}...`);
  
  try {
    const params = { marketId, maxResults };

    const response = await axios.get(`${config.FLOE_API_URL}/v1/credit/offers`, { params });
    
    const offers = response.data.offers || [];
    
    if (offers.length === 0) {
      console.log('No active offers found for this market.');
      return [];
    }

    console.log(`Found ${offers.length} available offers.`);
    
    // Sort by best rate (lowest minInterestRateBps)
    const sortedOffers = offers.sort((a, b) => 
      parseInt(a.minInterestRateBps) - parseInt(b.minInterestRateBps)
    );

    sortedOffers.forEach((offer, i) => {
      console.log(`[${i}] Rate: ${offer.minInterestRateBps} bps | Liquidity: ${offer.remainingAmount} units`);
    });

    return sortedOffers;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.error('API Error (400): Invalid or missing marketId provided to Floe API.');
    }
    console.error('Error fetching offers:', error.message);
    throw new Error('Failed to discover market liquidity.');
  }
}

module.exports = { getAvailableOffers };
