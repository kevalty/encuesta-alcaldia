-- Corre esto en el SQL Editor de Supabase para agregar las 3 preguntas nuevas
-- de clima ciudadano a la tabla surveys_responses que ya tienes creada.
alter table public.surveys_responses
  add column estado_animo text not null default '' check (
    estado_animo in (
      '', 'Preocupación', 'Esperanza', 'Desconfianza',
      'Molestia', 'Optimismo moderado', 'Indiferencia'
    )
  ),
  add column problema_principal text not null default '' check (
    problema_principal in (
      '', 'Seguridad', 'Empleo', 'Movilidad', 'Servicios básicos',
      'Desorden municipal/corrupción', 'Comercio', 'Ambiente/limpieza', 'Otro'
    )
  ),
  add column canal_comunicacion text not null default '' check (
    canal_comunicacion in (
      '', 'Facebook/Instagram', 'WhatsApp', 'Radio', 'TikTok',
      'Medios digitales', 'Televisión local', 'Reuniones', 'Familiares/amigos'
    )
  );
