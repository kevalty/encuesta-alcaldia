'use server';

import { headers } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { fullSubmitSchema, type FullSubmitInput } from '@/lib/validations/surveySchemas';
import { verifyTurnstile } from './verifyTurnstile';
import { hashFingerprint } from '@/lib/utils/antifraude';
import type { SubmitResult } from '@/types';

export async function submitSurvey(input: FullSubmitInput): Promise<SubmitResult> {
  const parsed = fullSubmitSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Datos inválidos' };
  }

  const turnstileOk = await verifyTurnstile(parsed.data.turnstile_token);
  if (!turnstileOk) {
    return { success: false, error: 'Verificación de seguridad fallida' };
  }

  const headersList = headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const userAgent = headersList.get('user-agent') ?? 'unknown';
  const ipHash = hashFingerprint(ip, userAgent);

  const isTooFast = parsed.data.duration_seconds < 5;

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('surveys_responses').insert({
    parroquia: parsed.data.parroquia,
    edad: parsed.data.edad,
    genero: parsed.data.genero,
    nivel_instruccion: parsed.data.nivel_instruccion,
    estado_animo: parsed.data.estado_animo,
    problema_principal: parsed.data.problema_principal,
    prioridades_administracion: parsed.data.prioridades_administracion,
    canal_comunicacion: parsed.data.canal_comunicacion,
    alcaldia_espontanea: parsed.data.alcaldia_espontanea || null,
    prefectura_espontanea: parsed.data.prefectura_espontanea || null,
    alcaldia_asistida: parsed.data.alcaldia_asistida,
    prefectura_asistida: parsed.data.prefectura_asistida,
    fingerprint: ipHash,
    ip_hash: ipHash,
    user_agent: userAgent,
    duration_seconds: parsed.data.duration_seconds,
    is_valid: !isTooFast,
    invalid_reason: isTooFast ? 'too_fast' : null,
    turnstile_verified: true,
  });

  if (error) {
    console.error('submitSurvey insert error:', error.message);
    return { success: false, error: 'No se pudo guardar tu respuesta' };
  }

  return { success: true };
}
