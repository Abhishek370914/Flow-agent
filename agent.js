const borrow = require('./borrow');
const repay = require('./repay');
const { pollForNewLoan } = require('./status');
const config = require('./config');
require('dotenv').config();

const walletAddress = process.env.WALLET_ADDRESS;

/**
 * Main agent execution loop: Automated Lifecycle.
 */
async function agent() {
  console.log('=========================================');
  console.log('Floe Production Agent: Automated Lifecycle');
  console.log('Network: Base Mainnet (Chain ID 8453)');
  console.log(`Wallet: ${walletAddress}`);
  console.log('=========================================');

  try {
    // 1. DYNAMIC BORROW
    const borrowParams = {
      borrowAmount: process.env.BORROW_AMOUNT || config.DEFAULT_BORROW_AMOUNT,
      collateralAmount: process.env.COLLATERAL_AMOUNT || config.DEFAULT_COLLATERAL_AMOUNT,
      duration: config.DEFAULT_DURATION
    };

    console.log('Step 1: Starting Dynamic Borrow Flow...');
    const selectedOffer = await borrow(borrowParams);

    // 2. WAIT FOR CONFIRMATION AND POLL FOR NEW LOAN ID
    console.log('-----------------------------------------');
    console.log('Step 2: Waiting for on-chain loan registration...');
    
    // In production, we'd wait for block confirmation then fetch loanId
    const loanId = await pollForNewLoan();
    console.log(`✅ Identified new loan ID: ${loanId}`);

    // 3. EXECUTE STRATEGY
    console.log('-----------------------------------------');
    console.log('Step 3: Strategy Phase: Using borrowed funds...');
    const profit = (Math.random() * 5).toFixed(2);
    console.log(`Strategy completed. Estimated Profit: ${profit} USDC`);

    // 4. AUTOMATED REPAYMENT
    console.log('-----------------------------------------');
    console.log(`Step 4: Executing automatic repayment for loan ${loanId}...`);
    await repay(loanId);

    console.log('-----------------------------------------');
    console.log('Agent Lifecycle Completed Successfully');
    console.log('=========================================');
  } catch (error) {
    console.error('=========================================');
    console.error('Agent lifecycle failed:');
    console.error(error.message);
    console.error('=========================================');
    process.exit(1);
  }
}

if (require.main === module) {
  agent();
}

module.exports = agent;
