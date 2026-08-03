// Silueta lineal de la Torre del Reloj Público (Parque Maldonado, Riobamba).
// Mismo tratamiento minimalista que ChimborazoWatermark: solo trazo, sin relleno.
export function RiobambaTower({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 160"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <line x1="40" y1="8" x2="40" y2="0" stroke="currentColor" strokeWidth="1.5" />
      <path d="M40 0 L44 8 L36 8 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="30" y="8" width="20" height="14" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="15" r="5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="40" y1="15" x2="40" y2="11.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="40" y1="15" x2="42.5" y2="16" stroke="currentColor" strokeWidth="1.2" />
      <path d="M26 22 L54 22 L50 40 L30 40 Z" stroke="currentColor" strokeWidth="1.5" />
      <rect x="22" y="40" width="36" height="70" stroke="currentColor" strokeWidth="1.5" />
      <line x1="22" y1="55" x2="58" y2="55" stroke="currentColor" strokeWidth="1" />
      <line x1="22" y1="70" x2="58" y2="70" stroke="currentColor" strokeWidth="1" />
      <line x1="22" y1="85" x2="58" y2="85" stroke="currentColor" strokeWidth="1" />
      <rect x="34" y="92" width="12" height="18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 140 L70 140 L64 110 L16 110 Z" stroke="currentColor" strokeWidth="1.5" />
      <line x1="4" y1="140" x2="76" y2="140" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
