'use client';

import { useSurveyStore } from '@/lib/store/surveyStore';
import { CheckboxCard } from '@/components/ui/CheckboxCard';
import { PRIORIDADES_ADMINISTRACION } from '@/lib/constants';

export function Slide4Prioridades() {
  const { prioridadesAdministracion, togglePrioridadAdministracion } = useSurveyStore();

  return (
    <div className="max-w-lg mx-auto w-full space-y-6">
      <h1 className="font-display text-2xl md:text-4xl font-medium text-ink text-balance">
        ¿Qué le gustaría que haga la nueva administración? Elige todas las que apliquen.
      </h1>

      <div className="space-y-2">
        {PRIORIDADES_ADMINISTRACION.map((p) => (
          <CheckboxCard
            key={p}
            label={p}
            checked={prioridadesAdministracion.includes(p)}
            onToggle={() => togglePrioridadAdministracion(p)}
          />
        ))}
      </div>
    </div>
  );
}
