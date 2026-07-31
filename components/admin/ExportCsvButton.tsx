'use client';

import { Download } from 'lucide-react';
import { exportToCsv } from '@/lib/utils/csvExport';

interface ExportCsvButtonProps {
  rows: Record<string, unknown>[];
}

export function ExportCsvButton({ rows }: ExportCsvButtonProps) {
  return (
    <button
      type="button"
      onClick={() => exportToCsv(rows, `encuesta-riobamba-2027-${new Date().toISOString().slice(0, 10)}.csv`)}
      className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full border border-andes text-andes font-body text-sm font-medium hover:bg-andes/10 transition-colors"
    >
      <Download size={16} />
      Exportar CSV
    </button>
  );
}
