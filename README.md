# Floe Credit Agent (Base Network)

A production-ready Node.js agent that integrates with the **Floe Labs Credit REST API** on the **Base Mainnet**. This agent autonomously discovers lender offers, executes authenticated borrow transactions, and handles the full repayment lifecycle.

## 🚀 Features

- **Dynamic Market Discovery**: Automatically fetches and selects the best lender offers using real-time API data.
- **EIP-191 Authentication**: Securely signs messages for non-custodial authentication with the Floe API.
- **Full Lifecycle Automation**: Handles the complete flow: Borrow -> Strategy execution -> On-chain polling -> Automatic Repayment.
- **Blockchain Integration**: Signs and submits transactions directly to the Base network using `ethers.js`.
- **Robust Error Handling**: Includes retry logic for liquidity issues and detailed logging for all steps.

## 🛠️ Tech Stack

- **Node.js**: Runtime environment.
- **Ethers.js**: Blockchain interaction and transaction signing.
- **Axios**: REST API communication.
- **Dotenv**: Secure environment variable management.

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A wallet with some ETH on **Base Mainnet** for gas.
- A private key for your agent wallet.

### 2. Installation
```bash
git clone https://github.com/Abhishek370914/Flow-agent.git
cd Flow-agent
npm install
```

### 3. Configuration
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Edit `.env` and provide your credentials:
- `PRIVATE_KEY`: Your wallet's private key (0x...).
- `WALLET_ADDRESS`: Your public wallet address (0x...).
- `MARKET_ID`: Set to `1` for the main pilot market or a specific bytes32 market hash.

### 4. Running the Agent
**Health Check**: Verify your setup and API connectivity.
```bash
npm start
```

**Run Agent**: Execute the full autonomous lifecycle.
```bash
npm run run-agent
```

## 📂 Project Structure

- `agent.js`: Main lifecycle coordinator.
- `borrow.js`: Handles authenticated borrowing and market discovery.
- `repay.js`: Handles loan repayment.
- `market.js`: Discovery module for lender offers.
- `wallet.js`: Crypto utilities for signing and sending transactions.
- `status.js`: Utilities for checking loan health and on-chain polling.
- `config.js`: Centralized project configuration.

## ⚖️ License
ISC
