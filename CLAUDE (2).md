# CLAUDE.md — Encuesta Ciudadana 2027 (Riobamba y Chimborazo)

> **Instrucción para Claude Code:** este documento es la especificación completa del proyecto. Sigue el orden de la sección 15 (Plan de Implementación por Fases) exactamente. No inventes candidatos, no inventes textos legales, no publiques el proyecto sin completar el checklist de la sección 16. Cuando algo no esté definido explícitamente en este documento (ej. nombres reales de candidatos), déjalo como constante fácilmente editable y avísame en el resumen final de la tarea.

---

## 0. Resumen del proyecto

**Qué es:** una web app mobile-first tipo Typeform (una pregunta por pantalla) para levantar una encuesta ciudadana de intención de voto en el cantón Riobamba y la provincia de Chimborazo, de cara a las elecciones seccionales de 2027 (Alcaldía de Riobamba y Prefectura de Chimborazo).

**Quién la usa:**
- **Ciudadano encuestado** (móvil, sin login): responde 6 pantallas en menos de 2 minutos.
- **Administrador** (Keval / equipo, desktop o móvil, con login): revisa resultados en un dashboard privado.

**Objetivo de negocio/producto:** captar datos de recordación espontánea y asistida de candidatos, con controles antifraude razonables (no bancarios, es una encuesta informal, no un sistema electoral oficial), y exportar los datos para análisis.

**Fuera de alcance (explícito):** este proyecto NO es un sistema de votación, no reemplaza ni simula al CNE, no debe presentarse como encuesta "oficial" salvo que el cliente lo aclare por su cuenta. El copy debe dejar claro que es una **encuesta ciudadana independiente**, no vinculante.

---

## 1. Stack Tecnológico y Versiones

| Capa | Tecnología | Notas |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Server Actions habilitadas |
| Lenguaje | TypeScript (strict mode) | `strict: true` en `tsconfig.json` |
| Estilos | Tailwind CSS 3.4+ | Sin librería de componentes pesada (no MUI) |
| Animaciones | Framer Motion | Transiciones entre slides + micro-interacciones |
| Iconos | lucide-react | |
| Estado del formulario | Zustand | Store único, con persistencia parcial en `sessionStorage` (no `localStorage`, ver §10) |
| Validación | Zod | Un schema por pantalla + schema completo para el submit |
| Backend/BaaS | Supabase (PostgreSQL + Auth + Edge Functions) | RLS activo en todas las tablas |
| Gráficos dashboard | Recharts | |
| Antibot | Cloudflare Turnstile | Widget invisible/managed en la última pantalla |
| Notificaciones UI | `sonner` | Toasts de éxito/error |
| Hosting | Vercel | Variables de entorno vía dashboard de Vercel |

### `package.json` — dependencias clave

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.0",
    "zustand": "^4.5.0",
    "zod": "^3.23.0",
    "framer-motion": "^11.3.0",
    "lucide-react": "^0.400.0",
    "recharts": "^2.12.0",
    "sonner": "^1.5.0",
    "@marsidev/react-turnstile": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0"
  }
}
```

---

## 2. Variables de Entorno

Crear `.env.local` (nunca commitear) y replicar en Vercel:

```bash
# Públicas (expuestas al cliente)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_SITE_URL=https://encuesta-riobamba-2027.vercel.app

# Privadas (solo server: Server Actions / Route Handlers)
SUPABASE_SERVICE_ROLE_KEY=
TURNSTILE_SECRET_KEY=
```

> `SUPABASE_SERVICE_ROLE_KEY` jamás debe usarse en un componente cliente ni exponerse en el bundle. Solo en `lib/supabase/admin.ts`, que debe llevar el comentario `// SERVER ONLY` en la primera línea.

---

## 3. Estructura de Carpetas

