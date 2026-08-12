'use client';

import { useSurveyStore } from '@/lib/store/surveyStore';
import { TextFieldLarge } from '@/components/ui/TextFieldLarge';

export function Slide6PrefecturaEspontanea() {
  const { prefecturaEspontanea, setPrefecturaEspontanea } = useSurveyStore();

  return (
    <div className="max-w-lg mx-auto w-full space-y-6">
      <h1 className="font-display text-2xl md:text-4xl font-medium text-ink text-balance">
        Sin mirar ninguna lista, ¿qué candidato(s) a la Prefectura de Chimborazo recuerda?
      </h1>

      <TextFieldLarge
        value={prefecturaEspontanea}
        onChange={setPrefecturaEspontanea}
        placeholder="Escribe el nombre que recuerdes..."
        maxLength={200}
      />

      <p className="text-sm font-body text-neutral">
        Si no recuerdas ninguno, puedes dejarlo en blanco.
      </p>
    </div>
  );
}
