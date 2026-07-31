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

-- Análoga a vw_recordacion_alcaldia para la Prefectura de Chimborazo.
-- No está en el documento original (§4.5 solo define la vista de Alcaldía),
-- pero el dashboard (§12.3) pide un selector de pestañas Alcaldía/Prefectura,
-- así que se agrega esta vista simétrica para no depender de agregación en el cliente.
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