```
/app
  layout.tsx                     # Metadata global, fuentes, <Toaster />
  page.tsx                       # Landing corta -> botón "Empezar encuesta"
  /encuesta
    page.tsx                     # Contenedor del flujo de 6 slides
  /gracias
    page.tsx                     # Pantalla post-envío (fallback sin JS del share)
  /admin
    layout.tsx                   # Verifica sesión (usa middleware, ver §12)
    /login
      page.tsx
    /dashboard
      page.tsx                   # Métricas, gráficos, tabla, export CSV
  /api
    /turnstile-verify
      route.ts                   # (alternativa a Server Action si se prefiere Route Handler)

/components
  /survey
    ProgressBar.tsx
    SlideWrapper.tsx              # Wrapper con Framer Motion (variants compartidas)
    Slide1Demografia.tsx
    Slide2AlcaldiaEspontanea.tsx
    Slide3PrefecturaEspontanea.tsx
    Slide4AlcaldiaAsistida.tsx
    Slide5PrefecturaAsistida.tsx
    Slide6Finalizacion.tsx
    NavigationButtons.tsx         # Atrás / Siguiente, deshabilita según validación
  /admin
    MetricCard.tsx
    RecordacionBarChart.tsx
    DemografiaPieChart.tsx
    ResponsesTable.tsx
    ExportCsvButton.tsx
  /ui
    PillButton.tsx                # Botones tipo "pill" reutilizables (género, edad)
    CheckboxCard.tsx               # Checkbox estilizado para listas asistidas
    TextFieldLarge.tsx             # Input grande para preguntas espontáneas
    Spinner.tsx

/lib
  /supabase
    client.ts                     # createBrowserClient (anon key)
    server.ts                     # createServerClient (SSR, cookies)
    admin.ts                      # SERVER ONLY - service role key
  /store
    surveyStore.ts                # Zustand store
  /validations
    surveySchemas.ts               # Zod: un schema por slide + schema total
  /utils
    csvExport.ts
    fingerprint.ts
    antifraude.ts
    cn.ts                          # helper clsx/tailwind-merge
  /actions
    submitSurvey.ts                # 'use server'
    verifyTurnstile.ts             # 'use server'
    adminAuth.ts                   # 'use server'
  constants.ts                     # PARROQUIAS, RANGOS_EDAD, GENEROS

/types
  index.ts

/supabase
  /migrations
    0001_init_extensions.sql
    0002_create_candidates.sql
    0003_create_surveys_responses.sql
    0004_rls_policies.sql
    0005_views_dashboard.sql
    0006_seed_candidates.sql

middleware.ts                      # Protege /admin/dashboard
tailwind.config.ts
```

---

## 4. Esquema de Base de Datos (SQL completo para Supabase)

Ejecutar en orden vía SQL Editor de Supabase o como migraciones con `supabase db push`.

### 4.1 `0001_init_extensions.sql`

```sql
create extension if not exists "pgcrypto";
```

### 4.2 `0002_create_candidates.sql`

```sql
create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  dignity text not null check (dignity in ('alcaldia_riobamba', 'prefectura_chimborazo')),
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.candidates is 'Candidatos precargados para las preguntas de recordación asistida. Actualizar cuando el CNE oficialice las candidaturas.';
```

### 4.3 `0003_create_surveys_responses.sql`

```sql
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
```

### 4.4 `0004_rls_policies.sql`

```sql
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
```

> **Importante:** el `insert` de `surveys_responses` se hace desde una Server Action usando el cliente `anon`, no el `service_role`. El `service_role` (`lib/supabase/admin.ts`) solo se usa si necesitas saltarte RLS para tareas internas (ej. un cron de limpieza), nunca para el flujo normal del ciudadano.

### 4.5 `0005_views_dashboard.sql`

Vistas para que el dashboard no tenga que agregar datos en el cliente:

```sql
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
```

> Nota sobre `vw_recordacion_alcaldia`: la recordación espontánea es texto libre, así que el `unnest(string_to_array(...))` es una aproximación cruda (asume que el usuario separó nombres con comas). Para un conteo confiable de espontánea, lo correcto es hacer normalización manual desde el dashboard (ver §11.4) o con un job de limpieza — no depender 100% de esta vista para esa columna.

### 4.6 `0006_seed_candidates.sql`

```sql
-- PLACEHOLDER: reemplazar con los nombres reales de candidatos oficializados por el CNE
-- antes de publicar la encuesta. No inventar nombres de candidatos reales aquí.
insert into public.candidates (name, dignity, display_order) values
  ('Candidato A (editar)', 'alcaldia_riobamba', 1),
  ('Candidato B (editar)', 'alcaldia_riobamba', 2),
  ('Candidato A (editar)', 'prefectura_chimborazo', 1),
  ('Candidato B (editar)', 'prefectura_chimborazo', 2);
```

---

## 5. Tipos TypeScript compartidos (`/types/index.ts`)

