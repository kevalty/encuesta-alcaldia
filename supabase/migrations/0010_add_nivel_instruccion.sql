-- Nivel de instrucción (estudios). Se agrega en vez del nombre — el cliente
-- pidió quitar el campo de nombre (a la gente no le gusta ponerlo) y agregar
-- este en su lugar. Las columnas nombre/is_possible_duplicate se dejan tal
-- cual en la tabla (ya no se usan desde la app, pero no se eliminan para no
-- perder respuestas ya guardadas con nombre).
alter table public.surveys_responses
  add column nivel_instruccion text not null default '' check (
    nivel_instruccion in ('', 'Ninguna', 'Primaria', 'Secundaria', 'Superior')
  );
