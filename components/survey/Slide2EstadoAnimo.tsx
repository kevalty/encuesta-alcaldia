'use client';

import { useSurveyStore } from '@/lib/store/surveyStore';
import { PillButton } from '@/components/ui/PillButton';
import { ESTADOS_ANIMO } from '@/lib/constants';

export function Slide2EstadoAnimo() {
  const { estadoAnimo, setEstadoAnimo } = useSurveyStore();

  return (
    <div className="max-w-lg mx-auto w-full space-y-6">
      <h1 className="font-display text-2xl md:text-4xl font-medium text-ink text-balance">
        Pensando en la situación actual de Riobamba, ¿cuál de estas palabras describe mejor
        cómo se siente?
      </h1>

      <div className="flex flex-wrap gap-2">
        {ESTADOS_ANIMO.map((e) => (
          <PillButton key={e} label={e} selected={estadoAnimo === e} onClick={() => setEstadoAnimo(e)} />
        ))}
      </div>
    </div>
  );
}
