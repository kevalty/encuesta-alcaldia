'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { adminLogout } from '@/lib/actions/adminAuth';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await adminLogout();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full border border-neutral/30 text-ink font-body text-sm hover:border-andes/50 transition-colors"
    >
      <LogOut size={16} />
      Cerrar sesión
    </button>
  );
}
