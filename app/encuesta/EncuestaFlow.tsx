'use client';

import { useMemo } from 'react';
import { useSurveyStore } from '@/lib/store/surveyStore';
import { slide1Schema, slide2Schema, slide3Schema, slide5Schema } from '@/lib/validations/surveySchemas';
import { ProgressBar } from '@/components/survey/ProgressBar';
import { SlideWrapper } from '@/components/survey/SlideWrapper';
import { NavigationButtons } from '@/components/survey/NavigationButtons';
import { Slide1Demografia } from '@/components/survey/Slide1Demografia';
import { Slide2EstadoAnimo } from '@/components/survey/Slide2EstadoAnimo';
import { Slide3ProblemaPrincipal } from '@/components/survey/Slide3ProblemaPrincipal';
import { Slide4Prioridades } from '@/components/survey/Slide4Prioridades';
import { Slide5CanalComunicacion } from '@/components/survey/Slide5CanalComunicacion';
import { Slide6AlcaldiaAsistida } from '@/components/survey/Slide6AlcaldiaAsistida';
import { Slide7PrefecturaAsistida } from '@/components/survey/Slide7PrefecturaAsistida';
import { Slide8Finalizacion } from '@/components/survey/Slide8Finalizacion';
import { RiobambaTower } from '@/components/ui/RiobambaTower';
import type { Candidate } from '@/types';

const TOTAL_SLIDES = 8;

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
        parroquia: store.parroquia,
        edad: store.edad,
        genero: store.genero,
        nivel_instruccion: store.nivelInstruccion,
      }).success;
    }
    if (currentSlide === 2) {
      return !slide2Schema.safeParse({ estado_animo: store.estadoAnimo }).success;
    }
    if (currentSlide === 3) {
      return !slide3Schema.safeParse({ problema_principal: store.problemaPrincipal }).success;
    }
    if (currentSlide === 5) {
      return !slide5Schema.safeParse({ canal_comunicacion: store.canalComunicacion }).success;
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
      <ProgressBar currentSlide={currentSlide} totalSlides={TOTAL_SLIDES} />
      <SlideWrapper slideKey={currentSlide} direction={direction}>
        {currentSlide === 1 && <Slide1Demografia />}
        {currentSlide === 2 && <Slide2EstadoAnimo />}
        {currentSlide === 3 && <Slide3ProblemaPrincipal />}
        {currentSlide === 4 && <Slide4Prioridades />}
        {currentSlide === 5 && <Slide5CanalComunicacion />}
        {currentSlide === 6 && <Slide6AlcaldiaAsistida candidates={alcaldiaCandidatos} />}
        {currentSlide === 7 && <Slide7PrefecturaAsistida candidates={prefecturaCandidatos} />}
        {currentSlide === 8 && <Slide8Finalizacion />}
      </SlideWrapper>
      {currentSlide < TOTAL_SLIDES && (
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
