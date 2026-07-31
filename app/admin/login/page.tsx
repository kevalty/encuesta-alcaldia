'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { adminLogin } from '@/lib/actions/adminAuth';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await adminLogin(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/admin/dashboard');
      router.refresh();
    } else {
      toast.error(result.error ?? 'No se pudo iniciar sesión');
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div className="text-center space-y-1">
          <h1 className="font-display text-2xl font-medium text-ink">Panel de administración</h1>
          <p className="font-body text-sm text-neutral">Encuesta Ciudadana 2027</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-body text-neutral">
            Correo
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[44px] px-4 py-3 text-base font-body bg-transparent border-b-2 border-neutral/40 text-ink focus:outline-none focus:border-andes transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-body text-neutral">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full min-h-[44px] px-4 py-3 text-base font-body bg-transparent border-b-2 border-neutral/40 text-ink focus:outline-none focus:border-andes transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-full bg-andes text-bg font-body font-medium disabled:opacity-60 hover:enabled:bg-andes/90 transition-colors"
        >
          {loading ? <Spinner size={18} /> : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  );
}
