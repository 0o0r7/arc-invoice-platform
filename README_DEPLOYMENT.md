# Arc Network Invoice Payment System - Deployment Guide

## Prerequisites

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Install dependencies:
```bash
npm install
forge install OpenZeppelin/openzeppelin-contracts
```

## Arc Testnet Setup

### 1. Add Arc Testnet to MetaMask

- Network name: Arc Testnet
- RPC URL: https://rpc.testnet.arc.network
- Chain ID: 5042002
- Currency symbol: USDC
- Explorer: https://testnet.arcscan.app

### 2. Get Testnet USDC

Visit: https://faucet.circle.com

## Contract Deployment

### 1. Set up environment variables

Copy `.env.example` to `.env` and fill in:
```env
PRIVATE_KEY=your_private_key_here
ARC_USDC_ADDRESS=testnet_usdc_contract_address
```

### 2. Deploy contracts

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url arc_testnet \
  --broadcast \
  --verify
```

### 3. Save contract address

After deployment, copy the InvoiceManager contract address and add to `.env`:
```env
VITE_INVOICE_MANAGER_ADDRESS=0x...
```

## Frontend Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

## Testing on Arc Testnet

1. Connect MetaMask to Arc Testnet
2. Ensure you have testnet USDC
3. Create an invoice
4. Pay the invoice using USDC
5. View transaction on https://testnet.arcscan.app

## Arc Network Features Used

- USDC as gas token (stable, predictable fees)
- Sub-second deterministic finality
- EVM-compatible smart contracts
- Direct USDC payments without bridging

## Troubleshooting

### MetaMask not connecting
- Ensure Arc Testnet is added correctly
- Check Chain ID is 5042002

### Transaction failing
- Ensure you have testnet USDC for gas
- Check USDC approval for InvoiceManager contract

### Contract not verified
- Wait a few minutes after deployment
- Check Arcscan for verification status
