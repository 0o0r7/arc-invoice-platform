import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && key ? createClient(url, key) : null;

export async function upsertUserScore(address: string, score: number, metrics: Record<string, unknown>) {
  if (!supabase) return { error: 'supabase_not_configured' };
  const { error } = await supabase.from('user_scores').upsert(
    {
      address,
      score,
      metrics,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'address' }
  );
  return { error };
}

export async function getUserScore(address: string) {
  if (!supabase) return { data: null, error: 'supabase_not_configured' };
  const { data, error } = await supabase.from('user_scores').select('*').eq('address', address).maybeSingle();
  return { data, error };
}
