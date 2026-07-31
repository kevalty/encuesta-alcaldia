create table public.surveys_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Demografía
  parroquia text not null check (
    parroquia in (
      'Lizarzaburu','Maldonado','Velasco','Veloz','Yaruquíes',
      'Cacha','Calpi','Cubijíes','Flores','Licán','Licto',
      'Pungalá','Punín','Quimiag','San Juan','San Luis'
    )
  ),
  edad text not null check (edad in ('16-20','21-35','36-50','51+')),
  genero text not null check (genero in ('Masculino','Femenino','Otro','Prefiero no decir')),

  -- Recordación espontánea (texto libre)
  alcaldia_espontanea text,
  prefectura_espontanea text,

  -- Recordación asistida (arrays de nombres seleccionados)
  alcaldia_asistida text[] not null default '{}',
  prefectura_asistida text[] not null default '{}',

  -- Antifraude / metadata técnica
  fingerprint text not null,
  ip_hash text,                      -- hash de IP capturada en el server, no la IP en texto plano
  user_agent text,
  duration_seconds integer not null,
  is_valid boolean not null default true,
  invalid_reason text,               -- ej. 'too_fast', 'turnstile_failed', 'duplicate_fingerprint'
  turnstile_verified boolean not null default false
);

comment on table public.surveys_responses is 'Respuestas finales de la encuesta ciudadana. Insertadas únicamente vía Server Action tras validar Turnstile.';

create index idx_surveys_parroquia on public.surveys_responses (parroquia);
create index idx_surveys_created_at on public.surveys_responses (created_at desc);
create index idx_surveys_is_valid on public.surveys_responses (is_valid);
create index idx_surveys_fingerprint on public.surveys_responses (fingerprint);
