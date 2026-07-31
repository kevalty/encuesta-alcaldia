alter table public.surveys_responses enable row level security;
alter table public.candidates enable row level security;

-- surveys_responses: cualquiera (anon) puede insertar, nadie anónimo puede leer
create policy "anon_can_insert_responses"
  on public.surveys_responses
  for insert
  to anon
  with check (true);

create policy "authenticated_can_select_responses"
  on public.surveys_responses
  for select
  to authenticated
  using (true);

create policy "authenticated_can_update_responses"
  on public.surveys_responses
  for update
  to authenticated
  using (true);

create policy "authenticated_can_delete_responses"
  on public.surveys_responses
  for delete
  to authenticated
  using (true);

-- candidates: lectura pública (para poblar los checkboxes), escritura solo autenticado
create policy "anyone_can_read_active_candidates"
  on public.candidates
  for select
  to anon, authenticated
  using (is_active = true);

create policy "authenticated_can_manage_candidates"
  on public.candidates
  for all
  to authenticated
  using (true)
  with check (true);
