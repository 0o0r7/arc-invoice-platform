import axios from 'axios';

/**
 * SECURITY REMEDIATION (May 2026):
 * Circle Developer Controlled Wallets Service
 *
 * IMPORTANT: In a production environment, all mutating calls (createWalletSet, createWallets, transferUSDC)
 * MUST be performed on a secure backend to protect the Entity Secret and API Key.
 * This client is now refactored to use a backend proxy for secure operations.
 */

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001/api/circle';
const CIRCLE_API_URL = 'https://api.circle.com/v1/w3s';

export const CircleWalletService = {
  /**
   * Create a new Wallet Set (Proxied via Backend)
   */
  createWalletSet: async (name: string) => {
    const response = await axios.post(`${BACKEND_API_URL}/wallet-sets`, { name });
    return response.data?.walletSet;
  },

  /**
   * Create wallets within a set (Proxied via Backend)
   */
  createWallets: async (walletSetId: string, count: number = 1) => {
    const response = await axios.post(`${BACKEND_API_URL}/wallets`, { walletSetId, count });
    return response.data?.wallets;
  },

  /**
   * Execute a transfer (Proxied via Backend)
   */
  transferUSDC: async (walletId: string, destinationAddress: string, amount: string) => {
    const response = await axios.post(`${BACKEND_API_URL}/transfers`, {
      walletId,
      destinationAddress,
      amount
    });
    return response.data?.id;
  },

  /**
   * Get wallet balance (Read-only, can be client-side with restricted API key)
   */
  getWalletBalance: async (walletId: string) => {
    const response = await axios.get(`${CIRCLE_API_URL}/wallets/${walletId}/balances`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_CIRCLE_API_KEY}`,
      },
    });
    return response.data?.data?.balances;
  }
};
