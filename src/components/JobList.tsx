import { useState, useEffect } from 'react';
import {
  Terminal,
  Lock,
  Send,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Activity,
  Award
} from 'lucide-react';
import { getLedgerContract, getUSDCContract, getIdentityContract, formatUSDC, GAS_SETTINGS } from '../lib/arcNetwork';
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

  useEffect(() => {
    if (userAddress) {
      loadData();
    }
  }, [userAddress, refreshTrigger]);

  async function loadData() {
    setIsLoading(true);
    try {
      const contract = await getLedgerContract();
      const identity = await getIdentityContract();

      const jobIds = await contract.getUserJobs(userAddress);

      try {
        const profile = await identity.getAgentProfile(userAddress);
        setReputation(Number(profile.reputationScore));
      } catch (e) {
        setReputation(0);
      }

      if (jobIds.length > 0) {
        const details = await contract.getJobDetails(jobIds);
        const sorted = [...details].sort((a, b) => Number(b.id - a.id));
        setJobs(sorted);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
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
    const hash = prompt("Enter deliverable link or IPFS hash:");
    if (!hash) return;
    setActionId(jobId);
    try {
      const ledger = await getLedgerContract();
      const tx = await ledger.submitWork(jobId, hash, { ...GAS_SETTINGS });
      await tx.wait();
      await loadData();
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  async function handleComplete(jobId: bigint) {
    setActionId(jobId);
    try {
      const ledger = await getLedgerContract();
      const tx = await ledger.completeJob(jobId, { ...GAS_SETTINGS });
      await tx.wait();
      await loadData();
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  }

  function getStatusStyle(state: number) {
    switch (state) {
      case JobState.Open: return "bg-white/5 text-gray-400 border-white/10";
      case JobState.Funded: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case JobState.Submitted: return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case JobState.Completed: return "bg-green-500/10 text-green-400 border-green-500/20";
      case JobState.Rejected: return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-white/5 text-gray-500 border-white/5";
    }
  }

  function getStatusLabel(state: number) {
    return JobState[state];
  }

  if (isLoading) return <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>;

  return (
    <div className="space-y-10">
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 rounded-[32px] p-8 text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="relative flex items-center gap-6">
          <div className="w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
            <Award className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Reputation Score</h3>
            <p className="text-6xl font-black tracking-tighter leading-none">{reputation}</p>
          </div>
        </div>
        <Activity className="w-24 h-24 opacity-10 absolute -right-4 -bottom-4 rotate-12" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Terminal className="w-5 h-5 text-indigo-400" />
             <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Active Agentic Jobs</h2>
          </div>
          <div className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping"></div>
        </div>

        <div className="divide-y divide-white/5">
          {jobs.length === 0 ? (
            <div className="p-20 text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">No commercial jobs found.</div>
          ) : (
            jobs.map(job => {
              const isClient = job.client.toLowerCase() === userAddress.toLowerCase();
              const isProvider = job.provider.toLowerCase() === userAddress.toLowerCase();
              const isEvaluator = job.evaluator.toLowerCase() === userAddress.toLowerCase();

              return (
                <div key={job.id.toString()} className="p-8 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex flex-col lg:flex-row justify-between gap-10">
                    <div className="flex-1 space-y-5">
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                          getStatusStyle(Number(job.state))
                        )}>
                          {getStatusLabel(Number(job.state))}
                        </span>
                        <span className="text-[10px] font-mono text-gray-600">ARC_ID_{job.id.toString().padStart(4, '0')}</span>
                      </div>

                      <h4 className="text-xl font-black text-white tracking-tight leading-tight">{job.description}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[10px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">Client</span>
                          <span className="text-indigo-400 font-mono lowercase">{job.client.slice(0,10)}...</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">Provider</span>
                          <span className="text-indigo-400 font-mono lowercase">{job.provider.slice(0,10)}...</span>
                        </div>
                      </div>

                      {job.deliverableHash && (
                        <div className="p-4 bg-white/[0.03] rounded-xl flex items-center justify-between border border-white/5">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            <span className="text-[10px] font-mono text-gray-400 truncate">{job.deliverableHash}</span>
                          </div>
                          <a href={job.deliverableHash} target="_blank" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <ExternalLink className="w-4 h-4 text-indigo-400" />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end justify-between gap-6">
                      <div className="text-right">
                        <div className="text-4xl font-black text-white tracking-tighter leading-none">${formatUSDC(job.budget)}</div>
                        <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-2">Escrow Protected</div>
                      </div>

                      <div className="flex gap-4">
                        {isClient && Number(job.state) === JobState.Open && (
                          <button onClick={() => handleFund(job)} disabled={actionId === job.id} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-indigo-500/20">
                            {actionId === job.id ? 'Processing...' : 'Fund Escrow'}
                          </button>
                        )}
                        {isProvider && Number(job.state) === JobState.Funded && (
                          <button onClick={() => handleSubmit(job.id)} disabled={actionId === job.id} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                            Submit Work
                          </button>
                        )}
                        {isEvaluator && Number(job.state) === JobState.Submitted && (
                          <button onClick={() => handleComplete(job.id)} disabled={actionId === job.id} className="px-6 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                            Approve & Pay
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
