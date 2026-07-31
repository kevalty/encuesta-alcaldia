create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  dignity text not null check (dignity in ('alcaldia_riobamba', 'prefectura_chimborazo')),
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.candidates is 'Candidatos precargados para las preguntas de recordación asistida. Actualizar cuando el CNE oficialice las candidaturas.';
