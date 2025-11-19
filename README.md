
# Voting DApp (Sepolia-ready)

This repository contains a simple Voting DApp:
- Solidity contract: `contracts/Voting.sol`
- Hardhat scripts to compile and deploy to Sepolia
- React frontend skeleton in `client/` (connects to deployed contract via MetaMask)

## Quick steps (recommended for you)
1. Install dependencies (root):
   ```bash
   npm install
   ```
2. Create `.env` in project root based on `.env.example`:
   - Set `ALCHEMY_API_KEY` (or `SEPOLIA_RPC_URL`)
   - Set `PRIVATE_KEY` (private key of the deployer account; keep it secret)
3. Compile:
   ```bash
   npm run compile
   ```
4. Deploy to Sepolia:
   ```bash
   npm run deploy:sepolia
   ```
   After deploy, note the contract address printed in the console.

5. Edit frontend `client/src/VotingAbi.json` and `client/src/config.js`:
   - Paste the ABI (from `artifacts/contracts/Voting.sol/Voting.json` -> `abi`)
   - Set the deployed contract address in `client/src/config.js`

6. Run frontend:
   ```bash
   cd client
   npm install
   npm start
   ```
   Open http://localhost:3000 and connect MetaMask (set to Sepolia network).

## Notes
- This project **does not** include any private keys or API keys. Use `.env` to set them locally.
- If you don't have Sepolia ETH, you can request test tokens from a Sepolia faucet.
- For fastest local testing (without Sepolia), you can run `npm run node` to start a Hardhat local node and deploy there.
