-- Corre esto en el SQL Editor de Supabase para resolver el warning "Security
-- Definer View" (CRITICAL) que muestra el linter de Supabase sobre las vistas
-- del dashboard. Sin esto, las vistas ignoran RLS y podrían ser leídas por
-- cualquiera con la anon key pública, sin pasar por el login del admin.
alter view public.vw_recordacion_alcaldia set (security_invoker = true);
alter view public.vw_recordacion_prefectura set (security_invoker = true);
alter view public.vw_demografia_parroquia set (security_invoker = true);
alter view public.vw_demografia_edad set (security_invoker = true);
alter view public.vw_metricas_globales set (security_invoker = true);
