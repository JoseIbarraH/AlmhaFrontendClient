# Almha Frontend Client

Sitio web institucional de **Almha Plastic Surgery** — clínica de cirugía plástica y turismo estético. Multi-idioma (ES / EN), SSR con Astro + Node adapter, y consume el backend Laravel `AlmhaBackendV2` para blog, procedimientos, equipo, contacto y chat asistido por n8n.

## Stack

- **Astro 5** (SSR via `@astrojs/node`)
- **TypeScript 5** con configuración `strict`
- **Tailwind CSS 4** + **DaisyUI**
- **Axios** como cliente HTTP (instanciado por request en `src/middleware.ts`)
- **Vitest** para tests unitarios
- **ESLint + Prettier** para estilo y calidad

## Arquitectura

```
Usuario → Astro (SSR, este repo)
            │
            ├─ GET  /api/client/*          ── blog, procedimientos, equipo, home, navbar
            └─ POST /api/v1/contact, /chat ── proxy validado + rate-limited
                    │
                    └─> AlmhaBackendV2 (Laravel, src/Landing/*)
                            │
                            └─> n8n webhooks (contacto, chat asistente)
```

Nunca se llama a n8n directamente desde el navegador. El backend valida, aplica throttle por IP y reenvía.

### Endpoints consumidos

| Endpoint | Consumidor | Tipo |
|----------|-----------|------|
| `GET /api/client/maintenance` | `middleware.ts` | flag |
| `GET /api/client/navbar-data` | `Layout.astro` | datos del navbar |
| `GET /api/client/home` | `pages/[lang]/index.astro` | home sections |
| `GET /api/client/blog` + `/{slug}` | `pages/[lang]/blog/*` | listado + detalle |
| `GET /api/client/procedure` + `/{slug}` | `pages/[lang]/procedure/*` | listado + detalle |
| `GET /api/client/members` + `/{slug}` | `pages/[lang]/about/*` | equipo |
| `GET /api/client/contact-data?lang=` | `pages/[lang]/contact/*` | settings contacto |
| `POST /api/client/subscribe` | Newsletter widget | newsletter |
| `POST /api/v1/contact` | Form contacto | envía a n8n vía backend |
| `POST /api/v1/chat` | ChatWidget | envía a n8n vía backend |

## Estructura

```
src/
├── components/    # UI: layout/, partials/, shared/, ui/
├── pages/         # Rutas [lang]/… con i18n
├── layouts/       # Layout.astro raíz
├── lib/           # api.ts, dataService.ts, i18n.ts, date.ts
├── types/         # Tipos compartidos (apiResponse, blog, i18n, …)
├── locales/       # JSON de traducciones (es/, en/, …)
├── data/          # Datos estáticos (countries, etc.)
├── middleware.ts  # Detecta idioma, inyecta `api` en Astro.locals, maintenance mode
└── styles/
```

## Requisitos

- Node.js **20+**
- npm (el proyecto usa `package-lock.json`)

## Setup

```bash
npm install --legacy-peer-deps
cp .env.example .env   # crear si no existe
# editar PUBLIC_API_URL apuntando al backend (ej. http://localhost:8000)
npm run dev
```

**Importante:** el backend `AlmhaBackendV2` debe estar corriendo antes de iniciar el dev server, porque el middleware hace SSR fetch a `/api/client/maintenance` en cada request. En el backend ejecuta `php artisan migrate:fresh --seed` para poblar datos de prueba y luego `php artisan serve`.

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `PUBLIC_API_URL` | sí | URL base del backend (ej. `http://localhost:8000`). |
| `APP_NAME` | no  | Nombre de la app, usado en metadatos. |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Astro) |
| `npm run build` | Build de producción (SSR) |
| `npm run preview` | Preview del build |
| `npm run check` | Type-check con `astro check` |
| `npm run lint` | ESLint sobre `src/**/*.{ts,tsx,astro}` |
| `npm run lint:fix` | ESLint con auto-fix |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (falla si algo no está formateado) |
| `npm test` | Tests con Vitest (run único) |
| `npm run test:watch` | Tests en watch |

## CI

GitHub Actions corre en cada push/PR a `main`:

1. Instalación de dependencias (`npm ci --legacy-peer-deps`)
2. `astro check` (type-check)
3. ESLint
4. Prettier check
5. Build
6. Tests de Vitest

Ver `.github/workflows/ci.yml`.

## Convenciones

- **Commits**: `feat:` / `fix:` / `chore:` / `refactor:` / `docs:` seguido de descripción breve.
- **`any` está prohibido** (regla ESLint `no-explicit-any: error`). Única excepción documentada: `src/types/i18n.ts` para objetos de traducción de profundidad dinámica.
- **Llamadas a webhooks externos siempre pasan por el backend**, nunca directamente desde el cliente.

## Despliegue

El proyecto incluye un `Dockerfile` para build y ejecución con el adapter Node. Variable necesaria en producción: `PUBLIC_API_URL` apuntando al dominio público del backend.

```bash
docker build -t almha-frontend .
docker run -p 4321:4321 -e PUBLIC_API_URL=https://api.almhaplasticsurgery.com almha-frontend
```
