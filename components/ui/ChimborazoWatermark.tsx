export function ChimborazoWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M40 170 L140 60 L170 95 L220 30 L260 80 L300 50 L370 170 Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M70 170 L155 85 L180 110 L225 55 L265 100 L305 75 L350 170 Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M100 170 L165 105 L188 122 L228 78 L268 115 L305 100 L330 170 Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