```typescript
export type Parroquia =
  | 'Lizarzaburu' | 'Maldonado' | 'Velasco' | 'Veloz' | 'Yaruquíes'
  | 'Cacha' | 'Calpi' | 'Cubijíes' | 'Flores' | 'Licán' | 'Licto'
  | 'Pungalá' | 'Punín' | 'Quimiag' | 'San Juan' | 'San Luis';

export type RangoEdad = '16-20' | '21-35' | '36-50' | '51+';
export type Genero = 'Masculino' | 'Femenino' | 'Otro' | 'Prefiero no decir';
export type Dignidad = 'alcaldia_riobamba' | 'prefectura_chimborazo';

export interface Candidate {
  id: string;
  name: string;
  dignity: Dignidad;
  is_active: boolean;
  display_order: number;
}

export interface SurveyPayload {
  parroquia: Parroquia;
  edad: RangoEdad;
  genero: Genero;
  alcaldia_espontanea: string;
  prefectura_espontanea: string;
  alcaldia_asistida: string[];
  prefectura_asistida: string[];
  duration_seconds: number;
  turnstile_token: string;
}

export interface SubmitResult {
  success: boolean;
  error?: string;
}
```

---

## 6. Validación con Zod (`/lib/validations/surveySchemas.ts`)

```typescript
import { z } from 'zod';

export const parroquiaSchema = z.enum([
  'Lizarzaburu','Maldonado','Velasco','Veloz','Yaruquíes',
  'Cacha','Calpi','Cubijíes','Flores','Licán','Licto',
  'Pungalá','Punín','Quimiag','San Juan','San Luis',
]);

export const slide1Schema = z.object({
  parroquia: parroquiaSchema,
  edad: z.enum(['16-20', '21-35', '36-50', '51+']),
  genero: z.enum(['Masculino', 'Femenino', 'Otro', 'Prefiero no decir']),
});

export const slide2Schema = z.object({
  alcaldia_espontanea: z.string().max(200).optional().default(''),
});

export const slide3Schema = z.object({
  prefectura_espontanea: z.string().max(200).optional().default(''),
});

export const slide4Schema = z.object({
  alcaldia_asistida: z.array(z.string()).min(0),
});

export const slide5Schema = z.object({
  prefectura_asistida: z.array(z.string()).min(0),
});

export const fullSubmitSchema = slide1Schema
  .merge(slide2Schema)
  .merge(slide3Schema)
  .merge(slide4Schema)
  .merge(slide5Schema)
  .extend({
    duration_seconds: z.number().int().nonnegative(),
    turnstile_token: z.string().min(1, 'Falta verificación anti-bot'),
  });

export type FullSubmitInput = z.infer<typeof fullSubmitSchema>;
```

---

## 7. Store de Estado — Zustand (`/lib/store/surveyStore.ts`)

```typescript
import { create } from 'zustand';
import type { Parroquia, RangoEdad, Genero } from '@/types';

interface SurveyState {
  currentSlide: number; // 1..6
  startedAt: number | null;

  parroquia: Parroquia | null;
  edad: RangoEdad | null;
  genero: Genero | null;
  alcaldiaEspontanea: string;
  prefecturaEspontanea: string;
  alcaldiaAsistida: string[];
  prefecturaAsistida: string[];

  setParroquia: (p: Parroquia) => void;
  setEdad: (e: RangoEdad) => void;
  setGenero: (g: Genero) => void;
  setAlcaldiaEspontanea: (v: string) => void;
  setPrefecturaEspontanea: (v: string) => void;
  toggleAlcaldiaAsistida: (name: string) => void;
  togglePrefecturaAsistida: (name: string) => void;
  startTimer: () => void;
  goNext: () => void;
  goBack: () => void;
  reset: () => void;
}

const initialState = {
  currentSlide: 1,
  startedAt: null,
  parroquia: null,
  edad: null,
  genero: null,
  alcaldiaEspontanea: '',
  prefecturaEspontanea: '',
  alcaldiaAsistida: [] as string[],
  prefecturaAsistida: [] as string[],
};

export const useSurveyStore = create<SurveyState>((set, get) => ({
  ...initialState,

  setParroquia: (p) => set({ parroquia: p }),
  setEdad: (e) => set({ edad: e }),
  setGenero: (g) => set({ genero: g }),
  setAlcaldiaEspontanea: (v) => set({ alcaldiaEspontanea: v }),
  setPrefecturaEspontanea: (v) => set({ prefecturaEspontanea: v }),

  toggleAlcaldiaAsistida: (name) => {
    const current = get().alcaldiaAsistida;
    if (name === 'Ninguno de los anteriores') {
      set({ alcaldiaAsistida: current.includes(name) ? [] : [name] });
      return;
    }
    const withoutNone = current.filter((n) => n !== 'Ninguno de los anteriores');
    set({
      alcaldiaAsistida: withoutNone.includes(name)
        ? withoutNone.filter((n) => n !== name)
        : [...withoutNone, name],
    });
  },

  togglePrefecturaAsistida: (name) => {
    const current = get().prefecturaAsistida;
    if (name === 'Ninguno de los anteriores') {
      set({ prefecturaAsistida: current.includes(name) ? [] : [name] });
      return;
    }
    const withoutNone = current.filter((n) => n !== 'Ninguno de los anteriores');
    set({
      prefecturaAsistida: withoutNone.includes(name)
        ? withoutNone.filter((n) => n !== name)
        : [...withoutNone, name],
    });
  },

  startTimer: () => {
    if (!get().startedAt) set({ startedAt: Date.now() });
  },

  goNext: () => set((s) => ({ currentSlide: Math.min(s.currentSlide + 1, 6) })),
  goBack: () => set((s) => ({ currentSlide: Math.max(s.currentSlide - 1, 1) })),
  reset: () => set(initialState),
}));
```

