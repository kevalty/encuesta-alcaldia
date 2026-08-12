import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { HAS_VOTED_COOKIE, TESTING_MODE } from '@/lib/constants';
import { EncuestaFlow } from './EncuestaFlow';
import type { Candidate } from '@/types';

export default async function EncuestaPage() {
  const cookieStore = cookies();
  if (!TESTING_MODE && cookieStore.get(HAS_VOTED_COOKIE)?.value === 'true') {
    redirect('/gracias?ya=1');
  }

  const supabase = createServerSupabaseClient();
  const { data: candidates } = await supabase
    .from('candidates')
    .select('id, name, dignity, is_active, display_order')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const alcaldiaCandidatos = (candidates ?? []).filter(
    (c) => c.dignity === 'alcaldia_riobamba'
  ) as Candidate[];
  const prefecturaCandidatos = (candidates ?? []).filter(
    (c) => c.dignity === 'prefectura_chimborazo'
  ) as Candidate[];

  return (
    <EncuestaFlow alcaldiaCandidatos={alcaldiaCandidatos} prefecturaCandidatos={prefecturaCandidatos} />
  );
}
