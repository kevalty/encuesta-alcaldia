-- Corre esto en el SQL Editor de Supabase para agregar la pregunta de nivel
-- de instrucción (estudios) a la tabla surveys_responses que ya tienes creada.
alter table public.surveys_responses
  add column nivel_instruccion text not null default '' check (
    nivel_instruccion in ('', 'Ninguna', 'Primaria', 'Secundaria', 'Superior')
  );
