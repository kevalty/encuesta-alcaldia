-- Variables complementarias de clima ciudadano (estado de ánimo, problema
-- principal percibido, canal de comunicación preferido). Opciones tomadas del
-- informe de fotografía electoral SAV (julio 2026) para poder comparar lecturas.
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
