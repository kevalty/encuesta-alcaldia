'use client';

import { useSurveyStore } from '@/lib/store/surveyStore';
import { PillButton } from '@/components/ui/PillButton';
import { CANALES_COMUNICACION } from '@/lib/constants';

export function Slide4CanalComunicacion() {
  const { canalComunicacion, setCanalComunicacion } = useSurveyStore();

  return (
    <div className="max-w-lg mx-auto w-full space-y-6">
      <h1 className="font-display text-2xl md:text-4xl font-medium text-ink text-balance">
        ¿Por qué medio se informa con mayor frecuencia sobre temas locales y políticos?
      </h1>

      <div className="flex flex-wrap gap-2">
        {CANALES_COMUNICACION.map((c) => (
          <PillButton
            key={c}
            label={c}
            selected={canalComunicacion === c}
            onClick={() => setCanalComunicacion(c)}
          />
        ))}
      </div>
    </div>
  );
}
