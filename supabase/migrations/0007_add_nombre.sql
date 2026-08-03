-- Agrega identificación por nombre (obligatorio) y marca de posible duplicado.
-- Un nombre repetido NO bloquea el envío (dos personas reales pueden compartir
-- nombre) — se guarda igual y queda marcado para revisión manual en el dashboard.
alter table public.surveys_responses
  add column nombre text not null default '',
  add column is_possible_duplicate boolean not null default false;

-- Índice case-insensitive para que el chequeo de duplicados en submitSurvey sea rápido.
create index idx_surveys_nombre_lower on public.surveys_responses (lower(nombre));