> No usar `persist` de Zustand con `localStorage` aquí — el bloqueo antifraude usa un flag separado y deliberadamente distinto (ver §10.1). Mezclar el estado del formulario con persistencia entre sesiones puede dejar respuestas a medio llenar "pegadas" si el usuario cierra la pestaña.

---

## 8. Sistema de Diseño

El brief no fija una dirección visual, así que la definimos con algo propio del sujeto: Riobamba es la "Sultana de los Andes", a los pies del Chimborazo, con arquitectura republicana de piedra y calles trazadas en cuadrícula desde 1797. La app debe sentirse **cívica, seria y andina** — ni el típico SaaS azul-índigo, ni la estética "gobierno digital" genérica. Evitar deliberadamente los colores de banderas de partidos políticos o de la bandera nacional para no sesgar visualmente al encuestado.

### Paleta (color de marca de la encuesta, no de ningún candidato)

| Token | Hex | Uso |
|---|---|---|
| `--color-bg` | `#F5F3EE` | Fondo cálido, piedra clara |
| `--color-ink` | `#232320` | Texto principal, casi negro cálido |
| `--color-andes` | `#2F4858` | Acento primario — azul pizarra del páramo/cielo andino, NO azul partidista |
| `--color-paja` | `#C9A227` | Acento secundario — ocre "paja toquilla", para progreso/CTA |
| `--color-volcan` | `#7A2E2E` | Alerta/error — rojo tierra volcánica, no rojo bandera |
| `--color-neutral` | `#8B8B82` | Texto secundario, bordes |

### Tipografía

- **Display** (títulos de cada pregunta): una serif con carácter institucional — ej. `"Fraunces"` (variable font, pesos 500–600) para transmitir seriedad cívica sin ser fría.
- **Body/UI**: `"Inter"` o `"Public Sans"` para inputs, botones, labels — legible en pantallas pequeñas.
- Escala: `text-2xl` (24px) para preguntas en móvil, subiendo a `text-4xl` en desktop; `text-base` para inputs y opciones.

### Layout

- Una pregunta ocupa el 100% del viewport (`min-h-dvh`, no `100vh`, para evitar el salto del teclado móvil en iOS/Android).
- Barra de progreso fina (`h-1`) fija arriba, color `--color-paja` sobre `--color-neutral/20`.
- Botones "Siguiente"/"Atrás" fijos abajo con `safe-area-inset-bottom` (usar `env(safe-area-inset-bottom)` en Tailwind vía plugin o clase custom) para no chocar con el home indicator de iPhone.
- Objetivo táctil mínimo: 44×44px en todos los elementos interactivos (checkboxes, pills, botones).

### Firma visual (signature element)

El único elemento decorativo memorable: un **contorno topográfico minimalista del Chimborazo** (líneas finas tipo curvas de nivel, `stroke` en `--color-neutral/30`) como marca de agua sutil en la pantalla de bienvenida y en la de agradecimiento — nunca detrás del texto de las preguntas, donde estorbaría la lectura. Todo lo demás se mantiene deliberadamente quieto: sin gradientes, sin sombras pesadas, sin iconografía genérica de "encuesta" (lupas, checklists de stock).

### Movimiento (Framer Motion)

Una sola transición entre slides, consistente en las 6 pantallas: `slide + fade` horizontal (la pregunta nueva entra desde la derecha si se avanza, desde la izquierda si se retrocede), 250ms, `ease: [0.22, 1, 0.36, 1]`. Nada de animaciones adicionales por elemento (evitar el efecto "cada botón hace su propia cosa").

