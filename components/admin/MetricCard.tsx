interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-neutral/20 bg-ink/[0.02] p-5">
      <p className="font-body text-sm text-neutral">{label}</p>
      <p className="font-display text-3xl font-medium text-ink mt-1">{value}</p>
      {hint && <p className="font-body text-xs text-neutral mt-1">{hint}</p>}
    </div>
  );
}
