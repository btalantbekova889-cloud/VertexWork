# Vertex Work — Backend API

Корпоративный ERP/CRM/WMS-бэкенд для добывающей компании Vertex. Реализован на **C# / .NET 8** с модульной монолитной архитектурой.

## Стек

| Слой | Технологии |
|------|------------|
| API | ASP.NET Core 8, Swagger |
| Application | FluentValidation, DTO, сервисы |
| Domain | Сущности, роли, enum статусов |
| Infrastructure | EF Core + PostgreSQL, Redis, JWT, TOTP 2FA, BCrypt |
| Хранилище файлов | MinIO (S3-совместимое) — docker-compose |

## Структура решения

```
src/
  VertexWork.Domain/          — доменная модель
  VertexWork.Application/     — контракты и бизнес-DTO
  VertexWork.Infrastructure/  — EF Core, auth, сервисы
  VertexWork.Api/             — REST API
docker-compose.yml            — PostgreSQL, Redis, MinIO
```

## Быстрый старт (без Docker)

По умолчанию в режиме **Development** используется **SQLite** — ничего устанавливать не нужно:

```bash
dotnet run --project src/VertexWork.Api
```

База создаётся автоматически в файле `src/VertexWork.Api/vertexwork.dev.db`.

Swagger: `https://localhost:7xxx/swagger`

### Вариант A — SQLite (рекомендуется для локальной разработки)

Уже настроено в `appsettings.Development.json`:

```json
"Database": { "Provider": "Sqlite" },
"ConnectionStrings": { "DefaultConnection": "Data Source=vertexwork.dev.db" }
```

### Вариант B — PostgreSQL (локально или Docker)

**Docker** (если установлен Docker Desktop):

```bash
docker compose up -d
```

**Локальный PostgreSQL 18** (у вас уже установлен): создайте пользователя и БД:

```bash
psql -U postgres -f scripts/setup-postgres.sql
```

Затем в `appsettings.Development.json` переключите провайдер:

```json
"Database": { "Provider": "Postgres" },
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=vertexwork;Username=vertex;Password=vertex_secret"
}
```

### Запуск API
```bash
dotnet run --project src/VertexWork.Api
```

Swagger: `https://localhost:7xxx/swagger` (порт из launchSettings.json)

При первом запуске автоматически применяются миграции и seed-данные.

## Демо-пользователи

| Email | Пароль | Роль |
|-------|--------|------|
| director@vertex.ru | Vertex2026! | Генеральный директор |
| sales@vertex.ru | Vertex2026! | Менеджер по продажам |
| finance@vertex.ru | Vertex2026! | Бухгалтер |
| dispatch@vertex.ru | Vertex2026! | Диспетчер |
| weigher@vertex.ru | Vertex2026! | Весовщик |
| quarry@vertex.ru | Vertex2026! | Начальник карьера |

## Сквозной pipeline заказа

```
POST /api/orders                          → SalesManager (Новый)
POST /api/orders/{id}/finance-approval    → Accountant (Оплачен)
POST /api/orders/{id}/dispatch            → Dispatcher (В производстве)
POST /api/orders/{id}/quarry-confirm      → QuarryChief
POST /api/orders/{id}/weigh               → Weigher (На весовой + WMS списание)
POST /api/orders/{id}/start-transit       → Dispatcher/Driver (В пути)
POST /api/orders/{id}/delivered           → Dispatcher/Driver (Доставлен)
POST /api/orders/{id}/close               → Accountant (Закрыт)
```

## Основные эндпоинты

| Модуль | Маршрут |
|--------|---------|
| Auth | `POST /api/auth/login`, `/refresh`, `/logout`, `/2fa/setup`, `/2fa/enable` |
| CRM | `GET/POST/PUT /api/clients` |
| Заказы | `GET/POST /api/orders`, pipeline-эндпоинты |
| Транспорт | `GET/POST /api/vehicles` |
| WMS | `GET /api/warehouse/stock` |
| Дашборд | `GET /api/dashboard/summary`, `/pipeline` |
| Аудит | `GET /api/audit` |
| Health | `GET /api/health` |

## Безопасность

- JWT Access + Refresh в **HttpOnly cookies** (`vw_access`, `vw_refresh`)
- RBAC по ролям из ТЗ
- TOTP 2FA (Google Authenticator)
- Append-only журнал `audit_logs`

## Конфигурация

`src/VertexWork.Api/appsettings.json`:

- `ConnectionStrings:DefaultConnection` — PostgreSQL
- `ConnectionStrings:Redis` — Redis
- `Jwt:Secret` — ключ подписи (мин. 32 символа)
- `Cors:Origins` — фронтенд Next.js

## Миграции EF Core

```bash
dotnet ef migrations add InitialCreate --project src/VertexWork.Infrastructure --startup-project src/VertexWork.Api
dotnet ef database update --project src/VertexWork.Infrastructure --startup-project src/VertexWork.Api
```