```typescript
// components/survey/SlideWrapper.tsx — variants de referencia
export const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};
```

---

## 9. Flujo de Pantallas — especificación por slide

Todas las pantallas comparten `SlideWrapper` (progreso + animación) y `NavigationButtons` (deshabilitado si la validación Zod del slide falla).

### Slide 1 — Demografía
- **Campos:** `parroquia` (select agrupado: "Urbanas" / "Rurales", usando la lista de §5), `edad` (4 pills), `genero` (4 pills, incluye "Prefiero no decir").
- **Validación:** los 3 campos son obligatorios para habilitar "Siguiente".
- **Al montar:** dispara `startTimer()` del store (inicio del cronómetro antifraude).

### Slide 2 — Alcaldía espontánea
- **Título:** "Sin mirar ninguna lista, ¿qué candidato(s) a la Alcaldía de Riobamba recuerda?"
- **Campo:** `TextFieldLarge`, `maxLength=200`, placeholder "Escribe el nombre que recuerdes...".
- **Validación:** opcional (no bloquea avance — es válido no recordar a nadie, ese dato también importa).
- **Copy de ayuda:** una línea pequeña bajo el input: "Si no recuerdas ninguno, puedes dejarlo en blanco."

### Slide 3 — Prefectura espontánea
- Igual estructura que Slide 2, para Prefectura de Chimborazo.

### Slide 4 — Alcaldía asistida
- **Título:** "De la siguiente lista, ¿a quiénes conoce?"
- **Fuente de datos:** `candidates` filtrado por `dignity = 'alcaldia_riobamba'`, ordenado por `display_order`, más una opción fija al final: `"Ninguno de los anteriores"`.
- **Comportamiento:** `CheckboxCard` múltiple. Marcar "Ninguno de los anteriores" limpia el resto (ya implementado en el store, §7). Marcar cualquier otro después de "Ninguno" lo desmarca automáticamente.
- **Validación:** opcional, no bloquea avance.

### Slide 5 — Prefectura asistida
- Igual estructura que Slide 4, para `dignity = 'prefectura_chimborazo'`.

### Slide 6 — Finalización y envío
- Muestra un resumen mínimo ("¡Gracias por participar!"), ejecuta el submit real (ver §11) al montar o mediante botón "Enviar respuestas" con Turnstile ya resuelto.
- Estados: `idle` → `submitting` (spinner, botón deshabilitado) → `success` | `error`.
- **En éxito:**
  1. Guardar flag antifraude (`sessionStorage` + cookie, ver §10.1).
  2. Mostrar confeti breve (opcional, `canvas-confetti`, solo si no hay `prefers-reduced-motion`).
  3. Botón de WhatsApp: `https://wa.me/?text=` + texto codificado con `encodeURIComponent`.
  4. Botón secundario "Ver resultados públicos" (si el cliente decide publicar un resumen agregado — opcional, fuera de v1).
- **En error:** toast con mensaje claro ("No pudimos enviar tu respuesta, inténtalo de nuevo") y botón de reintento. Nunca mostrar detalles técnicos del error al usuario final.

---

## 10. Medidas Antifraude

Objetivo realista: esto es una encuesta ciudadana informal, no un sistema bancario. Las medidas deben **desincentivar** el fraude casual (alguien votando 5 veces desde el celular), no pretender ser infalibles contra un atacante decidido con múltiples dispositivos.

### 10.1 Bloqueo en el dispositivo (cliente)
- Al enviar exitosamente: `sessionStorage.setItem('encuesta_2027_completada', 'true')` **y** una cookie `has_voted_2027=true` con `max-age` de ~180 días (`sessionStorage` solo dura la pestaña; la cookie sobrevive a cerrar y reabrir el navegador, que es el caso real que se quiere frenar).
- Si al entrar a `/encuesta` existe la cookie, redirigir directo a `/gracias` con un mensaje: "Ya registramos tu participación, ¡gracias!".
- **Limitación honesta a documentar en el propio código (comentario):** un usuario que borra cookies o usa incógnito puede volver a responder. Esto es aceptable para v1; no vender esta medida como "a prueba de fraude" al cliente.

### 10.2 Validación de tiempo de llenado
- `startedAt` se marca en el store al montar Slide 1 (§7).
- Al hacer submit, el **server** (no el cliente) recalcula: si `duration_seconds < 5`, se inserta igual pero con `is_valid = false` e `invalid_reason = 'too_fast'`. Nunca rechazar el submit por esto — solo marcarlo, para no perder el dato ni frustrar a alguien que de verdad respondió rápido.

