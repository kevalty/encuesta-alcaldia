'use client';

import { useSurveyStore } from '@/lib/store/surveyStore';
import { PillButton } from '@/components/ui/PillButton';
import { PROBLEMAS_PRINCIPALES } from '@/lib/constants';

export function Slide3ProblemaPrincipal() {
  const { problemaPrincipal, setProblemaPrincipal } = useSurveyStore();

  return (
    <div className="max-w-lg mx-auto w-full space-y-6">
      <h1 className="font-display text-2xl md:text-4xl font-medium text-ink text-balance">
        ¿Cuál considera que es el principal problema que afecta hoy al cantón Riobamba?
      </h1>

      <div className="flex flex-wrap gap-2">
        {PROBLEMAS_PRINCIPALES.map((p) => (
          <PillButton
            key={p}
            label={p}
            selected={problemaPrincipal === p}
            onClick={() => setProblemaPrincipal(p)}
          />
        ))}
      </div>
    </div>
  );
}
