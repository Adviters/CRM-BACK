# PetShop CRM — Frontend

Frontend del CRM para empleados de veterinaria. Consume la API REST NestJS del proyecto `pet-shop`.

Roles soportados: **ADMIN**, **VETERINARIAN**, **RECEPTIONIST**.

---

## Requisitos

- Node.js 20+
- pnpm
- API NestJS corriendo (proyecto `pet-shop`, puerto `3000` por defecto)

---

## Cómo levantar el proyecto

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

Copiá el ejemplo y ajustá si hace falta:

```bash
cp .env.example .env
```

Contenido recomendado para desarrollo local:

```env
VITE_API_URL=/api
VITE_APP_NAME=PetShop CRM
```

Con `VITE_API_URL=/api`, Vite proxea las requests a `http://localhost:3000` (no hace falta CORS en el backend para desarrollo).

### 3. Levantar el backend

En el repo de la API (`pet-shop`):

```bash
# según el README del backend
pnpm start:dev
```

Swagger suele estar en: `http://localhost:3000/docs`

### 4. Levantar el frontend

```bash
pnpm dev
```

Abrí: [http://localhost:5173](http://localhost:5173)

### Login de prueba (seed típico del backend)

| Campo | Valor |
|-------|--------|
| Email | `admin@petshop.local` |
| Password | `Admin123!` |

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción (`tsc` + Vite) |
| `pnpm preview` | Preview del build |
| `pnpm lint` | ESLint |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm test:coverage` | Tests + cobertura (mín. 60%) |

Los tests viven en `src/tests/`.

---

## GitHub

La carpeta `.github/` incluye:

- CI (`workflows/ci.yml`) para PRs a `main`/`develop` y push a `develop`
- CodeQL (`workflows/codeql.yml`)
- Dependabot (npm + GitHub Actions)
- Templates de PR e Issues
- `CODEOWNERS` (reemplazar `@CHANGE_ME_OWNER`)

---

## Arquitectura

La app sigue una arquitectura **feature-based**: cada dominio (auth, clientes, mascotas, etc.) vive en su propia carpeta y puede crecer sin reorganizar el resto del proyecto.

### Estructura de carpetas

```text
src/
├── app/                 # Providers, Error Boundary, páginas globales (403/404)
├── router/              # Rutas + guards (auth / guest / roles)
├── components/
│   ├── ui/              # Primitivos reutilizables (Button, Input, Table…)
│   ├── layout/          # AppShell, Sidebar, Topbar, Breadcrumbs
│   ├── forms/           # FormField, Can (permisos en UI)
│   └── feedback/        # Loader, Skeleton, EmptyState, ConfirmDialog…
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── customers/
│   ├── pets/
│   ├── appointments/
│   ├── medical-records/
│   ├── vaccines/
│   └── users/
├── services/            # Axios (instancia + interceptores) y QueryClient
├── store/               # Zustand (solo auth + UI)
├── hooks/               # Hooks transversales
├── lib/                 # cn(), dayjs, validaciones Zod compartidas
├── types/               # Tipos/enums compartidos
├── constants/           # Rutas, permisos, query keys
├── utils/
└── styles/              # Tailwind + design tokens
```

Cada feature suele organizar así:

```text
features/<nombre>/
├── api/           # Llamadas HTTP tipadas
├── components/    # UI del dominio
├── hooks/         # useQuery / useMutation
├── pages/         # Pantallas de ruta
├── schemas/       # Zod (formularios)
└── types/         # DTOs alineados al backend
```

### Principios clave

1. **UI vs lógica**  
   Los componentes de página orquestan; la lógica de datos vive en hooks y `api/`.

2. **Datos del servidor → TanStack Query**  
   Listados, detalle, mutations e invalidaciones. No se cachean entidades del backend en Zustand.

3. **Estado global → Zustand (mínimo)**  
   Solo autenticación/usuario, sidebar y tema.

4. **HTTP → una sola instancia Axios**  
   Interceptores para:
   - adjuntar Access Token
   - refresh automático ante `401`
   - logout si el refresh falla
   - toasts de error centralizados

5. **Permisos**  
   - Rutas protegidas con `AuthGuard` / `RoleGuard`
   - Acciones de UI con `<Can permission="..." />` / `usePermissions()`
   - Matriz alineada a los roles del backend

6. **Formularios**  
   React Hook Form + Zod en todos los formularios.

### Flujo de datos (resumen)

```text
Página → hook (TanStack Query) → api (Axios) → NestJS /api
                ↑
         queryKeys + invalidaciones
```

---

## Módulos funcionales

| Módulo | Descripción |
|--------|-------------|
| Auth | Login, remember me, JWT, refresh, logout |
| Dashboard | Stats + gráficos |
| Clientes | CRUD, búsqueda, paginación, detalle |
| Mascotas | CRUD + detalle con clínica / vacunas / turnos |
| Historia clínica | Timeline append-only (Vet/Admin) |
| Vacunas | Listado y registro |
| Turnos | Calendario + tabla, crear/editar/cancelar |
| Usuarios | CRUD de staff (solo ADMIN) |

---

## Notas

- El cliente final **no** inicia sesión; el sistema es solo para el equipo de la clínica.
- Si cambiás `VITE_API_URL` a una URL absoluta (`http://localhost:3000/api`), necesitás CORS habilitado en NestJS.
- Path alias: `@/` apunta a `src/`.
