-- Corre esto para confirmar qué falta y qué ya está aplicado.

-- 1) ¿Existen las columnas de nombre y clima ciudadano?
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'surveys_responses'
  and column_name in (
    'nombre', 'is_possible_duplicate',
    'estado_animo', 'problema_principal', 'canal_comunicacion'
  )
order by column_name;

-- 2) ¿Las vistas ya tienen security_invoker = true? (esto es lo del CRITICAL)
select relname as vista, reloptions
from pg_class
where relname in (
  'vw_recordacion_alcaldia', 'vw_recordacion_prefectura',
  'vw_demografia_parroquia', 'vw_demografia_edad', 'vw_metricas_globales'
);
