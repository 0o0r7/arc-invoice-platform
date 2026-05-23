import { useState } from 'react';
import { Terminal, Shield, Wallet, Sparkles, Cpu, Lock, ChevronRight, Activity, ArrowUpRight } from 'lucide-react';
import WalletConnector from './components/WalletConnector';
import CreateJob from './components/CreateJob';
import JobList from './components/JobList';
import AgentIdentity from './components/AgentIdentity';
import CircleWalletManager from './components/CircleWalletManager';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [userAddress, setUserAddress] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleConnect(address: string) { setUserAddress(address); }
  function handleDisconnect() { setUserAddress(''); }
  function handleRefresh() { setRefreshTrigger((prev) => prev + 1); }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full"></div>
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center gap-5">
              <motion.div
                whileHover={{ rotate: 180 }}
                className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-[22px] flex items-center justify-center shadow-2xl shadow-indigo-500/20"
              >
                <Terminal className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Arc Ledger</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Agentic Commerce v2.5</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500 mr-4">
                  <a href="#" className="hover:text-white transition-colors">Documentation</a>
                  <a href="#" className="hover:text-white transition-colors">Ecosystem</a>
               </div>
               <WalletConnector onConnect={handleConnect} onDisconnect={handleDisconnect} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <AnimatePresence mode="wait">
          {!userAddress ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="flex flex-col items-center text-center max-w-5xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-10">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">The First Agent-Native Commerce Engine</span>
              </div>

              <h2 className="text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                Build the <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Autonomous</span> <br/>
                <span className="text-indigo-500">Economy</span> on ARC.
              </h2>

              <p className="text-xl text-gray-400 mb-16 max-w-2xl font-medium leading-relaxed">
                A trustless job protocol for AI Agents and Human Experts.
                Escrowed USDC settlement with sub-second deterministic finality.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {[
                  { icon: Lock, title: "Escrow Protocol", desc: "USDC secured until attestation" },
                  { icon: Cpu, title: "Agent Compliant", desc: "Native ERC-8183 machine state" },
                  { icon: Activity, title: "Onchain Reputation", desc: "Verifiable ERC-8004 scoring" }
                ].map((feat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    className="p-10 glass-card text-left group cursor-default"
                  >
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:border-indigo-500/50 transition-colors">
                      <feat.icon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{feat.title}</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
                    <ArrowUpRight className="w-5 h-5 text-indigo-500/0 group-hover:text-indigo-500/100 transition-all mt-6" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32">
                <AgentIdentity userAddress={userAddress} />
                <CircleWalletManager />
                <CreateJob onJobCreated={handleRefresh} />

                <div className="glass-card p-10">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-8 border-b border-white/5 pb-4">ARC Infrastructure Node</h4>
                   <div className="space-y-6">
                      <MetricRow label="Chain ID" value="5042002" />
                      <MetricRow label="Base Fee" value="20 Gwei" />
                      <MetricRow label="Protocol" value="Malachite BFT" />
                      <MetricRow label="Settlement" value="Deterministic" />
                   </div>
                </div>
              </div>
              <div className="lg:col-span-7">
                <JobList userAddress={userAddress} refreshTrigger={refreshTrigger} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-40 border-t border-white/5 bg-white/[0.01] py-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5">
            <Terminal className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-gray-600 text-xs font-black uppercase tracking-[0.5em] mb-12">
            The Economic OS for the Internet Era
          </p>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-gray-700">
            <a href="https://docs.arc.network/" target="_blank" className="hover:text-indigo-400 transition-colors">Docs</a>
            <a href="https://testnet.arcscan.app/" target="_blank" className="hover:text-indigo-400 transition-colors">Arcscan</a>
            <a href="https://arc.network/" target="_blank" className="hover:text-indigo-400 transition-colors">Circle</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MetricRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center group">
       <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
       <span className="font-mono text-xs font-black text-indigo-400 group-hover:text-indigo-300 transition-colors">{value}</span>
    </div>
  );
}

export default App;
