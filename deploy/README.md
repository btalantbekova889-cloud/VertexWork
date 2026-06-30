# Деплой VERTEX ERP — erp.vertex.kg

Пошаговая инструкция по развёртыванию backend (Fastify API) и frontend
(Next.js) на чистом Ubuntu/Debian VPS, с SSL, бэкапами БД и автоматическим
мониторингом. Все скрипты находятся в `deploy/scripts/`.

## 0. Перед началом

- Купите домен (в задаче указан `erp.vertex.kg`) и закажите VPS
  (Ubuntu 22.04/24.04, минимум 2 vCPU / 4 GB RAM).
- Сохраните IP-адрес сервера.

## 1. Настройка DNS

У регистратора домена создайте A-запись:

```
erp.vertex.kg.   A   <IP вашего сервера>
```

Проверьте распространение записи (может занять до пары часов):

```bash
dig +short erp.vertex.kg
```

## 2. Первоначальная настройка сервера

Подключитесь к серверу по SSH и запустите от root:

```bash
sudo bash deploy/scripts/setup-server.sh
```

Скрипт устанавливает Node.js 22 LTS, PM2, PostgreSQL 16, Nginx, Certbot,
создаёт пользователя и базу данных `vertex_erp`, настраивает каталоги для
логов/бэкапов и включает firewall (ufw: SSH + Nginx). В конце выводит
сгенерированный пароль БД и строку `DATABASE_URL` — **сохраните её**, она
понадобится на следующем шаге.

## 3. Клонирование репозитория и конфигурация

```bash
sudo mkdir -p /opt/vertex && sudo chown "$USER" /opt/vertex
git clone <URL_РЕПОЗИТОРИЯ> /opt/vertex
cd /opt/vertex
git checkout claude/frontend-redesign-ejj3lb   # или main, после слияния
```

Создайте `apps/api/.env` на основе `apps/api/.env.example`:

```bash
cp apps/api/.env.example apps/api/.env
```

Заполните в нём:
- `DATABASE_URL` — строка, выданная `setup-server.sh` на шаге 2
- `JWT_SECRET` — длинная случайная строка, например `openssl rand -hex 32`
- `CAMERA_SECRET_KEY` — отдельная случайная строка для авторизации камер
- `WEB_ORIGIN=https://erp.vertex.kg`

При необходимости создайте `apps/web/.env.production` на основе
`apps/web/.env.example` (по умолчанию `API_INTERNAL_URL=http://localhost:4000`
подходит, так как backend и frontend работают на одном сервере).

## 4. Сборка и запуск (PM2)

```bash
bash deploy/scripts/deploy.sh
```

Скрипт обновляет код из git, собирает backend (`prisma generate`,
`prisma migrate deploy`, `npm run build`) и frontend (`npm run build`),
затем запускает оба процесса через PM2 (`vertex-api` на порту 4000,
`vertex-web` на порту 3000) и сохраняет список процессов
(`pm2 save`) для автозапуска при перезагрузке сервера:

```bash
pm2 startup   # один раз, выполнить выведенную команду от root
pm2 save
```

На этом этапе сайт уже доступен по `http://<IP сервера>:3000`, но ещё не
через домен и без HTTPS.

## 5. Nginx

```bash
sudo cp deploy/nginx/erp.vertex.kg.conf /etc/nginx/sites-available/erp.vertex.kg.conf
sudo ln -s /etc/nginx/sites-available/erp.vertex.kg.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Nginx принимает весь трафик на `erp.vertex.kg` и проксирует его на
Next.js (`127.0.0.1:3000`). Next.js, в свою очередь, сам проксирует
`/api/*` на backend (`127.0.0.1:4000`) — отдельный proxy-блок для API в
Nginx не нужен (см. `apps/web/next.config.ts`, `rewrites()`).

## 6. SSL (Let's Encrypt)

Убедитесь, что DNS уже указывает на сервер (шаг 1), затем:

```bash
sudo bash deploy/scripts/setup-ssl.sh you@example.com
```

Скрипт выпускает сертификат через `certbot --nginx`, автоматически
патчит конфиг Nginx (добавляет `listen 443 ssl`) и проверяет
автопродление (`certbot renew --dry-run`, работает через systemd timer
`certbot.timer`).

После этого сайт доступен по `https://erp.vertex.kg`.

## 7. Бэкапы базы данных

Ежедневный бэкап с ротацией (хранит последние 14 дней):

```bash
crontab -e
# добавить строку:
0 3 * * * DB_USER=vertex_user PGPASSWORD='<пароль из шага 2>' /opt/vertex/deploy/scripts/backup.sh >> /var/log/vertex/backup.log 2>&1
```

Бэкапы (`*.sql.gz`) сохраняются в `/var/backups/vertex`. Параметры
переопределяются переменными окружения `DB_NAME`, `DB_USER`,
`BACKUP_DIR`, `KEEP_DAYS`.

## 8. Мониторинг и автоперезапуск

Проверка доступности API и frontend каждые 5 минут, с автоматическим
`pm2 restart` при сбое:

```bash
crontab -e
# добавить строку:
*/5 * * * * /opt/vertex/deploy/scripts/healthcheck.sh >> /var/log/vertex/healthcheck.log 2>&1
```

Опционально задайте `WEBHOOK_URL` (например, Slack/Telegram webhook) в
crontab для уведомлений о сбоях:

```bash
*/5 * * * * WEBHOOK_URL=https://hooks.example.com/... /opt/vertex/deploy/scripts/healthcheck.sh >> /var/log/vertex/healthcheck.log 2>&1
```

## 9. Обновление после изменений в коде

Для последующих деплоев достаточно повторно запустить:

```bash
cd /opt/vertex
bash deploy/scripts/deploy.sh
```

Скрипт сам подтянет новый код, пересоберёт оба приложения и перезапустит
их через PM2 без даунтайма (`pm2 reload`).

## Структура каталога `deploy/`

```
deploy/
├── README.md                    — этот файл
├── ecosystem.config.js          — конфигурация PM2 (vertex-api, vertex-web)
├── nginx/
│   └── erp.vertex.kg.conf       — конфиг Nginx (reverse proxy + SSL)
└── scripts/
    ├── setup-server.sh          — первоначальная настройка VPS (шаг 2)
    ├── deploy.sh                — сборка и (пере)запуск приложений (шаги 4, 9)
    ├── setup-ssl.sh             — выпуск SSL-сертификата (шаг 6)
    ├── backup.sh                — ежедневный бэкап БД (шаг 7)
    └── healthcheck.sh           — мониторинг + автоперезапуск (шаг 8)
```

## Полезные команды PM2

```bash
pm2 status              # статус процессов
pm2 logs vertex-api      # логи backend в реальном времени
pm2 logs vertex-web      # логи frontend в реальном времени
pm2 restart vertex-api   # перезапуск backend
pm2 monit                # мониторинг CPU/памяти в реальном времени
```
