// Fingerprint ligero de navegador (no criptográfico, solo antifraude casual).
// El identificador "serio" para la fila en `surveys_responses` se calcula en el
// server a partir de IP+UA (ver lib/utils/antifraude.ts) — esto es un complemento
// puramente client-side, útil solo para logs de debugging si hace falta.
export function getBrowserFingerprint(): string {
  if (typeof window === 'undefined') return 'server';
  const parts = [
    navigator.userAgent,
    navigator.language,
    String(screen.width),
    String(screen.height),
    String(new Date().getTimezoneOffset()),
  ];
  return parts.join('|');
}
