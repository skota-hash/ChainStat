# 🏏 ChainStat - IPL 2025 NFT Marketplace

ChainStat is a decentralized NFT marketplace that turns real-time IPL 2025 cricket stats into tradable NFTs. Categories like **Most Runs**, **Best Strike Rate**, and **Top Wickets** are tracked daily, and top-performing players in each category are minted as NFTs. These NFTs use dynamic, pool-based metadata that updates with each new match.

NFTs can be:

- 🔨 Minted using `Custom721`
- 🛒 Listed and purchased on `Marketplace` using YODA tokens
- 🔄 Automatically updated every 24h to reflect the latest match stats

---

## 📦 Tech Stack

- ⚛️ React + TypeScript
- 💨 TailwindCSS
- 🔁 Ethers.js for smart contract interactions
- 🧠 Hardhat for Solidity development
- 🌐 Sepolia Testnet (Ethereum)
- 📦 Pinata + IPFS for metadata hosting
- 💰 Custom ERC-20 token (YODA)

---

## 🖥️ Running the Frontend Locally

### 1. Clone the Project

```bash
git clone https://github.com/your-username/chainstat-ipl-nft.git
cd chainstat-ipl-nft
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
VITE_CONTRACT_ADDRESS=0xYourCustom721Address
VITE_MARKETPLACE_ADDRESS=0xYourMarketplaceAddress
VITE_YODA_TOKEN_ADDRESS=0xYourYodaTokenAddress
VITE_PINATA_GATEWAY=https://your-subdomain.mypinata.cloud/ipfs/
```

- These addresses should match the deployed contracts on Sepolia.
- Make sure the Pinata gateway is public or authorized for read access.

### 4. Run the Frontend App

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
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret
```

⚠️ **Do NOT expose this `.env` or private key.** Add `.env` to `.gitignore`.

### 5. Deploy Contracts

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

You will get:

- `Custom721` (NFT logic + pool metadata)
- `Marketplace` (listing and buying logic)
- `YodaToken` (ERC-20 utility token)

Copy the deployed addresses and update the frontend `.env` accordingly.

---

## 🧠 NFT Metadata & Pool System

- Pool = a stat category (e.g., “Most Runs”)
- One pool = many NFTs with **shared metadata**
- Metadata is updated **off-chain**, pinned to IPFS via **Pinata**
- On-chain metadata updated via `updateMetadata(poolId, newURI)`

---

## ✅ To-Do Before Launch

- [ ] Set valid IPFS metadata for all pools
- [ ] Set mint pricing logic in `getSupplyInfo()`
- [ ] Ensure automatic metadata update job runs every 24h
- [ ] Test listing/unlisting/purchasing flow on Sepolia
- [ ] Finalize UI animations and Toast feedback

---

## 📂 Folder Overview

```bash
.
├── backend/               # Smart contract source (Hardhat)
│   ├── contracts/
│   ├── scripts/
│   └── .env
├── src/                   # React frontend
│   ├── components/        # Cards, Dashboard, Modals, etc.
│   ├── utils/             # Metadata, contract helpers
│   └── pages/             # Home, MyNFTs, Listed, Showcase
├── public/
├── .env                   # Frontend contract envs
└── README.md
```

---

## 📌 Future Improvements

- ⛓️ Live Chainlink oracles for IPL data
- 📱 Mobile optimization
- 📊 Player profiles & trading history
- 💸 Bidding + auction system
- 🏅 Rarity tiers for NFTs based on match performance

---

## 🧑‍💻 Contributors

- **SK** - Smart Contracts, Frontend, Integration
- React, Solidity, Hardhat, ethers.js, TailwindCSS

---

## 📄 License

MIT © 2025 ChainStat IPL
