/
├─ public/                       # Archivos estáticos visibles públicamente
│   ├─ favicon.ico
│   ├─ images/
│   ├─ fonts/
│   └─ og-image.png
│
├─ src/
│   ├─ assets/                   # Archivos procesados por Astro/Vite
│   │   ├─ css/
│   │   │   └─ global.css
│   │   ├─ images/
│   │   └─ ts/
│
│   ├─ components/               # Componentes reutilizables
│   │   ├─ ui/                   # Botones, cards, inputs, etc
│   │   ├─ layout/               # Componentes pequeños del layout (Navbar, Footer)
│   │   └─ shared/               # Cosas usadas en muchas páginas
│
│   ├─ layouts/                  # Layouts principales
│   │   ├─ MainLayout.astro
│   │   ├─ AuthLayout.astro
│   │   └─ DashboardLayout.astro
│
│   ├─ middleware/               # SSR middlewares (auth, cookies, redirects)
│   │   └─ auth.ts
│
│   ├─ pages/                    # Rutas del sitio
│   │   ├─ index.astro
│   │   ├─ about.astro
│   │   ├─ blog/
│   │   │   ├─ index.astro       # Lista de posts
│   │   │   └─ [slug].astro      # Página dinámica del post
│   │   ├─ auth/
│   │   │   ├─ login.astro
│   │   │   └─ register.astro
│   │   └─ dashboard/
│   │       └─ index.astro
│
│   ├─ content/                  # Blog con Content Collections
│   │   ├─ blog/
│   │   │   ├─ mi-primer-post.md
│   │   │   └─ otro-post.md
│   │   └─ config.ts
│
│   ├─ lib/                      # Funciones y utilidades
│   │   ├─ api.ts                # Fetch a Laravel, por ejemplo
│   │   ├─ auth.ts               # Funciones de sesión/JWT
│   │   ├─ seo.ts                # Utilidades SEO
│   │   └─ helpers.ts
│
│   ├─ server/                   # Lógica para SSR si la quieres separar
│   │   ├─ auth/
│   │   │   └─ validateToken.ts
│   │   └─ db/
│   │       └─ connect.ts
│
│   └─ types/                    # Tipos globales de TypeScript
│       ├─ global.d.ts
│       └─ blog.ts
│
├─ astro.config.mjs
├─ package.json
└─ tsconfig.json
