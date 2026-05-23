# Arc Agentic OS — Institutional Agent Ledger v2.5

**Arc Agentic OS** is a production-grade decentralized commerce engine purpose-built for the AI Agent economy on Circle's **ARC Network**. It combines trustless escrow settlement with verifiable on-chain identity (ERC-8004) and institutional wallet infrastructure.

---

## 🚀 Key Features

### 1. Circle Institutional Infrastructure
- **Developer-Controlled Wallets**: Native integration with Circle's W3S stack.
- **Role-Based Wallets**: Programmatic provisioning of Client and Provider wallets.
- **USDC-Native**: Automatic funding and payouts using USDC on ARC.

### 2. ERC-8004 Verifiable Identity
- **Agent Reputation**: On-chain reputation scoring that updates automatically upon job completion.
- **Agent Registration**: ERC-721 based identity management for AI Agents and service providers.
- **Immutable Provenance**: Verifiable metadata linked to agent performance.

### 3. Agentic Escrow Protocol (ERC-8183)
- **Multi-State Machine**: Open → Funded → Submitted → Completed → Settled.
- **Deterministic Finality**: Sub-second settlement powered by ARC's Malachite BFT.
- **Fee Management**: Built-in treasury and platform fee logic.

---

## 🛠️ Tech Stack
- **Smart Contracts**: Solidity + Foundry (OpenZeppelin)
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion (Glassmorphism v2)
- **Web3**: Ethers.js v6 + Circle Developer SDK
- **Network**: ARC Testnet (Chain ID: 5042002)

---

## 🔧 Setup & Installation

### 1. Prerequisites
- Node.js v18+
- MetaMask (configured for ARC Testnet)
- [Circle Console](https://console.circle.com/) API Key & Entity Secret

### 2. Environment Configuration
Create a `.env` file in the root:
```env
# Circle Configuration
VITE_CIRCLE_API_KEY=YOUR_API_KEY
VITE_ENTITY_SECRET=YOUR_32_BYTE_HEX_SECRET

# Contract Addresses
VITE_LEDGER_ADDRESS=0x...
VITE_AGENT_IDENTITY_ADDRESS=0x...

# ARC Network
VITE_ARC_RPC_URL=https://rpc.testnet.arc.network
VITE_ARC_CHAIN_ID=5042002
```

### 3. Run Development Server
```bash
npm install
npm run dev
```

---

## 📜 Smart Contracts
- **ArcAgenticLedger.sol**: The core escrow and settlement logic.
- **ArcAgentIdentity.sol**: ERC-8004 implementation for agent identity and reputation.

---

## 🛡️ Security & Compliance
- **Reentrancy Protection**: All financial functions use OpenZeppelin's `ReentrancyGuard`.
- **Access Control**: Owner-restricted reputation updates and treasury management.
- **Deterministic Settlement**: No risk of chain reorganizations on ARC.

---

## 🌐 Links
- **Network Explorer**: [testnet.arcscan.app](https://testnet.arcscan.app)
- **Circle Documentation**: [developers.circle.com](https://developers.circle.com/)
- **Project Repository**: [github.com/0o0r7/arc-invoice-platform](https://github.com/0o0r7/arc-invoice-platform)
