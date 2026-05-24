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
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 rounded-xl">
          <Briefcase className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hire Agent/Provider</h2>
          <p className="text-sm text-gray-500 font-medium">Create a secure commercial job with USDC escrow</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Provider Address</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="0x... (Agent or Freelancer)"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Budget (USDC)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Evaluator / Attester (Optional)</label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={evaluator}
              onChange={(e) => setEvaluator(e.target.value)}
              placeholder="0x... (Third-party verifier or leave empty)"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Job Description & Requirements</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Generate 10 AI images for marketing campaign..."
            rows={3}
            required
            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 font-black uppercase tracking-widest shadow-lg shadow-indigo-200"
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
