'use client';

import { useState, useCallback } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { toast } from 'sonner';
import { PartyPopper, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSurveyStore } from '@/lib/store/surveyStore';
import { submitSurvey } from '@/lib/actions/submitSurvey';
import { fullSubmitSchema } from '@/lib/validations/surveySchemas';
import { HAS_VOTED_COOKIE, HAS_VOTED_SESSION_KEY, TESTING_MODE } from '@/lib/constants';
import { Spinner } from '@/components/ui/Spinner';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

function markCompletedLocally() {
  try {
    sessionStorage.setItem(HAS_VOTED_SESSION_KEY, 'true');
  } catch {
    // sessionStorage no disponible (modo privado estricto) — la cookie basta como respaldo
  }
  const maxAgeSeconds = 60 * 60 * 24 * 180;
  document.cookie = `${HAS_VOTED_COOKIE}=true; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
}

function launchConfetti() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#C9A227', '#2F4858', '#8B8B82'],
  });
}

export function Slide8Finalizacion() {
  const store = useSurveyStore();
  const [state, setState] = useState<SubmitState>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const handleSubmit = useCallback(async () => {
    if ((!turnstileToken && !TESTING_MODE) || state === 'submitting') return;
    setState('submitting');

    const durationSeconds = store.startedAt
      ? Math.round((Date.now() - store.startedAt) / 1000)
      : 0;

    const payload = fullSubmitSchema.safeParse({
      parroquia: store.parroquia,
      edad: store.edad,
      genero: store.genero,
      nivel_instruccion: store.nivelInstruccion,
      estado_animo: store.estadoAnimo,
      problema_principal: store.problemaPrincipal,
      prioridades_administracion: store.prioridadesAdministracion,
      canal_comunicacion: store.canalComunicacion,
      alcaldia_asistida: store.alcaldiaAsistida,
      prefectura_asistida: store.prefecturaAsistida,
      duration_seconds: durationSeconds,
      turnstile_token: TESTING_MODE ? 'testing_mode' : turnstileToken,
    });

    if (!payload.success) {
      setState('error');
      toast.error('Faltan datos por completar. Revisa las preguntas anteriores.');
      return;
    }

    const result = await submitSurvey(payload.data);

    if (result.success) {
      setState('success');
      markCompletedLocally();
      launchConfetti();
    } else {
      setState('error');
      toast.error('No pudimos enviar tu respuesta, inténtalo de nuevo.');
    }
  }, [turnstileToken, state, store]);

  const whatsappText = encodeURIComponent(
    'Acabo de participar en la Encuesta Ciudadana 2027 de Riobamba y Chimborazo. ¡Participa tú también!'
  );

  if (state === 'success') {
    return (
      <div className="max-w-lg mx-auto w-full space-y-6 text-center">
        <PartyPopper className="mx-auto text-paja" size={48} />
        <h1 className="font-display text-2xl md:text-4xl font-medium text-ink text-balance">
          ¡Gracias por participar!
        </h1>
        <p className="font-body text-neutral">
          Tu respuesta fue registrada. Esta es una encuesta ciudadana independiente, no oficial ni vinculante.
        </p>
        <a
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-andes text-bg font-body font-medium hover:bg-andes/90 transition-colors"
        >
          <MessageCircle size={18} />
          Compartir por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto w-full space-y-6 text-center">
      <h1 className="font-display text-2xl md:text-4xl font-medium text-ink text-balance">
        ¡Ya casi terminamos!
      </h1>
      <p className="font-body text-neutral">
        {TESTING_MODE ? 'Modo prueba activo: sin verificación.' : 'Confirma que no eres un robot y envía tus respuestas.'}
      </p>

      {!TESTING_MODE && (
        <div className="flex justify-center">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
            options={{ theme: 'light', size: 'normal' }}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken('')}
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={(!turnstileToken && !TESTING_MODE) || state === 'submitting'}
        className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-full bg-andes text-bg font-body font-medium disabled:bg-neutral/20 disabled:text-neutral disabled:cursor-not-allowed hover:enabled:bg-andes/90 transition-colors"
      >
        {state === 'submitting' ? <Spinner size={18} /> : 'Enviar respuestas'}
      </button>

      {state === 'error' && (
        <p className="text-sm font-body text-volcan">
          No pudimos enviar tu respuesta. Intenta de nuevo.
        </p>
      )}
    </div>
  );
}
