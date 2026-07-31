'use client';

import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface RecordacionRow {
  candidate_name: string;
  menciones_espontaneas: number;
  menciones_asistidas: number;
}

interface RecordacionBarChartProps {
  alcaldia: RecordacionRow[];
  prefectura: RecordacionRow[];
}

export function RecordacionBarChart({ alcaldia, prefectura }: RecordacionBarChartProps) {
  const [tab, setTab] = useState<'alcaldia' | 'prefectura'>('alcaldia');
  const data = tab === 'alcaldia' ? alcaldia : prefectura;

  return (
    <div className="rounded-xl border border-neutral/20 bg-ink/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-medium text-ink">Recordación de candidatos</h2>
        <div className="flex gap-1 rounded-full border border-neutral/30 p-1">
          <button
            type="button"
            onClick={() => setTab('alcaldia')}
            className={`px-3 py-1 rounded-full text-xs font-body ${tab === 'alcaldia' ? 'bg-andes text-bg' : 'text-neutral'}`}
          >
            Alcaldía
          </button>
          <button
            type="button"
            onClick={() => setTab('prefectura')}
            className={`px-3 py-1 rounded-full text-xs font-body ${tab === 'prefectura' ? 'bg-andes text-bg' : 'text-neutral'}`}
          >
            Prefectura
          </button>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#8B8B8220" />
            <XAxis dataKey="candidate_name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="menciones_espontaneas" name="Espontánea" fill="#2F4858" />
            <Bar dataKey="menciones_asistidas" name="Asistida" fill="#C9A227" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
