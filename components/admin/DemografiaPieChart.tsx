'use client';

import { useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#2F4858', '#C9A227', '#7A2E2E', '#8B8B82', '#5C7A8A', '#B8935A', '#3D5A6C', '#A69A6E'];

interface DemografiaPieChartProps {
  porParroquia: { parroquia: string; total: number }[];
  porEdad: { edad: string; total: number }[];
}

export function DemografiaPieChart({ porParroquia, porEdad }: DemografiaPieChartProps) {
  const [tab, setTab] = useState<'parroquia' | 'edad'>('parroquia');
  const data =
    tab === 'parroquia'
      ? porParroquia.map((d) => ({ name: d.parroquia, value: d.total }))
      : porEdad.map((d) => ({ name: d.edad, value: d.total }));

  return (
    <div className="rounded-xl border border-neutral/20 bg-ink/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-medium text-ink">Demografía</h2>
        <div className="flex gap-1 rounded-full border border-neutral/30 p-1">
          <button
            type="button"
            onClick={() => setTab('parroquia')}
            className={`px-3 py-1 rounded-full text-xs font-body ${tab === 'parroquia' ? 'bg-andes text-bg' : 'text-neutral'}`}
          >
            Parroquia
          </button>
          <button
            type="button"
            onClick={() => setTab('edad')}
            className={`px-3 py-1 rounded-full text-xs font-body ${tab === 'edad' ? 'bg-andes text-bg' : 'text-neutral'}`}
          >
            Edad
          </button>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
