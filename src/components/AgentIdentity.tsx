import { useState, useEffect } from 'react';
import { User, Shield, Check, Loader2, Award } from 'lucide-react';
import { getIdentityContract, GAS_SETTINGS } from '../lib/arcNetwork';
import { cn } from '../lib/utils';

export default function AgentIdentity({ userAddress }: { userAddress: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userAddress) loadProfile();
  }, [userAddress]);

  async function loadProfile() {
    setIsLoading(true);
    try {
      const identity = await getIdentityContract();
      const data = await identity.getAgentProfile(userAddress);
      if (data.isActive) {
        setProfile({
          name: data.name,
          score: Number(data.reputationScore),
          jobs: Number(data.totalJobsCompleted)
        });
      }
    } catch (e) {
      console.log("No profile found");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const identity = await getIdentityContract();
      const tx = await identity.registerAgent(name, "https://ipfs.io/ipfs/QmExample...", { ...GAS_SETTINGS });
      await tx.wait();
      await loadProfile();
    } catch (e) {
      console.error(e);
      alert("Registration failed");
    } finally {
      setIsRegistering(false);
    }
  }

  if (isLoading) return null;

  if (profile) {
    return (
      <div className="glass-card p-6 flex items-center justify-between group">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
            <Check className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">{profile.name}</h3>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Verified ARC Agent</p>
          </div>
        </div>
        <div className="text-right">
           <div className="flex items-center gap-2 justify-end">
             <Award className="w-4 h-4 text-indigo-400" />
             <span className="text-xl font-black text-white">{profile.score}</span>
           </div>
           <p className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">Reputation Score</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
          <Shield className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Agent Registration</h3>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Register for on-chain reputation</p>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Agent / Organization Name"
            required
            className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl focus:border-indigo-500/50 focus:ring-0 transition-all text-sm text-white placeholder:text-gray-700"
          />
        </div>
        <button
          type="submit"
          disabled={isRegistering}
          className="w-full py-4 bg-white/5 text-white rounded-2xl hover:bg-white/10 border border-white/10 transition-all font-black uppercase tracking-widest text-[10px] disabled:opacity-50"
        >
          {isRegistering ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Verifiable Identity'}
        </button>
      </form>
    </div>
  );
}
