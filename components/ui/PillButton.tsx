'use client';

import { cn } from '@/lib/utils/cn';

interface PillButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function PillButton({ label, selected, onClick }: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'min-h-[44px] px-5 py-2.5 rounded-full border text-base font-body transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-andes focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        selected
          ? 'bg-andes border-andes text-bg'
          : 'bg-transparent border-neutral/40 text-ink hover:border-andes/60'
      )}
    >
      {label}
    </button>
  );
}
