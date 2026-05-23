import { useState } from 'react';
import { CircleWalletService } from '../lib/circle';
import { Wallet, Plus, Loader2, Key, Info } from 'lucide-react';

export default function CircleWalletManager() {
  const [walletSet, setWalletSet] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  async function handleCreateSystem() {
    setIsLoading(true);
    setStatus('Initializing Circle Wallet Set...');
    try {
      // 1. Create Wallet Set
      const set = await CircleWalletService.createWalletSet(`Agentic_OS_${Date.now()}`);
      setWalletSet(set);

      setStatus('Creating Institutional Wallets...');
      // 2. Create Wallets
      if (set?.id) {
        const newWallets = await CircleWalletService.createWallets(set.id, 2);
        setWallets(newWallets || []);
      }
      setStatus('System Ready.');
    } catch (e: any) {
      console.error(e);
      setStatus(`Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="glass-card p-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Wallet className="w-32 h-32 text-indigo-400" />
      </div>

      <div className="flex items-center gap-5 mb-10">
        <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
          <Key className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase">Circle Infrastructure</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">Developer Controlled Wallets (EOA/SCA)</p>
        </div>
      </div>

      {!walletSet ? (
        <div className="space-y-8">
          <div className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex gap-4">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-1" />
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Initialize the Circle Developer stack to manage programmatic escrows, automated agent payouts, and institutional-grade wallet infrastructure on ARC.
            </p>
          </div>
          <button
            onClick={handleCreateSystem}
            disabled={isLoading}
            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl hover:brightness-110 transition-all font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isLoading ? status : 'Initialize Circle Wallet Infrastructure'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Active Wallet Set</h4>
             <div className="font-mono text-xs text-indigo-400 truncate">{walletSet.id}</div>
          </div>

          <div className="space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Provisioned Wallets</h4>
             {wallets.map((w, i) => (
               <div key={w.id} className="p-4 bg-white/[0.02] rounded-xl border border-white/5 flex items-center justify-between group">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Wallet_{i+1} ({w.type})</span>
                    <span className="text-xs font-mono text-gray-300 mt-1">{w.address.slice(0,12)}...{w.address.slice(-6)}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
