'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CheckboxCardProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function CheckboxCard({ label, checked, onToggle }: CheckboxCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        'w-full min-h-[44px] flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-andes focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        checked
          ? 'bg-andes/10 border-andes'
          : 'bg-transparent border-neutral/30 hover:border-andes/50'
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center w-5 h-5 rounded-md border shrink-0',
          checked ? 'bg-andes border-andes' : 'border-neutral/50'
        )}
      >
        {checked && <Check size={14} strokeWidth={3} className="text-bg" />}
      </span>
      <span className="font-body text-base text-ink">{label}</span>
    </button>
  );
}
