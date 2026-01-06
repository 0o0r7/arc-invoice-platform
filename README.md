# Arc Invoice - Payment System on Arc Network

A decentralized invoice and payment management system built on Arc Network testnet, leveraging USDC for stable, predictable transactions with sub-second finality.

## Features

- **Create Invoices:** Generate invoices with USDC amounts
- **Pay Invoices:** Settle invoices instantly using USDC on Arc Network
- **Track Payments:** View all your invoices and their payment status
- **Blockchain Explorer:** Direct links to transaction details on Arcscan
- **Sub-second Finality:** Transactions confirmed in under 1 second
- **Stable Gas Fees:** Pay gas fees in USDC (no volatility)

## Arc Network Integration

This application leverages Arc Network's unique features:
- **USDC Gas Token:** Predictable, stable transaction costs
- **Deterministic Finality:** Sub-second transaction confirmation
- **EVM Compatibility:** Built with familiar Solidity and ethers.js
- **Direct USDC Payments:** No bridging required

## Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Blockchain:** Arc Network Testnet (Chain ID: 5042002)
- **Smart Contracts:** Solidity 0.8.20
- **Web3:** ethers.js v6
- **Development:** Foundry

## Quick Start

### Prerequisites

1. **MetaMask** wallet installed
2. **Foundry** for smart contract development
3. **Node.js** 18+ and npm

### Installation

```bash
npm install
forge install OpenZeppelin/openzeppelin-contracts
```

### Setup Arc Testnet

Add Arc Testnet to MetaMask:
- **Network name:** Arc Testnet
- **RPC URL:** https://rpc.testnet.arc.network
- **Chain ID:** 5042002
- **Currency symbol:** USDC
- **Explorer:** https://testnet.arcscan.app

Get testnet USDC from: https://faucet.circle.com

### Deploy Smart Contracts

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Add your private key and USDC address to `.env`:
```env
PRIVATE_KEY=your_private_key_here
ARC_USDC_ADDRESS=testnet_usdc_address
```

3. Deploy contracts:
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url arc_testnet \
  --broadcast
```

4. Add the deployed contract address to `.env`:
```env
VITE_INVOICE_MANAGER_ADDRESS=deployed_contract_address
VITE_ARC_USDC_ADDRESS=usdc_contract_address
```

### Run Application

```bash
npm run dev
```

Visit: http://localhost:5173

## How It Works

### Smart Contract Architecture

**InvoiceManager.sol:**
- Creates invoices with recipient address, amount, and description
- Handles USDC payment processing
- Tracks invoice status (paid/unpaid)
- Emits events for invoice creation and payment

### Workflow

1. **Create Invoice:**
   - User specifies recipient address, USDC amount, and description
   - Smart contract creates invoice on-chain
   - Invoice ID generated and stored

2. **Pay Invoice:**
   - Recipient approves USDC spending for InvoiceManager contract
   - Recipient calls `payInvoice()` with invoice ID
   - USDC transferred from recipient to creator
   - Invoice marked as paid with timestamp

3. **View Invoices:**
   - Query all invoices for connected wallet
   - Display invoice details, status, and payment history
   - Link to Arcscan for transaction details

## Arc Network Farming Strategy

This project is optimized for Arc Network testnet farming:

### Developer Activities (High Priority)
- [x] Deploy smart contracts to Arc testnet
- [x] Build functional dApp with real utility
- [x] Integrate with Circle USDC
- [x] Use Arc-specific features (USDC gas, sub-second finality)
- [ ] Deploy multiple contract versions for testing
- [ ] Contribute to Arc ecosystem documentation

### Network Usage
- [x] Regular transactions on Arc testnet
- [x] Smart contract interactions
- [x] USDC transfers
- [ ] Bridge operations via CCTP

### Community Engagement
- [ ] Share project on Twitter/X with #ArcNetwork #BuildOnArc
- [ ] Write tutorial on building with Arc Network
- [ ] Report bugs and provide feedback
- [ ] Help other developers in Arc community

## Project Structure

```
├── contracts/
│   └── InvoiceManager.sol       # Main invoice management contract
├── script/
│   └── Deploy.s.sol             # Deployment script
├── src/
│   ├── components/
│   │   ├── WalletConnector.tsx  # Arc wallet connection
│   │   ├── CreateInvoice.tsx    # Invoice creation UI
│   │   └── InvoiceList.tsx      # Invoice display and payment
│   ├── lib/
│   │   └── arcNetwork.ts        # Arc Network utilities
│   └── App.tsx                  # Main application
├── foundry.toml                 # Foundry configuration
└── README.md
```

## Smart Contract Functions

### Create Invoice
```solidity
function createInvoice(
    address _recipient,
    uint256 _amount,
    string memory _description
) external returns (uint256)
```

### Pay Invoice
```solidity
function payInvoice(uint256 _invoiceId) external
```

### Get User Invoices
```solidity
function getUserInvoices(address _user)
    external view returns (uint256[])
```

### Get Invoice Details
```solidity
function getInvoice(uint256 _invoiceId)
    external view returns (Invoice memory)
```

## Testing

```bash
npm run build
```

## Deployment

See [README_DEPLOYMENT.md](./README_DEPLOYMENT.md) for detailed deployment instructions.

## Arc Network Resources

- **Documentation:** https://docs.arc.network
- **Testnet Explorer:** https://testnet.arcscan.app
- **Faucet:** https://faucet.circle.com
- **Twitter:** https://twitter.com/Arc_testnet
- **Website:** https://www.arc.network

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a PR.

## Support

For issues or questions:
- Open a GitHub issue
- Join Arc Network community channels
- Check Arc Network documentation

---

**Built with Arc Network** - The Economic OS for the Internet
