'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentSlide: number;
  totalSlides?: number;
}

export function ProgressBar({ currentSlide, totalSlides = 6 }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (currentSlide / totalSlides) * 100));

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-neutral/20 z-50">
      <motion.div
        className="h-full bg-paja"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
