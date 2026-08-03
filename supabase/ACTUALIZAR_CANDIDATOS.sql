-- Corre esto en el SQL Editor de Supabase para reemplazar los candidatos
-- placeholder ("Candidato A/B (editar)") por los reales.
delete from public.candidates;

insert into public.candidates (name, dignity, display_order) values
  ('Santiago Abarca', 'alcaldia_riobamba', 1),
  ('Dorian Jara', 'alcaldia_riobamba', 2),
  ('Cesar Daqui', 'alcaldia_riobamba', 3),
  ('Maximiliano Nuñez', 'alcaldia_riobamba', 4),
  ('Leonardo Sefla', 'prefectura_chimborazo', 1),
  ('Jorge Romero', 'prefectura_chimborazo', 2),
  ('Juan Pablo Cruz', 'prefectura_chimborazo', 3),
  ('Norma Guaman', 'prefectura_chimborazo', 4);
