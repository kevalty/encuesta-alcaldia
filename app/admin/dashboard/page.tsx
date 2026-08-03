import { createServerSupabaseClient } from '@/lib/supabase/server';
import { MetricCard } from '@/components/admin/MetricCard';
import { RecordacionBarChart } from '@/components/admin/RecordacionBarChart';
import { DemografiaPieChart } from '@/components/admin/DemografiaPieChart';
import { ResponsesTable } from '@/components/admin/ResponsesTable';
import { ExportCsvButton } from '@/components/admin/ExportCsvButton';
import { LogoutButton } from './LogoutButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();

  const [
    { data: metricas },
    { data: recordacionAlcaldia },
    { data: recordacionPrefectura },
    { data: demografiaParroquia },
    { data: demografiaEdad },
    { data: responses },
  ] = await Promise.all([
    supabase.from('vw_metricas_globales').select('*').single(),
    supabase.from('vw_recordacion_alcaldia').select('*'),
    supabase.from('vw_recordacion_prefectura').select('*'),
    supabase.from('vw_demografia_parroquia').select('*'),
    supabase.from('vw_demografia_edad').select('*'),
    supabase
      .from('surveys_responses')
      .select(
        'id, created_at, nombre, parroquia, edad, genero, alcaldia_espontanea, prefectura_espontanea, alcaldia_asistida, prefectura_asistida, duration_seconds, is_valid, is_possible_duplicate'
      )
      .eq('is_valid', true)
      .order('created_at', { ascending: false }),
  ]);

  const totalRespuestas = metricas?.total_respuestas ?? 0;
  const respuestasValidas = metricas?.respuestas_validas ?? 0;
  const pctValidas = totalRespuestas > 0 ? Math.round((respuestasValidas / totalRespuestas) * 100) : 0;
  const duracionPromedio = metricas?.duracion_promedio_seg ?? 0;
  const posiblesDuplicados = (responses ?? []).filter((r) => r.is_possible_duplicate).length;

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-ink">
            Dashboard — Encuesta Ciudadana 2027
          </h1>
          <p className="font-body text-sm text-neutral">Riobamba y Chimborazo</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard label="Total de respuestas" value={totalRespuestas} />
        <MetricCard label="Respuestas válidas" value={`${pctValidas}%`} hint={`${respuestasValidas} de ${totalRespuestas}`} />
        <MetricCard label="Duración promedio" value={`${duracionPromedio}s`} />
        <MetricCard label="Posibles duplicados" value={posiblesDuplicados} hint="Mismo nombre, revisar" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecordacionBarChart
          alcaldia={recordacionAlcaldia ?? []}
          prefectura={recordacionPrefectura ?? []}
        />
        <DemografiaPieChart porParroquia={demografiaParroquia ?? []} porEdad={demografiaEdad ?? []} />
      </div>

      <div className="flex justify-end">
        <ExportCsvButton rows={responses ?? []} />
      </div>

      <ResponsesTable rows={responses ?? []} />
    </main>
  );
}
