#!/usr/bin/env bash
# Выпуск/обновление SSL-сертификата Let's Encrypt для erp.vertex.kg.
# Запускать ПОСЛЕ того как DNS A-запись erp.vertex.kg указывает на этот сервер,
# и ПОСЛЕ того как deploy/nginx/erp.vertex.kg.conf подключён в nginx.
#
#   sudo bash deploy/scripts/setup-ssl.sh you@example.com
#
set -euo pipefail

DOMAIN="erp.vertex.kg"
EMAIL="${1:-}"

if [[ $EUID -ne 0 ]]; then
  echo "Запустите скрипт от root: sudo bash $0 <email>" >&2
  exit 1
fi

if [[ -z "$EMAIL" ]]; then
  echo "Использование: sudo bash $0 you@example.com" >&2
  exit 1
fi

echo "==> Проверка DNS"
RESOLVED_IP=$(dig +short "$DOMAIN" | tail -n1 || true)
SERVER_IP=$(curl -fsS https://api.ipify.org || true)
if [[ -n "$RESOLVED_IP" && -n "$SERVER_IP" && "$RESOLVED_IP" != "$SERVER_IP" ]]; then
  echo "ВНИМАНИЕ: $DOMAIN указывает на $RESOLVED_IP, а IP этого сервера — $SERVER_IP."
  echo "Убедитесь, что DNS A-запись настроена правильно, прежде чем продолжать."
  read -rp "Продолжить всё равно? [y/N] " confirm
  [[ "$confirm" == "y" || "$confirm" == "Y" ]] || exit 1
fi

mkdir -p /var/www/certbot

echo "==> Выпуск сертификата через certbot (nginx plugin)"
certbot --nginx \
  -d "$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --redirect \
  -m "$EMAIL"

echo "==> Проверка автопродления"
certbot renew --dry-run

cat <<EOF

============================================================
 Готово: https://${DOMAIN} защищён SSL-сертификатом Let's Encrypt.
 Автопродление настроено через systemd timer certbot.timer
 (проверить: systemctl status certbot.timer)
============================================================
EOF
