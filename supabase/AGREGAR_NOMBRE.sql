-- Corre esto en el SQL Editor de Supabase para agregar el campo "nombre"
-- a la tabla surveys_responses que ya tienes creada.
alter table public.surveys_responses
  add column nombre text not null default '',
  add column is_possible_duplicate boolean not null default false;

create index idx_surveys_nombre_lower on public.surveys_responses (lower(nombre));
