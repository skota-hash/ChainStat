# 🏏 ChainStat - IPL NFT Marketplace

ChainStat is a decentralized NFT marketplace that turns real-time IPL 2025 cricket stats into tradable NFTs. Categories like **Most Runs**, **Best Strike Rate**, and **Top Wickets** are tracked daily, and top-performing players in each category are minted as NFTs. These NFTs use dynamic, pool-based metadata that updates with each new match.

NFTs can be:
- 🔨 Minted using `Custom721` contract
- 🛒 Listed and purchased on `Marketplace` using YODA tokens(custom ERC-20 token)
- 🔄 Automatically updated every 24h to reflect the latest match stats

---

## 📦 Tech Stack

- ⚛️ React + TypeScript
- 💨 TailwindCSS
- 🔁 Ethers.js for smart contract interactions
- 🧠 Hardhat for Solidity development
- 🌐 Sepolia Testnet (Ethereum)
- 💰 Custom ERC-20 token (YODA)

---

## 📂 Folder Overview

```bash
.
├── backend/               # Smart contract source (Hardhat)
│   ├── contracts/         # ERC721 + Marketplace contracts
│   ├── scripts/           # Deployment & interaction scripts
│   └── .env               # Infura/Alchemy & Wallet keys
├── src/                   # React frontend
│   ├── components/        # Cards, Dashboard, Modals, etc.
│   ├── pages/             # Home, MyNFTs, Listed, Showcase
│   ├── utils/             # contract helpers
│   ├── data/              # Raw and preprocessed IPL stats
│   └── utilities/         # Dynamic metadata generator, price calculator, etc.
├── public/                # Static assets (logos, icons)
├── .env                   # Frontend envs (contract addresses, network ID)
└── README.md              # Project overview and setup instructions
```
---

## 🖥️ Running the Frontend Locally

### 1. Clone the Project

```bash
git clone https://github.com/your-username/ChainStat.git
cd ChainStat
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_YODA_TOKEN_ADDRESS=0xYourYodaTokenAddress
VITE_DEPLOYED_CONTRACT_ADDRESS=0xYourDeployedContarctAddress
VITE_MARKETPLACE_ADDRESS=0xYourDeployedMarketplacecontractAddress
```

- These addresses should match the deployed contracts on Sepolia.

### 4. Run the Frontend App

- Go to Dapp_IPL folder and run the command to start your application
```bash
npm run dev
# or
yarn dev
```

- App opens at `http://localhost:5173`
- Connect MetaMask to **Sepolia testnet**
- Mint, list, buy, and view dynamically updating NFTs

---

## 🔨 Smart Contract Deployment

### 1. Navigate to `backend/` folder

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile Contracts

```bash
npx hardhat compile
```

### 4. Set Up Deployment `.env`

Create a `.env` inside `backend/`:

```env
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_YODA_TOKEN_ADDRESS=0xYourYodaTokenAddress
VITE_DEPLOYED_CONTRACT_ADDRESS=0xYourDeployedContarctAddress
VITE_MARKETPLACE_ADDRESS=0xYourDeployedMarketplacecontractAddress

```

⚠️ **Do NOT expose this `.env` or private key.** Add `.env` to `.gitignore`.

### 5. Deploy Contracts

```bash
npx hardhat run scripts/deploy.js --network sepolia
```
If you want to start from scratch - i.e, from pool creation

You will get:

- `Custom721` (NFT logic + pool metadata)
- `Marketplace` (listing and buying logic)
- `YodaToken` (ERC-20 utility token)

Copy the deployed addresses and update the frontend `.env` accordingly.

---

## 🧠 NFT Metadata & Pool System

- Pool = a stat category (e.g., “Most Runs”)
- One pool = many NFTs with **shared metadata**
- Metadata is stored On-chain and updated via `updateMetadata(poolId, newURI)`

---
Try it out now!
