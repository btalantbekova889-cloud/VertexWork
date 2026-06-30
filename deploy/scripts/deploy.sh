#!/usr/bin/env bash
# Деплой/обновление VERTEX ERP на сервере.
# Запускать из корня репозитория на сервере:
#
#   bash deploy/scripts/deploy.sh
#
# Переменная DEPLOY_BRANCH задаёт ветку для git pull (по умолчанию main).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BRANCH="${DEPLOY_BRANCH:-main}"
cd "$ROOT_DIR"

echo "==> Обновление кода (ветка: $BRANCH)"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "==> Сборка backend (apps/api)"
cd "$ROOT_DIR/apps/api"
if [[ ! -f .env ]]; then
  echo "ОШИБКА: apps/api/.env не найден. Скопируйте .env.example и заполните значения." >&2
  exit 1
fi
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build

echo "==> Сборка frontend (apps/web)"
cd "$ROOT_DIR/apps/web"
npm ci
npm run build

echo "==> Перезапуск процессов через PM2"
cd "$ROOT_DIR"
if pm2 describe vertex-api >/dev/null 2>&1; then
  pm2 reload deploy/ecosystem.config.js
else
  pm2 start deploy/ecosystem.config.js
fi
pm2 save

echo "==> Готово. Статус процессов:"
pm2 status
