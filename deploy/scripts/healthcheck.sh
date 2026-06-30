#!/usr/bin/env bash
# Проверка работоспособности backend и frontend, с автоматическим
# перезапуском через PM2 при сбое. Логирует каждую проверку.
# Рекомендуется запускать через cron каждые 5 минут:
#
#   */5 * * * * /opt/vertex/deploy/scripts/healthcheck.sh >> /var/log/vertex/healthcheck.log 2>&1
#
# Опционально: задайте WEBHOOK_URL для уведомления (POST) при сбое.
set -uo pipefail

API_URL="${API_URL:-http://127.0.0.1:4000/api/health}"
WEB_URL="${WEB_URL:-http://127.0.0.1:3000/login}"
WEBHOOK_URL="${WEBHOOK_URL:-}"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S')"

notify() {
  local message="$1"
  echo "[$TIMESTAMP] $message"
  if [[ -n "$WEBHOOK_URL" ]]; then
    curl -fsS -X POST -H 'Content-Type: application/json' \
      -d "{\"text\":\"VERTEX ERP: $message\"}" "$WEBHOOK_URL" >/dev/null 2>&1 || true
  fi
}

check() {
  local name="$1" url="$2" pm2_name="$3"
  if curl -fsS -o /dev/null -m 10 "$url"; then
    echo "[$TIMESTAMP] OK: $name ($url)"
  else
    notify "$name недоступен ($url), перезапуск через PM2..."
    pm2 restart "$pm2_name" || notify "Не удалось перезапустить $pm2_name"
  fi
}

check "API" "$API_URL" "vertex-api"
check "Web" "$WEB_URL" "vertex-web"
