import { useState, useEffect } from 'react';
import {
  Terminal,
  Lock,
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Activity,
  Award,
  Zap,
  Globe,
  Clock
} from 'lucide-react';
import { getLedgerContract, getUSDCContract, formatUSDC, GAS_SETTINGS } from '../lib/arcNetwork';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

enum JobState { Open, Funded, Submitted, Completed, Rejected, Expired }

interface Job {
  id: bigint;
  client: string;
  provider: string;
  evaluator: string;
  budget: bigint;
  state: JobState;
  description: string;
  deliverableHash: string;
  createdAt: bigint;
  expiresAt: bigint;
}

interface JobListProps {
  userAddress: string;
  refreshTrigger: number;
}

export default function JobList({ userAddress, refreshTrigger }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<bigint | null>(null);
  const [reputation, setReputation] = useState<number>(0);

  useEffect(() => { if (userAddress) loadData(); }, [userAddress, refreshTrigger]);

  async function loadData() {
    setIsLoading(true);
    try {
      const contract = await getLedgerContract();
      const jobIds = await contract.getUserJobs(userAddress);
      const score = await contract.reputationScore(userAddress);
      setReputation(Number(score));
      if (jobIds.length > 0) {
        const details = await contract.getJobDetails(jobIds);
        setJobs([...details].sort((a, b) => Number(b.id - a.id)));
      } else setJobs([]);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }

  async function handleFund(job: Job) {
    setActionId(job.id);
    try {
      const usdc = await getUSDCContract();
      const ledger = await getLedgerContract();
      const ledgerAddress = await ledger.getAddress();
      const allowance = await usdc.allowance(userAddress, ledgerAddress);
      if (allowance < job.budget) {
        const tx = await usdc.approve(ledgerAddress, job.budget, { ...GAS_SETTINGS });
        await tx.wait();
      }
      const fundTx = await ledger.fundJob(job.id, { ...GAS_SETTINGS });
      await fundTx.wait();
      await loadData();
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  async function handleSubmit(jobId: bigint) {
    const hash = prompt("Deliverable Proof (IPFS/URL):");
    if (!hash) return;
    setActionId(jobId);
    try {
      const ledger = await getLedgerContract();
      await (await ledger.submitWork(jobId, hash, { ...GAS_SETTINGS })).wait();
      await loadData();
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  async function handleComplete(jobId: bigint) {
    setActionId(jobId);
    try {
      const ledger = await getLedgerContract();
      await (await ledger.completeJob(jobId, { ...GAS_SETTINGS })).wait();
      await loadData();
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-8 flex items-center justify-between relative overflow-hidden group border-indigo-500/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
        <div className="flex items-center gap-6 z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Reputation Protocol</h3>
            <p className="text-5xl font-black text-white tracking-tighter">{reputation}</p>
          </div>
        </div>
        <div className="text-right z-10 hidden md:block">
          <div className="flex items-center gap-2 justify-end text-green-400 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Live Sync</span>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">ERC-8004 Standard</p>
        </div>
      </motion.div>

      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Active Job Ledger</h2>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
             <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> ARC Testnet</span>
             <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Finality &lt;1s</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {jobs.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-20 text-center">
                <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">Empty Ledger State</p>
              </motion.div>
            ) : (
              jobs.map(job => (
                <JobRow
                  key={job.id.toString()}
                  job={job}
                  userAddress={userAddress}
                  actionId={actionId}
                  onFund={handleFund}
                  onSubmit={handleSubmit}
                  onComplete={handleComplete}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function JobRow({ job, userAddress, actionId, onFund, onSubmit, onComplete }: {
  job: Job, userAddress: string, actionId: bigint | null,
  onFund: (j: Job) => void, onSubmit: (id: bigint) => void, onComplete: (id: bigint) => void
}) {
  const isClient = job.client.toLowerCase() === userAddress.toLowerCase();
  const isProvider = job.provider.toLowerCase() === userAddress.toLowerCase();
  const isEvaluator = job.evaluator.toLowerCase() === userAddress.toLowerCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 hover:bg-white/[0.03] transition-all group"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <StatusBadge state={Number(job.state)} />
            <span className="text-[10px] font-mono text-gray-600 font-bold tracking-widest bg-white/5 px-3 py-1 rounded-full uppercase">
              Job-ID: {job.id.toString().padStart(4, '0')}
            </span>
          </div>

          <h4 className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors leading-tight">
            {job.description}
          </h4>

          <div className="flex flex-wrap gap-6 items-center">
            <AddressTag label="Client" address={job.client} />
            <AddressTag label="Agent" address={job.provider} />
          </div>

          {job.deliverableHash && (
            <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex items-center justify-between group/hash">
              <div className="flex items-center gap-3 overflow-hidden">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-xs font-mono text-indigo-300 truncate">{job.deliverableHash}</span>
              </div>
              <a href={job.deliverableHash} target="_blank" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4 text-indigo-400" />
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end justify-between min-w-[180px]">
          <div className="text-right">
            <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Escrowed Balance</div>
            <div className="text-4xl font-black text-white leading-none tracking-tighter">
              ${formatUSDC(job.budget)} <span className="text-lg text-gray-600 ml-1">USDC</span>
            </div>
          </div>

          <div className="flex gap-3">
            {isClient && Number(job.state) === JobState.Open && (
              <ActionButton onClick={() => onFund(job)} loading={actionId === job.id} label="Lock & Fund" variant="indigo" />
            )}
            {isProvider && Number(job.state) === JobState.Funded && (
              <ActionButton onClick={() => onSubmit(job.id)} loading={actionId === job.id} label="Submit Deliverables" variant="blue" />
            )}
            {isEvaluator && Number(job.state) === JobState.Submitted && (
              <ActionButton onClick={() => onComplete(job.id)} loading={actionId === job.id} label="Attest & Settle" variant="green" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ state }: { state: number }) {
  const styles = {
    [JobState.Open]: "bg-gray-500/10 text-gray-500",
    [JobState.Funded]: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
    [JobState.Submitted]: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
    [JobState.Completed]: "bg-green-500/20 text-green-400 border border-green-500/20",
    [JobState.Rejected]: "bg-red-500/20 text-red-400 border border-red-500/20",
    [JobState.Expired]: "bg-gray-800 text-gray-600",
  };
  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", styles[state as keyof typeof styles])}>
      {JobState[state]}
    </span>
  );
}

function AddressTag({ label, address }: { label: string, address: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-0.5">{label}</span>
      <span className="text-xs font-mono font-bold text-indigo-400/80">{address.slice(0, 8)}...{address.slice(-6)}</span>
    </div>
  );
}

function ActionButton({ onClick, loading, label, variant }: { onClick: () => void, loading: boolean, label: string, variant: 'indigo' | 'blue' | 'green' }) {
  const colors = {
    indigo: "bg-indigo-600 shadow-indigo-600/20 hover:bg-indigo-500",
    blue: "bg-blue-600 shadow-blue-600/20 hover:bg-blue-500",
    green: "bg-green-600 shadow-green-600/20 hover:bg-green-500",
  };
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={loading}
      className={cn("px-6 py-3 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-xl transition-all disabled:opacity-50", colors[variant])}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : label}
    </motion.button>
  );
}
