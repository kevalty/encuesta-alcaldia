import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ChimborazoWatermark } from '@/components/ui/ChimborazoWatermark';

export default function Home() {
  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      <ChimborazoWatermark className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] max-w-none text-neutral/30 pointer-events-none" />

      <div className="relative z-10 max-w-lg space-y-6">
        <p className="font-body text-sm uppercase tracking-widest text-paja">
          Riobamba &amp; Chimborazo · 2027
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-medium text-ink text-balance">
          Encuesta Ciudadana Independiente
        </h1>
        <p className="font-body text-base text-neutral text-balance">
          Ayúdanos a medir el pulso ciudadano de cara a la Alcaldía de Riobamba y la Prefectura
          de Chimborazo. Toma menos de 2 minutos.
        </p>

        <div className="text-left bg-ink/[0.03] border border-neutral/20 rounded-xl p-4">
          <p className="font-body text-xs text-neutral leading-relaxed">
            Tus respuestas son anónimas y se usan solo con fines estadísticos. Esta es una
            encuesta ciudadana independiente, no vinculante: no es un sistema de votación, no
            reemplaza ni simula al CNE.
          </p>
        </div>

        <Link
          href="/encuesta"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 px-8 py-3 rounded-full bg-andes text-bg font-body font-medium hover:bg-andes/90 transition-colors"
        >
          Empezar encuesta
          <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  );
}
