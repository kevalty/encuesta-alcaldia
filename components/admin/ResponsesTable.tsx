'use client';

import { useState } from 'react';

interface ResponseRow {
  id: string;
  created_at: string;
  parroquia: string;
  edad: string;
  genero: string;
  alcaldia_asistida: string[];
  prefectura_asistida: string[];
  duration_seconds: number;
}

interface ResponsesTableProps {
  rows: ResponseRow[];
}

const PAGE_SIZE = 20;

export function ResponsesTable({ rows }: ResponsesTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="rounded-xl border border-neutral/20 bg-ink/[0.02] p-5">
      <h2 className="font-display text-lg font-medium text-ink mb-4">Últimas respuestas</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="text-left text-neutral border-b border-neutral/20">
              <th className="py-2 pr-4">Fecha</th>
              <th className="py-2 pr-4">Parroquia</th>
              <th className="py-2 pr-4">Edad</th>
              <th className="py-2 pr-4">Género</th>
              <th className="py-2 pr-4">Recordación asistida</th>
              <th className="py-2 pr-4">Duración</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => {
              const asistida = [...r.alcaldia_asistida, ...r.prefectura_asistida].join(', ');
              return (
                <tr key={r.id} className="border-b border-neutral/10">
                  <td className="py-2 pr-4 text-ink">
                    {new Date(r.created_at).toLocaleString('es-EC')}
                  </td>
                  <td className="py-2 pr-4 text-ink">{r.parroquia}</td>
                  <td className="py-2 pr-4 text-ink">{r.edad}</td>
                  <td className="py-2 pr-4 text-ink">{r.genero}</td>
                  <td className="py-2 pr-4 text-ink max-w-xs truncate" title={asistida}>
                    {asistida || '—'}
                  </td>
                  <td className="py-2 pr-4 text-ink">{r.duration_seconds}s</td>
                </tr>
              );
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-neutral">
                  Todavía no hay respuestas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm font-body text-neutral">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="disabled:opacity-40"
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
