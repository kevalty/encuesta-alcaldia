-- Fix: las vistas del dashboard (0005_views_dashboard.sql) se crearon sin
-- security_invoker, así que por defecto de Postgres corren con los permisos
-- de quien las creó (el rol admin del SQL Editor) en vez de los permisos de
-- quien las consulta. Eso hace que RLS de surveys_responses NO se aplique al
-- consultar la vista, y como la API REST de Supabase expone las vistas por
-- default, cualquiera con la anon key pública podría leer los datos agregados
-- de la encuesta sin pasar por /admin/login. security_invoker=true hace que
-- la vista respete el rol de quien consulta (anon queda bloqueado por RLS,
-- authenticated sigue viendo los datos como hasta ahora).
alter view public.vw_recordacion_alcaldia set (security_invoker = true);
alter view public.vw_recordacion_prefectura set (security_invoker = true);
alter view public.vw_demografia_parroquia set (security_invoker = true);
alter view public.vw_demografia_edad set (security_invoker = true);
alter view public.vw_metricas_globales set (security_invoker = true);
