'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

export const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

interface SlideWrapperProps {
  slideKey: number;
  direction: number;
  children: ReactNode;
}

export function SlideWrapper({ slideKey, direction, children }: SlideWrapperProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={slideKey}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-dvh w-full flex flex-col justify-center px-6 py-24"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