### 10.3 Doble envío
- El botón de envío se deshabilita en cuanto pasa a estado `submitting` y permanece así hasta recibir respuesta del server (éxito o error). No usar `debounce`, usar bloqueo de estado explícito.

### 10.4 Cloudflare Turnstile
- Widget en modo `managed` (no invisible total, para reducir falsos positivos) en Slide 6, antes del botón de envío.
- El token se valida **en el server** (Server Action `verifyTurnstile.ts`), llamando a `https://challenges.cloudflare.com/turnstile/v0/siteverify` con `TURNSTILE_SECRET_KEY`. Nunca confiar en un "verificado: true" que venga del cliente.

```typescript
// lib/actions/verifyTurnstile.ts
'use server';

export async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
    }),
  });
  const data = await res.json();
  return data.success === true;
}
```

### 10.5 Fingerprint + IP (server-side, no client-side)
- La IP real solo está disponible de forma confiable en el server (headers `x-forwarded-for` en Vercel). Calcular un hash (no guardar la IP en texto plano, por privacidad — ver §14) combinando IP + User-Agent con SHA-256.
- Este hash se guarda en `ip_hash` y sirve para detectar ráfagas del mismo origen (ej. bloquear más de N envíos desde el mismo hash en 10 minutos), implementable como una consulta simple antes del insert o como una Edge Function separada si el volumen lo justifica. Para v1, basta con registrar el dato; el bloqueo activo por rate-limit es una mejora de v2 si el fraude real lo amerita.

```typescript
// lib/utils/antifraude.ts
import { createHash } from 'crypto';

export function hashFingerprint(ip: string, userAgent: string): string {
  return createHash('sha256').update(`${ip}::${userAgent}`).digest('hex');
}
```

---

## 11. Server Actions

### 11.1 `submitSurvey.ts` — flujo completo

```typescript
// lib/actions/submitSurvey.ts
'use server';

import { headers } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { fullSubmitSchema, type FullSubmitInput } from '@/lib/validations/surveySchemas';
import { verifyTurnstile } from './verifyTurnstile';
import { hashFingerprint } from '@/lib/utils/antifraude';
import type { SubmitResult } from '@/types';

export async function submitSurvey(input: FullSubmitInput): Promise<SubmitResult> {
  const parsed = fullSubmitSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Datos inválidos' };
  }

  const turnstileOk = await verifyTurnstile(parsed.data.turnstile_token);
  if (!turnstileOk) {
    return { success: false, error: 'Verificación de seguridad fallida' };
  }

  const headersList = headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const userAgent = headersList.get('user-agent') ?? 'unknown';
  const ipHash = hashFingerprint(ip, userAgent);

  const isTooFast = parsed.data.duration_seconds < 5;

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('surveys_responses').insert({
    parroquia: parsed.data.parroquia,
    edad: parsed.data.edad,
    genero: parsed.data.genero,
    alcaldia_espontanea: parsed.data.alcaldia_espontanea || null,
    prefectura_espontanea: parsed.data.prefectura_espontanea || null,
    alcaldia_asistida: parsed.data.alcaldia_asistida,
    prefectura_asistida: parsed.data.prefectura_asistida,
    fingerprint: ipHash,
    ip_hash: ipHash,
    user_agent: userAgent,
    duration_seconds: parsed.data.duration_seconds,
    is_valid: !isTooFast,
    invalid_reason: isTooFast ? 'too_fast' : null,
    turnstile_verified: true,
  });

  if (error) {
    console.error('submitSurvey insert error:', error.message);
    return { success: false, error: 'No se pudo guardar tu respuesta' };
  }

  return { success: true };
}
```

> Nota de diseño: la validación de "demasiado rápido" ocurre **después** de Turnstile para no gastar la llamada a Cloudflare en casos claramente inválidos — pero igual se inserta con `is_valid=false` en vez de descartarse, porque el dato demográfico agregado sigue teniendo algún valor para detectar patrones de abuso, aunque se excluya de las métricas "válidas" del dashboard.

---

## 12. Autenticación y Dashboard de Administración

### 12.1 `middleware.ts` — proteger `/admin/dashboard`

```typescript
import { type NextRequest, NextResponse } from 'next/server';
import { createMiddlewareSupabaseClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    return NextResponse.next();
  }

  const { supabase, response } = createMiddlewareSupabaseClient(request);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
```

### 12.2 Login (`/app/admin/login/page.tsx`)
- Formulario simple email + password contra `supabase.auth.signInWithPassword`.
- Los usuarios admin se crean manualmente desde el panel de Supabase Auth (no hay self-signup público — no exponer una ruta de registro).

