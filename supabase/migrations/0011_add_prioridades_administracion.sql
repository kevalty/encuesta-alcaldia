-- Prioridades para la nueva administración (selección múltiple). Igual que
-- alcaldia_asistida/prefectura_asistida, sin CHECK sobre el contenido del
-- array — la validación de opciones válidas vive en el schema Zod del cliente.
alter table public.surveys_responses
  add column prioridades_administracion text[] not null default '{}';
