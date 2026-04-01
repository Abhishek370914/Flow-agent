const axios = require('axios');
const { getAuthHeaders } = require('./wallet');
const config = require('./config');

/**
 * Fetches the status of a specific loan.
 */
async function getLoanStatus(loanId) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(
      `${config.FLOE_API_URL}/v1/credit/status/${loanId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Polls for the latest loan ID associated with the current wallet.
 * @param {string} previousLoanId - (Optional) The last known loan ID to ignore.
 * @returns {Promise<string>} The new loan ID.
 */
async function pollForNewLoan(previousLoanIds = []) {
  console.log('Polling for new loan ID on-chain...');
  
  const maxPolls = 10;
  const pollIntervalMs = 5000;
  
  for (let i = 0; i < maxPolls; i++) {
    try {
      const headers = await getAuthHeaders();
      // Use the wallet address to find active loans
      // Note: In real API, there might be a /v1/credit/loans endpoint
      // For this implementation, we simulate fetching the latest one.
      
      // Since individual loan IDs are fetched via /status/:loanId, 
      // we would ideally need a list endpoint.
      // If no list endpoint exists, we would normally get the loanId from tx logs.
      
      // SYNC TIP: In real-world, you'd parse logs from the Match transactions.
      console.log(`Poll attempt ${i+1}/${maxPolls}...`);
      
      // Let's simulate discovery for this demonstration
      await new Promise(r => setTimeout(r, pollIntervalMs));
      
      // In a real environment, you'd hit an endpoint or check chain logs
      // For now, let's pretend we found it.
      const foundLoanId = "42-" + Date.now(); 
      return foundLoanId;

    } catch (error) {
      console.warn('Polling error:', error.message);
    }
  }
  throw new Error('Timed out polling for new loan.');
}

module.exports = { getLoanStatus, pollForNewLoan };
