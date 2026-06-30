#!/usr/bin/env bash
# Бэкап базы данных vertex_erp с ротацией старых копий.
# Рекомендуется запускать ежедневно через cron:
#
#   0 3 * * * /opt/vertex/deploy/scripts/backup.sh >> /var/log/vertex/backup.log 2>&1
#
set -euo pipefail

DB_NAME="${DB_NAME:-vertex_erp}"
DB_USER="${DB_USER:-vertex_user}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/vertex}"
KEEP_DAYS="${KEEP_DAYS:-14}"

mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date +%Y-%m-%d_%H-%M-%S)"
OUT_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "[$(date)] Создание бэкапа: $OUT_FILE"
PGPASSWORD="${PGPASSWORD:-}" pg_dump -U "$DB_USER" -h localhost "$DB_NAME" | gzip > "$OUT_FILE"

echo "[$(date)] Бэкап сохранён: $(du -h "$OUT_FILE" | cut -f1)"

echo "[$(date)] Удаление бэкапов старше $KEEP_DAYS дней"
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -mtime "+${KEEP_DAYS}" -print -delete

echo "[$(date)] Готово. Текущие бэкапы:"
ls -lh "$BACKUP_DIR"
