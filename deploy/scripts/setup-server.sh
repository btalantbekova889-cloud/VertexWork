#!/usr/bin/env bash
# Первоначальная настройка чистого Ubuntu/Debian VPS под VERTEX ERP.
# Запускать один раз на новом сервере, от root (или через sudo).
#
#   sudo bash deploy/scripts/setup-server.sh
#
set -euo pipefail

DB_NAME="vertex_erp"
DB_USER="vertex_user"

if [[ $EUID -ne 0 ]]; then
  echo "Запустите скрипт от root: sudo bash $0" >&2
  exit 1
fi

echo "==> Обновление пакетов"
apt-get update -y
apt-get upgrade -y

echo "==> Установка базовых утилит"
apt-get install -y curl ca-certificates gnupg ufw ripgrep git

echo "==> Установка Node.js 22 LTS"
if ! command -v node >/dev/null || [[ "$(node -v)" != v22* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node -v
npm -v

echo "==> Установка PM2 (менеджер процессов Node.js)"
npm install -g pm2

echo "==> Установка PostgreSQL 16"
apt-get install -y postgresql postgresql-contrib

echo "==> Установка Nginx"
apt-get install -y nginx

echo "==> Установка Certbot (Let's Encrypt SSL)"
apt-get install -y certbot python3-certbot-nginx

echo "==> Настройка базы данных vertex_erp"
DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 32)
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASSWORD}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec
SQL

echo "==> Каталоги для логов и бэкапов"
mkdir -p /var/log/vertex /var/backups/vertex /var/www/certbot
chown -R "$SUDO_USER":"$SUDO_USER" /var/log/vertex /var/backups/vertex 2>/dev/null || true

echo "==> Настройка firewall (ufw)"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

cat <<EOF

============================================================
 Сервер настроен. Сгенерированный пароль для БД (сохраните!):

 DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"

 Дальнейшие шаги:
 1. Склонируйте репозиторий в /opt/vertex (или другой каталог)
 2. Создайте apps/api/.env на основе apps/api/.env.example,
    вставив строку DATABASE_URL выше
 3. Создайте apps/web/.env.production на основе .env.example (если нужно)
 4. Запустите deploy/scripts/deploy.sh
 5. Настройте DNS A-запись erp.vertex.kg -> IP этого сервера
 6. Запустите deploy/scripts/setup-ssl.sh для выпуска SSL-сертификата
============================================================
EOF
