import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';

export const ARC_NETWORK = {
  chainId: '0x4CF752',
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  },
  rpcUrls: ['https://rpc.testnet.arc.network'],
  blockExplorerUrls: ['https://testnet.arcscan.app'],
};

export const INVOICE_MANAGER_ABI = [
  'function createInvoice(address _recipient, uint256 _amount, string memory _description) external returns (uint256)',
  'function payInvoice(uint256 _invoiceId) external',
  'function getInvoice(uint256 _invoiceId) external view returns (tuple(uint256 id, address creator, address recipient, uint256 amount, string description, uint256 createdAt, uint256 paidAt, bool isPaid))',
  'function getUserInvoices(address _user) external view returns (uint256[])',
  'function getInvoiceDetails(uint256[] memory _invoiceIds) external view returns (tuple(uint256 id, address creator, address recipient, uint256 amount, string description, uint256 createdAt, uint256 paidAt, bool isPaid)[])',
  'event InvoiceCreated(uint256 indexed invoiceId, address indexed creator, address indexed recipient, uint256 amount, string description)',
  'event InvoicePaid(uint256 indexed invoiceId, address indexed payer, uint256 amount)',
];

export const USDC_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
];

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ARC_NETWORK.chainId }],
    });
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [ARC_NETWORK],
      });
    } else {
      throw error;
    }
  }

  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  return accounts[0];
}

export async function getProvider() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  return new BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = await getProvider();
  return provider.getSigner();
}

export async function getInvoiceManagerContract() {
  const contractAddress = import.meta.env.VITE_INVOICE_MANAGER_ADDRESS;
  if (!contractAddress) {
    throw new Error('Invoice Manager contract address not configured');
  }
  const signer = await getSigner();
  return new Contract(contractAddress, INVOICE_MANAGER_ABI, signer);
}

export async function getUSDCContract() {
  const usdcAddress = import.meta.env.VITE_ARC_USDC_ADDRESS;
  if (!usdcAddress) {
    throw new Error('USDC contract address not configured');
  }
  const signer = await getSigner();
  return new Contract(usdcAddress, USDC_ABI, signer);
}

export function formatUSDC(amount: bigint): string {
  return formatUnits(amount, 6);
}

export function parseUSDC(amount: string): bigint {
  return parseUnits(amount, 6);
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}
