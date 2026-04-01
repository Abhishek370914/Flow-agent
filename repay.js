const axios = require('axios');
const { getAuthHeaders, executeTransactions } = require('./wallet');
const config = require('./config');

/**
 * Executes a repayment flow using the Floe Credit API.
 * @param {string} loanId - The ID of the loan to repay.
 * @returns {Promise<void>}
 */
async function repay(loanId) {
  console.log('-----------------------------------------');
  console.log(`Step 4: Initiating Repayment for loan ${loanId}...`);
  
  try {
    const headers = await getAuthHeaders();
    
    // Call Floe Credit API to get unsigned repayment transactions
    const response = await axios.post(
      `${config.FLOE_API_URL}/v1/credit/repay`,
      { loanId },
      { headers }
    );

    const transactions = response.data.transactions || response.data; // Handle different response formats
    
    if (!transactions || transactions.length === 0) {
      console.log('No repayment transactions needed (loan may already be repaid).');
      return;
    }

    console.log(`API returned ${transactions.length} transactions for repayment.`);

    // Execute the transactions on the blockchain
    await executeTransactions(transactions);
    
    console.log('Repayment flow completed successfully.');
  } catch (error) {
    const apiError = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error('Error during repayment:', apiError);
    throw new Error(`Repayment failed: ${apiError}`);
  }
}

module.exports = repay;
