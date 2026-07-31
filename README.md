# Encuesta Ciudadana 2027 — Riobamba y Chimborazo

App mobile-first tipo Typeform para la encuesta ciudadana de intención de voto (Alcaldía de Riobamba y Prefectura de Chimborazo). Construida según `CLAUDE (2).md`.

## Estado

El código de la app (encuesta de 6 pantallas, antifraude, dashboard de admin) está completo y compila (`npm run build` sin errores, `npm run lint` limpio). **Falta conectar un proyecto real de Supabase y llaves de Turnstile** para probar el flujo de punta a punta — sin eso, `/encuesta` y `/admin/dashboard` responden error porque no hay backend configurado.

## 1. Instalar y correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000 — la landing (`/`) y `/gracias` ya funcionan sin backend. `/encuesta` y `/admin/*` necesitan Supabase (paso 2).

## 2. Configurar Supabase (obligatorio para probar todo el flujo)

1. Crea un proyecto en https://supabase.com.
2. En el **SQL Editor**, corre en orden los archivos de `supabase/migrations/`: `0001` → `0006`.
3. Verifica que RLS quedó activo:
   ```sql
   select * from pg_policies where tablename in ('surveys_responses','candidates');
   ```
4. En **Project Settings → API**, copia `Project URL`, `anon public key` y `service_role key`.
5. Crea un usuario admin manualmente en **Authentication → Users** (no hay registro público) — con ese email/password entras a `/admin/login`.
6. Edita `.env.local` en la raíz del proyecto y llena:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
7. Reinicia `npm run dev`.

## 3. Turnstile (antibot)

`.env.local` ya trae las **llaves de prueba oficiales de Cloudflare** (`1x00...AA`), que siempre pasan la verificación — sirven para probar el envío de la encuesta sin cuenta de Cloudflare. Para producción, crea un sitio en https://dash.cloudflare.com/?to=/:account/turnstile y reemplaza `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`.

## 4. Pendientes antes de publicar (avisados también en el código)

- **Candidatos reales:** `supabase/migrations/0006_seed_candidates.sql` tiene nombres placeholder (`Candidato A/B (editar)`). Reemplázalos con los candidatos oficializados por el CNE — puedes editar la tabla `candidates` directo desde el SQL Editor de Supabase, no hace falta redeploy de código.
- **`robots.index`** está en `false` en `app/layout.tsx` a propósito (para no indexar antes del lanzamiento oficial). Cámbialo a `true` cuando el cliente dé luz verde.
- **Retención de datos** (§14.4 del spec): definir con el cliente cuánto tiempo se guardan `fingerprint`/`ip_hash` tras la elección.

## 5. Checklist de QA

Ver la sección 16 de `CLAUDE (2).md` para la lista completa (celular real, Turnstile en modo test, doble-submit, export CSV con tildes, Lighthouse, etc.).

## 6. Deploy

Conecta el repo a Vercel y carga las mismas variables de `.env.local` en el dashboard de Vercel. Corre `next build` local antes del primer deploy (ya se corrió y compila limpio en este entregable).