### 12.3 Dashboard (`/app/admin/dashboard/page.tsx`)
- **Tarjetas de métricas** (`MetricCard`, usando `vw_metricas_globales`): total de encuestas, % válidas, duración promedio.
- **Gráfico de barras** (`RecordacionBarChart`, Recharts, usando `vw_recordacion_alcaldia`): recordación espontánea vs. asistida por candidato, una barra agrupada por dignidad (alcaldía / prefectura, con selector de pestañas).
- **Gráfico de pastel** (`DemografiaPieChart`, usando `vw_demografia_parroquia` y `vw_demografia_edad`, con selector).
- **Tabla de respuestas** (`ResponsesTable`): últimas N respuestas con `is_valid = true`, paginada (20 por página), columnas: fecha, parroquia, edad, género, recordación asistida (resumida), duración.
- **Exportación CSV** (`ExportCsvButton`):

```typescript
// lib/utils/csvExport.ts
export function exportToCsv(rows: Record<string, unknown>[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const value = row[h] ?? '';
          const stringValue = Array.isArray(value) ? value.join('; ') : String(value);
          const escaped = stringValue.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ];
  const csvContent = '\uFEFF' + csvRows.join('\n'); // BOM para tildes/ñ en Excel
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
```

> El `\uFEFF` (BOM) al inicio es intencional: sin eso, Excel en Windows muestra mal los acentos y la "ñ" de nombres como "Yaruquíes" o "Quimiag" al abrir el CSV exportado.

---

