import { useState } from 'react';
import { Briefcase, Loader2, User, ShieldCheck } from 'lucide-react';
import { getLedgerContract, parseUSDC, GAS_SETTINGS } from '../lib/arcNetwork';

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
      const duration = 7 * 24 * 60 * 60; // Default 7 days

      const tx = await contract.createJob(
        provider,
        evaluator || provider, // Default evaluator is provider if not set
        budgetUsdc,
        duration,
        description,
        { ...GAS_SETTINGS }
      );
      await tx.wait();

      setProvider('');
      setEvaluator('');
      setBudget('');
      setDescription('');
      onJobCreated();

      alert('Job created on Arc Agentic Ledger!');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job.');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="glass-card p-8 lg:p-10">
      <div className="flex items-center gap-5 mb-10">
        <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
          <Briefcase className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase">Hire Agent</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">USDC Secure Escrow Protocol</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Provider Address</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="0x... (Agent or Freelancer)"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:border-indigo-500/50 focus:ring-0 transition-all font-mono text-sm text-white placeholder:text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Budget (USDC)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
              className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:border-indigo-500/50 focus:ring-0 transition-all font-black text-xl text-indigo-400 placeholder:text-gray-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Evaluator / Attester (Optional)</label>
          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              value={evaluator}
              onChange={(e) => setEvaluator(e.target.value)}
              placeholder="0x... (Third-party verifier or leave empty)"
              className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:border-indigo-500/50 focus:ring-0 transition-all font-mono text-sm text-white placeholder:text-gray-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Job Description & Requirements</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Generate 10 AI images for marketing campaign..."
            rows={4}
            required
            className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:border-indigo-500/50 focus:ring-0 transition-all resize-none text-white placeholder:text-gray-700 font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl hover:brightness-110 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-indigo-500/20"
        >
          {isCreating ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Deploying Job...
            </span>
          ) : (
            'Initiate Agentic Contract'
          )}
        </button>
      </form>
    </div>
  );
}
