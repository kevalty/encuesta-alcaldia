-- Corre esto en el SQL Editor de Supabase para agregar la pregunta de
-- prioridades para la nueva administración (selección múltiple).
alter table public.surveys_responses
  add column prioridades_administracion text[] not null default '{}';
