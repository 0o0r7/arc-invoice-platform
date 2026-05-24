import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';

export const ARC_NETWORK = {
  chainId: '0x4CEF52', // 5042002 in hex
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.testnet.arc.network'],
  blockExplorerUrls: ['https://testnet.arcscan.app'],
};

export const ARC_USDC_ADDRESS = '0x3600000000000000000000000000000000000000';

export const LEDGER_ABI = [
  'function createJob(address _provider, address _evaluator, uint256 _budget, uint256 _duration, string calldata _description) external returns (uint256)',
  'function fundJob(uint256 _jobId) external',
  'function submitWork(uint256 _jobId, string calldata _deliverableHash) external',
  'function completeJob(uint256 _jobId) external',
  'function rejectJob(uint256 _jobId, string calldata _reason) external',
  'function raiseDispute(uint256 _jobId, string calldata _reason) external',
  'function resolveDispute(uint256 _jobId, uint256 _providerPayout, uint256 _clientRefund) external',
  'function triggerExpiry(uint256 _jobId) external',
  'function getJob(uint256 _jobId) external view returns (tuple(uint256 id, address client, address provider, address evaluator, uint256 budget, uint8 state, string description, string deliverableHash, uint256 createdAt, uint256 expiresAt, uint256 platformFee))',
  'function getUserJobs(address _user) external view returns (uint256[])',
  'function getJobDetails(uint256[] memory _jobIds) external view returns (tuple(uint256 id, address client, address provider, address evaluator, uint256 budget, uint8 state, string description, string deliverableHash, uint256 createdAt, uint256 expiresAt, uint256 platformFee)[])',
  'event JobCreated(uint256 indexed jobId, address indexed client, address indexed provider, string description)',
  'event JobFunded(uint256 indexed jobId, uint256 amount)',
  'event JobSubmitted(uint256 indexed jobId, string deliverableHash)',
  'event JobCompleted(uint256 indexed jobId, address indexed evaluator)',
  'event JobRejected(uint256 indexed jobId, string reason)',
  'event JobDisputed(uint256 indexed jobId, address indexed raisedBy, string reason)',
  'event JobResolved(uint256 indexed jobId, uint256 providerPayout, uint256 clientRefund)',
  'event ReputationUpdated(address indexed user, uint256 newScore)'
];

export const IDENTITY_ABI = [
  'function registerAgent(string memory name, string memory metadataUri) external returns (uint256)',
  'function getAgentProfile(address agentAddress) external view returns (tuple(string name, uint256 reputationScore, uint256 totalJobsCompleted, bool isActive))',
  'function addressToId(address) external view returns (uint256)',
  'event AgentRegistered(uint256 indexed tokenId, address indexed owner, string name)',
  'event ReputationUpdated(uint256 indexed tokenId, uint256 newScore)'
];

export const USDC_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
];

export async function connectWallet() {
  if (!window.ethereum) throw new Error('MetaMask is not installed');
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ARC_NETWORK.chainId }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [ARC_NETWORK],
      });
    } else throw error;
  }
  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  return accounts[0];
}

export async function getProvider() {
  if (!window.ethereum) throw new Error('MetaMask is not installed');
  return new BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = await getProvider();
  return provider.getSigner();
}

export async function getLedgerContract() {
  const contractAddress = import.meta.env.VITE_LEDGER_ADDRESS;
  if (!contractAddress) throw new Error('Ledger contract address not configured');
  const signer = await getSigner();
  return new Contract(contractAddress, LEDGER_ABI, signer);
}

export async function getIdentityContract() {
  const contractAddress = import.meta.env.VITE_AGENT_IDENTITY_ADDRESS;
  if (!contractAddress) throw new Error('Identity contract address not configured');
  const signer = await getSigner();
  return new Contract(contractAddress, IDENTITY_ABI, signer);
}

export async function getUSDCContract() {
  const usdcAddress = import.meta.env.VITE_ARC_USDC_ADDRESS || ARC_USDC_ADDRESS;
  const signer = await getSigner();
  return new Contract(usdcAddress, USDC_ABI, signer);
}

export const GAS_SETTINGS = {
  maxFeePerGas: parseUnits('160', 'gwei'), // Aligned with ARC 2026 institutional stability floor
  maxPriorityFeePerGas: parseUnits('1', 'gwei'),
};

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
