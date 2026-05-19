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
import { getLedgerContract, getUSDCContract, formatUSDC, GAS_SETTINGS } from '../lib/arcNetwork';

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
      const jobIds = await contract.getUserJobs(userAddress);
      const score = await contract.reputationScore(userAddress);
      setReputation(Number(score));

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
      case JobState.Open: return "bg-gray-100 text-gray-600";
      case JobState.Funded: return "bg-blue-100 text-blue-600 border border-blue-200";
      case JobState.Submitted: return "bg-yellow-100 text-yellow-600 border border-yellow-200";
      case JobState.Completed: return "bg-green-100 text-green-600 border border-green-200";
      case JobState.Rejected: return "bg-red-100 text-red-600 border border-red-200";
      default: return "bg-gray-100 text-gray-500";
    }
  }

  function getStatusLabel(state: number) {
    return JobState[state];
  }

  if (isLoading) return <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest opacity-80">Reputation Score</h3>
            <p className="text-4xl font-black">{reputation}</p>
          </div>
        </div>
        <Activity className="w-12 h-12 opacity-20" />
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">Active Agentic Jobs</h2>
        </div>

        <div className="divide-y divide-gray-50">
          {jobs.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-medium">No commercial jobs found.</div>
          ) : (
            jobs.map(job => {
              const isClient = job.client.toLowerCase() === userAddress.toLowerCase();
              const isProvider = job.provider.toLowerCase() === userAddress.toLowerCase();
              const isEvaluator = job.evaluator.toLowerCase() === userAddress.toLowerCase();

              return (
                <div key={job.id.toString()} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(Number(job.state))}`}>
                          {getStatusLabel(Number(job.state))}
                        </span>
                        <span className="text-xs font-mono text-gray-400">ID: #{job.id.toString().padStart(4, '0')}</span>
                      </div>

                      <h4 className="text-lg font-bold text-gray-900">{job.description}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Client:</span>
                          <span className="text-indigo-600 truncate max-w-[120px]">{job.client}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Provider:</span>
                          <span className="text-indigo-600 truncate max-w-[120px]">{job.provider}</span>
                        </div>
                      </div>

                      {job.deliverableHash && (
                        <div className="p-3 bg-indigo-50 rounded-lg flex items-center justify-between group">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            <span className="text-xs font-mono text-indigo-700 truncate">{job.deliverableHash}</span>
                          </div>
                          <a href={job.deliverableHash} target="_blank" className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end justify-between gap-4">
                      <div className="text-right">
                        <div className="text-3xl font-black text-gray-900 leading-none">${formatUSDC(job.budget)}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Escrowed USDC</div>
                      </div>

                      <div className="flex gap-2">
                        {isClient && Number(job.state) === JobState.Open && (
                          <button onClick={() => handleFund(job)} disabled={actionId === job.id} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-100">
                            {actionId === job.id ? 'Funding...' : 'Fund Escrow'}
                          </button>
                        )}
                        {isProvider && Number(job.state) === JobState.Funded && (
                          <button onClick={() => handleSubmit(job.id)} disabled={actionId === job.id} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-wider">
                            Submit Work
                          </button>
                        )}
                        {isEvaluator && Number(job.state) === JobState.Submitted && (
                          <button onClick={() => handleComplete(job.id)} disabled={actionId === job.id} className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-black uppercase tracking-wider">
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