## 13. SEO y Metadatos (`/app/layout.tsx`)

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Encuesta Ciudadana 2027 · Riobamba y Chimborazo',
  description: 'Encuesta ciudadana independiente para medir el pulso político de la Alcaldía de Riobamba y la Prefectura de Chimborazo. No vinculante, no oficial.',
  openGraph: {
    title: 'Encuesta Ciudadana 2027 · Riobamba y Chimborazo',
    description: 'Participa en la encuesta ciudadana independiente. Toma menos de 2 minutos.',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Encuesta Ciudadana Riobamba 2027',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Encuesta Ciudadana 2027 · Riobamba y Chimborazo',
    description: 'Participa en la encuesta ciudadana independiente.',
    images: ['/og-image.png'],
  },
  robots: {
    index: false, // cambiar a true solo cuando el cliente confirme que quiere indexación pública
    follow: false,
  },
};
```

> `robots.index: false` es deliberado hasta el lanzamiento oficial: evita que la encuesta aparezca en buscadores antes de tener el copy legal/de neutralidad revisado (§14). Recordar cambiarlo cuando el cliente dé luz verde.

---

## 14. Consideraciones Éticas y Legales (no política — cumplimiento)

Esto es una nota de cumplimiento práctico, no una postura sobre ningún candidato o partido:

1. **Protección de datos (Ecuador, LOPDP):** la app recolecta datos personales indirectos (edad, género, ubicación por parroquia). Incluir un aviso corto antes de la Pantalla 1 ("Tus respuestas son anónimas y se usan solo con fines estadísticos") y no almacenar la IP en texto plano (ya cubierto en §10.5, solo se guarda el hash).
2. **Neutralidad del instrumento:** el orden de los candidatos en las listas asistidas (`display_order`) debe mantenerse fijo y documentado, no aleatorizado por sesión ni ordenado por popularidad — para que ningún candidato reciba ventaja de posición sistemática, y para que el orden sea auditable si alguien pregunta cómo se construyó la lista.
3. **Transparencia del rótulo:** todo el copy debe dejar claro "encuesta ciudadana independiente", nunca insinuar afiliación con el CNE, un candidato o un medio de comunicación, salvo que eso sea explícitamente cierto y el cliente lo autorice por escrito.
4. **Retención de datos:** definir junto al cliente cuánto tiempo se conservan las respuestas después de la elección (recomendado: eliminar o anonimizar completamente los campos de fingerprint/IP hash pasados 90 días desde el cierre de la encuesta).

---

## 15. Plan de Implementación por Fases (para Claude Code)

Ejecutar en este orden, sin saltar pasos:

1. **Setup base:** `create-next-app` con TypeScript + Tailwind + App Router. Configurar `tsconfig.json` en modo strict.
2. **Supabase:** correr las migraciones de §4 en orden (`0001` → `0006`). Verificar en el SQL Editor que RLS quedó activo y las policies existen (`select * from pg_policies where tablename in ('surveys_responses','candidates');`).
3. **Clientes Supabase:** crear `lib/supabase/client.ts`, `server.ts`, `admin.ts` siguiendo el patrón `@supabase/ssr`.
4. **Tipos y validaciones:** `types/index.ts` + `lib/validations/surveySchemas.ts`.
5. **Store:** `lib/store/surveyStore.ts` completo (§7).
6. **Design tokens:** configurar `tailwind.config.ts` con la paleta y tipografía de §8, importar Fraunces + Inter/Public Sans vía `next/font`.
7. **Componentes UI base:** `PillButton`, `CheckboxCard`, `TextFieldLarge`, `ProgressBar`, `SlideWrapper` con las variants de Framer Motion.
8. **Las 6 pantallas:** en orden, Slide1 → Slide6, cada una consumiendo el store y su schema Zod correspondiente.
9. **Antifraude:** `lib/utils/antifraude.ts`, integrar Turnstile widget en Slide6, `verifyTurnstile.ts`.
10. **Server Action de submit:** `submitSurvey.ts` completo, probar inserción manual antes de conectarlo a la UI.
11. **Bloqueo de reingreso:** cookie + `sessionStorage` + redirect desde `/encuesta` si ya completó.
12. **Auth admin:** `middleware.ts`, página de login, crear un usuario admin de prueba manualmente en Supabase.
13. **Dashboard:** métricas, gráficos, tabla, export CSV — en ese orden de prioridad (las métricas y la tabla son lo mínimo usable; los gráficos pueden iterar después).
14. **SEO:** metadata de §13, generar `/public/og-image.png` (puede ser un placeholder inicial).
15. **QA:** correr el checklist completo de §16 antes de considerar el proyecto listo para deploy.
16. **Deploy:** conectar repo a Vercel, cargar todas las variables de entorno de §2, verificar build de producción localmente (`next build`) antes del primer deploy.

---

## 16. Checklist de QA

- [ ] Probar el flujo completo en un celular real (no solo devtools), iOS y Android si es posible.
- [ ] Verificar que el teclado móvil no tape el input activo en Slides 2 y 3 (usar `scrollIntoView` si hace falta).
- [ ] Confirmar que `min-h-dvh` se comporta bien en Safari iOS (barra de direcciones dinámica).
- [ ] Intentar un `insert` a `surveys_responses` desde el cliente anon SIN pasar por la Server Action — debe fallar por RLS si se intenta `select`, y el `insert` directo debe funcionar solo con los campos correctos (probar también un insert con un `parroquia` fuera del `check constraint` — debe rechazarse).
- [ ] Probar Turnstile en modo test (`1x00000000000000000000AA` como site key de pruebas de Cloudflare) antes de usar las llaves reales.
- [ ] Enviar la encuesta en menos de 5 segundos a propósito y confirmar que llega con `is_valid=false` e `invalid_reason='too_fast'`, no que se bloquea.
- [ ] Doble click rápido en "Enviar" — confirmar que no se crean dos filas.
- [ ] Completar la encuesta, recargar `/encuesta` — debe redirigir a `/gracias`, no mostrar el formulario de nuevo.
- [ ] Exportar CSV con al menos una respuesta que tenga "Yaruquíes", "Quimiag" o "Licán" en `parroquia` — abrir en Excel y confirmar que las tildes se ven bien.
- [ ] Verificar `/admin/dashboard` sin sesión — debe redirigir a `/admin/login`.
- [ ] Lighthouse mobile en `/encuesta`: apuntar a Performance ≥ 90, Accessibility ≥ 95.
- [ ] Revisar contraste de color de la paleta de §8 contra WCAG AA (especialmente `--color-neutral` sobre `--color-bg`).
- [ ] Confirmar `prefers-reduced-motion` desactiva el confeti y reduce las transiciones de Framer Motion a un simple fade.

---

## 17. Notas Finales para Claude Code

- No reemplazar la paleta de §8 por defaults de Tailwind (`blue-600`, `indigo-500`, etc.) — son una decisión deliberada de diseño para este proyecto específico, no un placeholder.
- No usar `localStorage` para el flag antifraude (usar cookie + `sessionStorage`, ver §10.1) — es una decisión, no un descuido.
- Los nombres de candidatos en `0006_seed_candidates.sql` son placeholders explícitos: avisar en el resumen de la tarea que faltan por completarse con datos reales del CNE.
- Si algo en este documento genera ambigüedad al implementar, preferir la opción más simple y documentar la decisión en un comentario en el código, en vez de detener el trabajo a mitad de fase.
