import { useState } from 'react';
import { Terminal, Shield, Wallet, Sparkles, Cpu, Lock } from 'lucide-react';
import WalletConnector from './components/WalletConnector';
import CreateJob from './components/CreateJob';
import JobList from './components/JobList';

function App() {
  const [userAddress, setUserAddress] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleConnect(address: string) {
    setUserAddress(address);
  }

  function handleDisconnect() {
    setUserAddress('');
  }

  function handleRefresh() {
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter text-gray-900 uppercase">Arc Agentic Ledger</h1>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">ARC Mainnet-Ready Node</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-gray-600">Secure Escrow Active</span>
               </div>
               <WalletConnector onConnect={handleConnect} onDisconnect={handleDisconnect} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!userAddress ? (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-16 border border-gray-100 overflow-hidden">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-8">
                  <Sparkles className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight leading-none">
                  The Future of <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Onchain Commerce</span>
                </h2>
                <p className="text-xl text-gray-500 mb-10 max-w-2xl font-medium leading-relaxed">
                  The first trustless job & invoice platform built specifically for AI Agents and Human Freelancers. Escrowed USDC payments with sub-second ARC finality.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-4">
                  {[
                    { icon: Lock, title: "Smart Escrow", desc: "USDC locked until delivery" },
                    { icon: Cpu, title: "Agent Ready", desc: "ERC-8183 compliant API" },
                    { icon: Wallet, title: "Gasless Feel", desc: "USDC as native gas" }
                  ].map((feat, i) => (
                    <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                      <feat.icon className="w-6 h-6 text-indigo-600 mb-4" />
                      <h4 className="font-bold text-gray-900 mb-1">{feat.title}</h4>
                      <p className="text-sm text-gray-500 font-medium">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-8 sticky top-32">
              <CreateJob onJobCreated={handleRefresh} />

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl">
                 <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Network Status</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500 font-medium">Chain ID</span>
                       <span className="font-mono font-bold text-indigo-600">5042002</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500 font-medium">Gas Token</span>
                       <span className="font-bold text-green-600">USDC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500 font-medium">Finality</span>
                       <span className="font-bold text-blue-600">&lt; 1 Second</span>
                    </div>
                 </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <JobList userAddress={userAddress} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 pb-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-black uppercase tracking-widest text-gray-900 text-sm">Arc Agentic Ledger v2.0</span>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-6">
            Optimized for Circle's ARC Testnet — The Bespoke Economic Layer for the AI Era.
          </p>
          <div className="flex justify-center gap-8 text-xs font-black uppercase tracking-widest text-gray-400">
            <a href="https://docs.arc.network/" target="_blank" className="hover:text-indigo-600 transition-colors">Documentation</a>
            <a href="https://testnet.arcscan.app/" target="_blank" className="hover:text-indigo-600 transition-colors">Explorer</a>
            <a href="https://arc.network/" target="_blank" className="hover:text-indigo-600 transition-colors">Official Website</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
