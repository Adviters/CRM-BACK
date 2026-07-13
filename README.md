# Pet Shop CRM API

Backend NestJS para un CRM orientado a veterinarias y pet shops.

## Stack

- NestJS
- PostgreSQL
- Prisma ORM
- JWT + Refresh Token
- Swagger
- Docker Compose

## Arquitectura

El backend usa una **arquitectura modular** por dominio. Cada módulo de negocio se organiza así:

```
módulo/
  controller   → endpoints HTTP + Swagger
  service      → reglas de negocio
  repository   → acceso a datos (Prisma)
  dto/         → validación de entrada/salida
  mappers/     → conversión entidad → response (nunca se expone Prisma directo)
```

Capas transversales:

| Carpeta | Rol |
|---------|-----|
| `common/` | decorators, guards de roles, enums, DTOs compartidos |
| `config/` | variables de entorno con `ConfigModule` |
| `database/` | `PrismaService` global |

Flujo típico de un request:

`Controller` → `Service` → `Repository` → PostgreSQL

La autenticación (JWT + refresh) y los roles (`ADMIN`, `VETERINARIAN`, `RECEPTIONIST`) se aplican de forma global con guards.

## Requisitos

- Node.js 22+
- [pnpm](https://pnpm.io/)
- Docker Desktop (para PostgreSQL)

## Cómo levantar el proyecto

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Revisá `.env` y, en producción, cambiá los secretos JWT y la contraseña del admin.

### 3. Levantar PostgreSQL

Asegurate de que Docker Desktop esté en ejecución y luego:

```bash
pnpm docker:up
```

Esto levanta Postgres en `localhost:5432` con:

- Usuario: `petshop`
- Contraseña: `petshop`
- Base: `petshop`

### 4. Migraciones y seed

```bash
pnpm prisma:generate
pnpm prisma:migrate:deploy
pnpm prisma:seed
```

El seed crea el usuario administrador:

| Campo | Valor |
|-------|--------|
| Email | `admin@petshop.local` |
| Password | `Admin123!` |

### 5. Arrancar la API

```bash
# desarrollo (watch mode)
pnpm start:dev

# producción
pnpm build
pnpm start:prod
```

La API queda en:

- API: [http://localhost:3000/api](http://localhost:3000/api)
- Health: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)

## Scripts útiles

| Script | Descripción |
|--------|-------------|
| `pnpm start:dev` | API en modo desarrollo |
| `pnpm build` | Compilar TypeScript |
| `pnpm start:prod` | Ejecutar build de producción |
| `pnpm docker:up` | Levantar Postgres |
| `pnpm docker:down` | Detener contenedores |
| `pnpm prisma:migrate` | Crear/aplicar migraciones (dev) |
| `pnpm prisma:migrate:deploy` | Aplicar migraciones existentes |
| `pnpm prisma:seed` | Cargar usuario admin |
| `pnpm prisma:studio` | UI de Prisma |
| `pnpm lint` | ESLint |
| `pnpm test` | Tests unitarios |
| `pnpm test:e2e` | Tests e2e |

## Módulos

- `auth` — login, refresh, logout
- `users` — gestión de usuarios (ADMIN)
- `customers` — clientes
- `pets` — mascotas
- `medical-records` — historias clínicas (inmutables)
- `vaccines` — vacunas
- `appointments` — turnos
- `dashboard` — indicadores generales

## Roles

- **ADMIN** — acceso total
- **VETERINARIAN** — consulta + historias clínicas + vacunas
- **RECEPTIONIST** — clientes, mascotas (datos básicos) y agenda

## Autenticación rápida

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@petshop.local\",\"password\":\"Admin123!\"}"
```

Usá el `accessToken` en Swagger (Authorize) o en el header:

```http
Authorization: Bearer <accessToken>
```

## Detener el entorno

```bash
# detener la API (Ctrl+C en la terminal)
pnpm docker:down
```
