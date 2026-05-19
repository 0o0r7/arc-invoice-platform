import { useState } from 'react';
import { Briefcase, Loader2, User, ShieldCheck, Sparkles, Plus, Send } from 'lucide-react';
import { getLedgerContract, parseUSDC, GAS_SETTINGS } from '../lib/arcNetwork';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface CreateJobProps {
  onJobCreated: () => void;
}

export default function CreateJob({ onJobCreated }: CreateJobProps) {
  const [provider, setProvider] = useState('');
  const [evaluator, setEvaluator] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsCreating(true);
    try {
      const contract = await getLedgerContract();
      const budgetUsdc = parseUSDC(budget);
      const tx = await contract.createJob(provider, evaluator || provider, budgetUsdc, 7 * 24 * 3600, description, { ...GAS_SETTINGS });
      await tx.wait();
      setProvider(''); setEvaluator(''); setBudget(''); setDescription('');
      onJobCreated();
    } catch (error) { console.error(error); }
    finally { setIsCreating(false); }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 neo-glow before:bg-indigo-500/10"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight uppercase">Initiate Commercial Job</h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Escrowed USDC Contract</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Agent Address</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="0x..."
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-mono text-sm text-gray-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Budget (USDC)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-black text-xl text-white placeholder:text-gray-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Evaluator / Attester</label>
          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              value={evaluator}
              onChange={(e) => setEvaluator(e.target.value)}
              placeholder="Optional: Third-party verifier"
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-mono text-sm text-gray-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Requirement & Prompt</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the job deliverables..."
            rows={3}
            required
            className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none text-gray-200"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01, boxShadow: "0 20px 40px -20px rgba(99, 102, 241, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isCreating}
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-indigo-600/20"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Synchronizing...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Deploy Commercial Agentic Job</span>
              <Send className="w-4 h-4 opacity-50" />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
