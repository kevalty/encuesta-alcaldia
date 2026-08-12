'use client';

import { useSurveyStore } from '@/lib/store/surveyStore';
import { CheckboxCard } from '@/components/ui/CheckboxCard';
import { NINGUNO_DE_LOS_ANTERIORES } from '@/lib/constants';
import type { Candidate } from '@/types';

interface Slide6Props {
  candidates: Candidate[];
}

export function Slide6AlcaldiaAsistida({ candidates }: Slide6Props) {
  const { alcaldiaAsistida, toggleAlcaldiaAsistida } = useSurveyStore();

  return (
    <div className="max-w-lg mx-auto w-full space-y-6">
      <h1 className="font-display text-2xl md:text-4xl font-medium text-ink text-balance">
        De la siguiente lista, ¿a quiénes conoce como candidatos a la Alcaldía de Riobamba?
      </h1>

      <div className="space-y-2">
        {candidates.map((c) => (
          <CheckboxCard
            key={c.id}
            label={c.name}
            checked={alcaldiaAsistida.includes(c.name)}
            onToggle={() => toggleAlcaldiaAsistida(c.name)}
          />
        ))}
        <CheckboxCard
          label={NINGUNO_DE_LOS_ANTERIORES}
          checked={alcaldiaAsistida.includes(NINGUNO_DE_LOS_ANTERIORES)}
          onToggle={() => toggleAlcaldiaAsistida(NINGUNO_DE_LOS_ANTERIORES)}
        />
      </div>
    </div>
  );
}
