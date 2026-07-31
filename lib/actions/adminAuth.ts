'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface AdminLoginResult {
  success: boolean;
  error?: string;
}

export async function adminLogin(email: string, password: string): Promise<AdminLoginResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: 'Credenciales inválidas' };
  }

  return { success: true };
}

export async function adminLogout(): Promise<void> {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
}
