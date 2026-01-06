import { useState } from 'react';
import { FileText } from 'lucide-react';
import WalletConnector from './components/WalletConnector';
import CreateInvoice from './components/CreateInvoice';
import InvoiceList from './components/InvoiceList';

function App() {
  const [userAddress, setUserAddress] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleConnect(address: string) {
    setUserAddress(address);
  }

  function handleDisconnect() {
    setUserAddress('');
  }

  function handleInvoiceCreated() {
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Arc Invoice</h1>
                <p className="text-xs text-gray-500">Payment on Arc Network</p>
              </div>
            </div>
            <WalletConnector onConnect={handleConnect} onDisconnect={handleDisconnect} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!userAddress ? (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Arc Invoice
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create and manage invoices on Arc Network with instant USDC payments
              and sub-second finality.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-blue-900 font-medium mb-2">Arc Network Features:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ USDC gas fees (no volatility)</li>
                <li>✓ Sub-second finality</li>
                <li>✓ Predictable transaction costs</li>
                <li>✓ EVM-compatible</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <CreateInvoice onInvoiceCreated={handleInvoiceCreated} />
            <InvoiceList userAddress={userAddress} refreshTrigger={refreshTrigger} />
          </div>
        )}
      </main>

      <footer className="mt-12 pb-8 text-center text-sm text-gray-600">
        <p>
          Built on{' '}
          <a
            href="https://www.arc.network/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            Arc Network Testnet
          </a>
        </p>
        <p className="mt-1 text-xs">
          Chain ID: 5042002 | Gas Token: USDC
        </p>
      </footer>
    </div>
  );
}

export default App;
