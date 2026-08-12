-- Corre esto en el SQL Editor de Supabase para arreglar el error
-- "new row violates row-level security policy for table surveys_responses"
-- que sale al probar la encuesta estando logueado como admin en el mismo navegador.
create policy "authenticated_can_insert_responses"
  on public.surveys_responses
  for insert
  to authenticated
  with check (true);
