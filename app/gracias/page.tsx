import Link from 'next/link';
import { PartyPopper } from 'lucide-react';
import { ChimborazoWatermark } from '@/components/ui/ChimborazoWatermark';

export default function GraciasPage({
  searchParams,
}: {
  searchParams: { ya?: string };
}) {
  const yaVoto = searchParams.ya === '1';

  return (
    <main className="relative min-h-dvh flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      <ChimborazoWatermark className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] max-w-none text-neutral/30 pointer-events-none" />
      <div className="relative z-10 max-w-md space-y-4">
        <PartyPopper className="mx-auto text-paja" size={48} />
        <h1 className="font-display text-2xl md:text-4xl font-medium text-ink text-balance">
          {yaVoto ? 'Ya registramos tu participación, ¡gracias!' : '¡Gracias por participar!'}
        </h1>
        <p className="font-body text-neutral">
          Esta es una encuesta ciudadana independiente sobre la Alcaldía de Riobamba y la
          Prefectura de Chimborazo. No es un sistema de votación ni un instrumento oficial del CNE.
        </p>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center px-6 py-3 rounded-full border border-andes text-andes font-body font-medium hover:bg-andes/10 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
