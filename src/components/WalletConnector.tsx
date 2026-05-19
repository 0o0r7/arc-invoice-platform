import { useState, useEffect } from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { connectWallet } from '../lib/arcNetwork';

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
      if (window.ethereum) {
        window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
      }
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
      alert('Failed to connect wallet. Please make sure MetaMask is installed and try again.');
    } finally {
      setIsConnecting(false);
    }
  }

  function handleDisconnect() {
    setAddress('');
    onDisconnect();
  }

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-mono text-sm">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={handleDisconnect}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      <Wallet className="w-5 h-5" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
