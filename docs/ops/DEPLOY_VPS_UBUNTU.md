## Ubuntu VPS: простой деплой backend (git pull + systemd)

Цель: чтобы после `git pull` и `systemctl restart` всё работало без ручных действий.

### 1) Установить зависимости ОС (для SQLite)

`better-sqlite3` может потребовать сборку нативного модуля. На Ubuntu обычно достаточно:

```bash
sudo apt update
sudo apt install -y git build-essential python3
```

### 2) Установить Node.js

Используйте Node.js 18+ (как в README).

### 3) Клонировать репозиторий и поставить зависимости

```bash
git clone <YOUR_REPO_URL> /opt/opdemonstraions
cd /opt/opdemonstraions
npm ci
```

### 4) Настроить env

Вариант A (рекомендуется): env через systemd unit (см. ниже).

Минимальные переменные для backend:
- `PORT=3000`
- `CORS_ORIGINS=https://YOUR_FRONTEND_DOMAIN`
- `AUTH_JWT_SECRET=<long random string>`
- `TELEMETRY_SALT=<another random string>`

### 5) Создать пользователей

```bash
AUTH_JWT_SECRET="..." CORS_ORIGINS="https://..." TELEMETRY_SALT="..." npm run server:create-user -- admin StrongPassword admin
AUTH_JWT_SECRET="..." CORS_ORIGINS="https://..." TELEMETRY_SALT="..." npm run server:create-user -- editor AnotherPassword moderator
AUTH_JWT_SECRET="..." CORS_ORIGINS="https://..." TELEMETRY_SALT="..." npm run server:create-user -- super StrongPassword super_admin
```

### 6) systemd unit

Создайте файл `/etc/systemd/system/opdemonstraions.service`:

```ini
[Unit]
Description=Open Perspectives API
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/opdemonstraions
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=CORS_ORIGINS=https://YOUR_FRONTEND_DOMAIN
Environment=AUTH_JWT_SECRET=CHANGE_ME
Environment=AUTH_JWT_EXPIRES_IN=7d
Environment=TELEMETRY_SALT=CHANGE_ME_TOO
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=2

[Install]
WantedBy=multi-user.target
```

Далее:

```bash
sudo systemctl daemon-reload
sudo systemctl enable opdemonstraions
sudo systemctl start opdemonstraions
sudo systemctl status opdemonstraions --no-pager
```

Логи:

```bash
journalctl -u opdemonstraions -f
```

### 7) Обновление (git pull)

```bash
cd /opt/opdemonstraions
git pull
npm ci
sudo systemctl restart opdemonstraions
```

