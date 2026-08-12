-- Permite que también un usuario logueado (admin) pueda insertar respuestas.
-- Sin esto, probar la encuesta en el mismo navegador donde tienes sesión
-- abierta en /admin falla con "row-level security policy" porque el insert
-- se hace como rol "authenticated", que solo tenía permiso de select/update/delete.
create policy "authenticated_can_insert_responses"
  on public.surveys_responses
  for insert
  to authenticated
  with check (true);
