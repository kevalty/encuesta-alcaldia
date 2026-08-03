'use client';

import { useMemo } from 'react';
import { useSurveyStore } from '@/lib/store/surveyStore';
import { slide1Schema, slide2Schema, slide3Schema } from '@/lib/validations/surveySchemas';
import { ProgressBar } from '@/components/survey/ProgressBar';
import { SlideWrapper } from '@/components/survey/SlideWrapper';
import { NavigationButtons } from '@/components/survey/NavigationButtons';
import { Slide1Demografia } from '@/components/survey/Slide1Demografia';
import { Slide2AlcaldiaEspontanea } from '@/components/survey/Slide2AlcaldiaEspontanea';
import { Slide3PrefecturaEspontanea } from '@/components/survey/Slide3PrefecturaEspontanea';
import { Slide4AlcaldiaAsistida } from '@/components/survey/Slide4AlcaldiaAsistida';
import { Slide5PrefecturaAsistida } from '@/components/survey/Slide5PrefecturaAsistida';
import { Slide6Finalizacion } from '@/components/survey/Slide6Finalizacion';
import { RiobambaTower } from '@/components/ui/RiobambaTower';
import type { Candidate } from '@/types';

interface EncuestaFlowProps {
  alcaldiaCandidatos: Candidate[];
  prefecturaCandidatos: Candidate[];
}

export function EncuestaFlow({ alcaldiaCandidatos, prefecturaCandidatos }: EncuestaFlowProps) {
  const store = useSurveyStore();
  const { currentSlide, direction, goNext, goBack } = store;

  const nextDisabled = useMemo(() => {
    if (currentSlide === 1) {
      return !slide1Schema.safeParse({
        nombre: store.nombre,
        parroquia: store.parroquia,
        edad: store.edad,
        genero: store.genero,
      }).success;
    }
    if (currentSlide === 2) {
      return !slide2Schema.safeParse({ alcaldia_espontanea: store.alcaldiaEspontanea }).success;
    }
    if (currentSlide === 3) {
      return !slide3Schema.safeParse({ prefectura_espontanea: store.prefecturaEspontanea }).success;
    }
    return false;
  }, [currentSlide, store]);

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div className="absolute inset-0 bg-grid-riobamba opacity-[0.03] pointer-events-none" />
      <div className="hidden lg:flex items-center gap-2 fixed top-6 left-8 z-30 text-neutral pointer-events-none">
        <RiobambaTower className="h-7 w-auto text-andes/50" />
        <span className="font-body text-xs tracking-widest uppercase">Encuesta Ciudadana 2027</span>
      </div>
      <ProgressBar currentSlide={currentSlide} />
      <SlideWrapper slideKey={currentSlide} direction={direction}>
        {currentSlide === 1 && <Slide1Demografia />}
        {currentSlide === 2 && <Slide2AlcaldiaEspontanea />}
        {currentSlide === 3 && <Slide3PrefecturaEspontanea />}
        {currentSlide === 4 && <Slide4AlcaldiaAsistida candidates={alcaldiaCandidatos} />}
        {currentSlide === 5 && <Slide5PrefecturaAsistida candidates={prefecturaCandidatos} />}
        {currentSlide === 6 && <Slide6Finalizacion />}
      </SlideWrapper>
      {currentSlide < 6 && (
        <NavigationButtons
          onBack={currentSlide > 1 ? goBack : undefined}
          showBack={currentSlide > 1}
          onNext={goNext}
          nextDisabled={nextDisabled}
        />
      )}
    </main>
  );
}
