import axios from 'axios';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

const CIRCLE_API_URL = 'https://api.circle.com/v1/w3s';

// Initialize the Circle SDK client
export const circleClient = initiateDeveloperControlledWalletsClient({
  apiKey: import.meta.env.VITE_CIRCLE_API_KEY || '',
  entitySecret: import.meta.env.VITE_ENTITY_SECRET || '',
});

/**
 * Circle Developer Controlled Wallets Service
 * Note: In a production app, many of these calls would happen on a secure backend.
 */
export const CircleWalletService = {
  /**
   * Register Entity Secret (Public Key) with Circle
   * Only needs to be done once per entity.
   */
  registerEntity: async () => {
    const response = await circleClient.registerEntity({
      publicKey: import.meta.env.VITE_ENTITY_PUBLIC_KEY,
    });
    return response;
  },

  /**
   * Create a new Wallet Set
   */
  createWalletSet: async (name: string) => {
    const response = await circleClient.createWalletSet({
      name,
    });
    return response.data?.walletSet;
  },

  /**
   * Create wallets within a set
   */
  createWallets: async (walletSetId: string, count: number = 1) => {
    const response = await circleClient.createWallets({
      accountType: 'SCA',
      blockchains: ['ARC-TESTNET'],
      count,
      walletSetId,
    });
    return response.data?.wallets;
  },

  /**
   * Execute a transfer from a developer-controlled wallet
   */
  transferUSDC: async (walletId: string, destinationAddress: string, amount: string) => {
    const response = await circleClient.createTransaction({
      walletId,
      tokenId: 'USDC-ARC', // Specific token ID for ARC Testnet USDC
      amounts: [amount],
      destinationAddress,
      feeLevel: 'MEDIUM',
    });
    return response.data?.id;
  },

  /**
   * Get wallet balance
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
