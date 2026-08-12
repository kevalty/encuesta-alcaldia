-- ============================================================================
-- Encuesta Ciudadana 2027 — Riobamba y Chimborazo
-- Script combinado de las 6 migraciones (supabase/migrations/0001..0006).
-- Pega TODO este archivo en el SQL Editor de Supabase y dale "Run" una sola vez.
-- ============================================================================

-- 0001_init_extensions.sql
create extension if not exists "pgcrypto";

-- 0002_create_candidates.sql
create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  dignity text not null check (dignity in ('alcaldia_riobamba', 'prefectura_chimborazo')),
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.candidates is 'Candidatos precargados para las preguntas de recordación asistida. Actualizar cuando el CNE oficialice las candidaturas.';

-- 0003_create_surveys_responses.sql
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

-- 0004_rls_policies.sql
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

-- 0005_views_dashboard.sql
create or replace view public.vw_recordacion_alcaldia as
select
  candidate_name,
  count(*) filter (where source = 'espontanea') as menciones_espontaneas,
  count(*) filter (where source = 'asistida') as menciones_asistidas
from (
  select unnest(string_to_array(alcaldia_espontanea, ',')) as candidate_name, 'espontanea' as source
  from public.surveys_responses where is_valid = true and alcaldia_espontanea is not null
  union all
  select unnest(alcaldia_asistida) as candidate_name, 'asistida' as source
  from public.surveys_responses where is_valid = true
) sub
group by candidate_name;

-- Análoga a vw_recordacion_alcaldia para la Prefectura de Chimborazo (necesaria para
-- el selector de pestañas Alcaldía/Prefectura del dashboard, ver §12.3 del spec).
create or replace view public.vw_recordacion_prefectura as
select
  candidate_name,
  count(*) filter (where source = 'espontanea') as menciones_espontaneas,
  count(*) filter (where source = 'asistida') as menciones_asistidas
from (
  select unnest(string_to_array(prefectura_espontanea, ',')) as candidate_name, 'espontanea' as source
  from public.surveys_responses where is_valid = true and prefectura_espontanea is not null
  union all
  select unnest(prefectura_asistida) as candidate_name, 'asistida' as source
  from public.surveys_responses where is_valid = true
) sub
group by candidate_name;

create or replace view public.vw_demografia_parroquia as
select parroquia, count(*) as total
from public.surveys_responses
where is_valid = true
group by parroquia
order by total desc;

create or replace view public.vw_demografia_edad as
select edad, count(*) as total
from public.surveys_responses
where is_valid = true
group by edad;

create or replace view public.vw_metricas_globales as
select
  count(*) as total_respuestas,
  count(*) filter (where is_valid = true) as respuestas_validas,
  round(avg(duration_seconds) filter (where is_valid = true)) as duracion_promedio_seg
from public.surveys_responses;

-- 0006_seed_candidates.sql
-- Candidatos provistos por el cliente (2026-08-03). Orden fijo y documentado
-- por neutralidad del instrumento (§14.2 del spec) — no reordenar por popularidad.
insert into public.candidates (name, dignity, display_order) values
  ('Santiago Abarca', 'alcaldia_riobamba', 1),
  ('Dorian Jara', 'alcaldia_riobamba', 2),
  ('Cesar Daqui', 'alcaldia_riobamba', 3),
  ('Maximiliano Nuñez', 'alcaldia_riobamba', 4),
  ('Leonardo Sefla', 'prefectura_chimborazo', 1),
  ('Jorge Romero', 'prefectura_chimborazo', 2),
  ('Juan Pablo Cruz', 'prefectura_chimborazo', 3),
  ('Norma Guaman', 'prefectura_chimborazo', 4);

-- 0007_add_nombre.sql
-- Agrega identificación por nombre (obligatorio) y marca de posible duplicado.
-- Un nombre repetido NO bloquea el envío (dos personas reales pueden compartir
-- nombre) — se guarda igual y queda marcado para revisión manual en el dashboard.
alter table public.surveys_responses
  add column nombre text not null default '',
  add column is_possible_duplicate boolean not null default false;

create index idx_surveys_nombre_lower on public.surveys_responses (lower(nombre));

-- 0008_add_clima_ciudadano.sql
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

-- 0009_fix_security_definer_views.sql
-- Sin esto, las vistas corren con los permisos de quien las creó (ignorando
-- RLS) y podrían ser leídas por cualquiera con la anon key pública.
alter view public.vw_recordacion_alcaldia set (security_invoker = true);
alter view public.vw_recordacion_prefectura set (security_invoker = true);
alter view public.vw_demografia_parroquia set (security_invoker = true);
alter view public.vw_demografia_edad set (security_invoker = true);
alter view public.vw_metricas_globales set (security_invoker = true);

-- ============================================================================
-- Verificación opcional: corre esto después para confirmar que RLS quedó activo
-- ============================================================================
-- select * from pg_policies where tablename in ('surveys_responses','candidates');
