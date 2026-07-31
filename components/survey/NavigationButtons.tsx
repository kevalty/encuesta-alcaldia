'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  showBack?: boolean;
  nextLabel?: string;
}

export function NavigationButtons({
  onBack,
  onNext,
  nextDisabled = false,
  showBack = true,
  nextLabel = 'Siguiente',
}: NavigationButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 pb-safe bg-bg/95 backdrop-blur-sm border-t border-neutral/15 z-40">
      <div className="max-w-lg mx-auto flex items-center gap-3 px-6 py-4">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-neutral/30 text-ink hover:border-andes/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-andes"
            aria-label="Atrás"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={cn(
            'flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-full font-body font-medium transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-andes focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
            nextDisabled
              ? 'bg-neutral/20 text-neutral cursor-not-allowed'
              : 'bg-andes text-bg hover:bg-andes/90'
          )}
        >
          {nextLabel}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
