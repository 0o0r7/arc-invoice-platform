import { useState, useEffect } from 'react';
import { Wallet, LogOut, ChevronRight, Unplug } from 'lucide-react';
import { connectWallet } from '../lib/arcNetwork';
import { motion, AnimatePresence } from 'framer-motion';

interface WalletConnectorProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export default function WalletConnector({ onConnect, onDisconnect }: WalletConnectorProps) {
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnection();
    if (window.ethereum) {
      window.ethereum.on?.('accountsChanged', handleAccountsChanged);
      window.ethereum.on?.('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum) window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
    };
  }, []);

  async function checkConnection() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          onConnect(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  }

  function handleAccountsChanged(accounts: unknown) {
    const accountsArray = accounts as string[];
    if (accountsArray.length === 0) {
      setAddress('');
      onDisconnect();
    } else {
      setAddress(accountsArray[0]);
      onConnect(accountsArray[0]);
    }
  }

  async function handleConnect() {
    setIsConnecting(true);
    try {
      const connectedAddress = await connectWallet();
      setAddress(connectedAddress);
      onConnect(connectedAddress);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  }

  function handleDisconnect() {
    setAddress('');
    onDisconnect();
  }

  return (
    <div className="flex items-center gap-4">
      <AnimatePresence mode="wait">
        {address ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 p-1 pl-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"
          >
            <div className="flex flex-col items-start pr-4 border-r border-white/10">
              <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-400">ARC Explorer</span>
              <span className="text-xs font-mono font-bold text-gray-200">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDisconnect}
              className="p-3 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
              title="Disconnect"
            >
              <Unplug className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            key="connect"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConnect}
            disabled={isConnecting}
            className="group flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            <Wallet className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
