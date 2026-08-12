'use client';

import { useEffect } from 'react';
import { useSurveyStore } from '@/lib/store/surveyStore';
import { PillButton } from '@/components/ui/PillButton';
import {
  PARROQUIAS_URBANAS,
  PARROQUIAS_RURALES,
  RANGOS_EDAD,
  GENEROS,
  NIVELES_INSTRUCCION,
} from '@/lib/constants';
import type { Parroquia } from '@/types';

export function Slide1Demografia() {
  const {
    parroquia,
    edad,
    genero,
    nivelInstruccion,
    setParroquia,
    setEdad,
    setGenero,
    setNivelInstruccion,
    startTimer,
  } = useSurveyStore();

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  return (
    <div className="max-w-lg mx-auto w-full space-y-8">
      <h1 className="font-display text-2xl md:text-4xl font-medium text-ink text-balance">
        Cuéntanos un poco sobre ti
      </h1>

      <div className="space-y-2">
        <label htmlFor="parroquia" className="text-sm font-body text-neutral">
          Parroquia donde vives
        </label>
        <select
          id="parroquia"
          value={parroquia ?? ''}
          onChange={(e) => setParroquia(e.target.value as Parroquia)}
          className="w-full min-h-[44px] px-4 py-3 text-base font-body bg-transparent border-b-2 border-neutral/40 text-ink focus:outline-none focus:border-andes transition-colors"
        >
          <option value="" disabled>
            Selecciona tu parroquia
          </option>
          <optgroup label="Urbanas">
            {PARROQUIAS_URBANAS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </optgroup>
          <optgroup label="Rurales">
            {PARROQUIAS_RURALES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-body text-neutral">Rango de edad</p>
        <div className="flex flex-wrap gap-2">
          {RANGOS_EDAD.map((e) => (
            <PillButton key={e} label={e} selected={edad === e} onClick={() => setEdad(e)} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-body text-neutral">Género</p>
        <div className="flex flex-wrap gap-2">
          {GENEROS.map((g) => (
            <PillButton key={g} label={g} selected={genero === g} onClick={() => setGenero(g)} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-body text-neutral">Nivel de instrucción</p>
        <div className="flex flex-wrap gap-2">
          {NIVELES_INSTRUCCION.map((n) => (
            <PillButton
              key={n}
              label={n}
              selected={nivelInstruccion === n}
              onClick={() => setNivelInstruccion(n)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
