# Локальная настройка PostgreSQL 18 (без Docker)
# Запустите от имени пользователя postgres или через pgAdmin.

# 1. Создание пользователя и базы
CREATE USER vertex WITH PASSWORD 'vertex_secret';
CREATE DATABASE vertexwork OWNER vertex;
GRANT ALL PRIVILEGES ON DATABASE vertexwork TO vertex;

# 2. После этого в appsettings.Development.json укажите:
# "Database": { "Provider": "Postgres" },
# "ConnectionStrings": {
#   "DefaultConnection": "Host=localhost;Port=5432;Database=vertexwork;Username=vertex;Password=vertex_secret"
# }

# Применить миграции:
# dotnet ef database update --project src/VertexWork.Infrastructure --startup-project src/VertexWork.Api
