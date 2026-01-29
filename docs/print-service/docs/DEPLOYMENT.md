# Deployment Guide

Complete guide for deploying 3D Print Service to production.

## Target Environment

- **OS**: Ubuntu 20.04+ LTS
- **Node.js**: 18+ (LTS recommended)
- **Web Server**: Nginx
- **Process Manager**: Systemd or PM2
- **Optional**: Docker + Docker Compose

---

## Option 1: Traditional Deployment (Nginx + Systemd)

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install build tools
sudo apt install -y build-essential

# Optional: Install CuraEngine
wget https://github.com/Ultimaker/CuraEngine/releases/download/5.2.0/CuraEngine
chmod +x CuraEngine
sudo mv CuraEngine /usr/local/bin/
```

### 2. Application Deployment

```bash
# Create application directory
sudo mkdir -p /var/www/print-service
sudo chown $USER:$USER /var/www/print-service

# Clone repository
cd /var/www
git clone <your-repo-url> print-service
cd print-service

# Backend setup
cd server
npm ci --production
cp .env.example .env
nano .env  # Configure production settings

# Run migrations
npm run migrate
npm run seed

# Frontend build
cd ../client
npm ci
npm run build
# Output: dist/
```

### 3. Environment Configuration

Edit `server/.env`:

```bash
NODE_ENV=production
PORT=3100
DATABASE_PATH=./var/app.sqlite
JWT_SECRET=<generate-strong-secret>
UPLOAD_DIR=./var/uploads
CURA_ENGINE_PATH=/usr/local/bin/CuraEngine
```

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Nginx Configuration

Create `/etc/nginx/sites-available/print-service`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name print.example.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name print.example.com;

    # SSL Configuration (use certbot for Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/print.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/print.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend static files
    root /var/www/print-service/client/dist;
    index index.html;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/javascript application/json application/xml+rss;

    # Frontend SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # File uploads (large files)
    client_max_body_size 100M;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/print-service /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d print.example.com
sudo systemctl reload nginx
```

### 6. Systemd Service

Create `/etc/systemd/system/print-service.service`:

```ini
[Unit]
Description=3D Print Service Backend
Documentation=https://github.com/yourorg/print-service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/print-service/server
Environment=NODE_ENV=production
ExecStart=/usr/bin/node index.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=print-service

# Security
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable print-service
sudo systemctl start print-service
sudo systemctl status print-service
```

View logs:
```bash
sudo journalctl -u print-service -f
```

---

## Option 2: Docker Deployment

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "3100:3100"
    environment:
      - NODE_ENV=production
      - PORT=3100
      - DATABASE_PATH=/app/data/app.sqlite
      - JWT_SECRET=${JWT_SECRET}
      - UPLOAD_DIR=/app/data/uploads
    volumes:
      - ./server/var:/app/data
      - ./server/.env:/app/.env:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3100/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: unless-stopped
```

### Backend Dockerfile

Create `server/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy application
COPY . .

# Create data directories
RUN mkdir -p var/uploads var/slicing-cache

# Expose port
EXPOSE 3100

# Run migrations on startup
CMD ["sh", "-c", "npm run migrate && node index.js"]
```

### Frontend Dockerfile

Create `client/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Frontend Nginx Config

Create `client/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
```

### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Database Backup

### Manual Backup

```bash
# Backup SQLite database
cd /var/www/print-service/server/var
sqlite3 app.sqlite ".backup app_backup_$(date +%Y%m%d_%H%M%S).sqlite"
```

### Automated Backups

Create `/usr/local/bin/backup-print-service.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/print-service"
DB_PATH="/var/www/print-service/server/var/app.sqlite"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
sqlite3 $DB_PATH ".backup $BACKUP_DIR/app_$TIMESTAMP.sqlite"

# Keep only last 30 days
find $BACKUP_DIR -name "app_*.sqlite" -mtime +30 -delete

echo "Backup completed: app_$TIMESTAMP.sqlite"
```

Add to crontab:
```bash
sudo chmod +x /usr/local/bin/backup-print-service.sh
sudo crontab -e

# Add line: Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-print-service.sh >> /var/log/print-service-backup.log 2>&1
```

---

## Monitoring

### Health Check Endpoint

```bash
curl http://localhost:3100/health
```

### System Monitoring

Install monitoring tools:
```bash
sudo apt install -y htop iotop nethogs
```

### Log Management

Configure log rotation `/etc/logrotate.d/print-service`:

```
/var/log/print-service/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload print-service > /dev/null 2>&1 || true
    endscript
}
```

---

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall (ufw)
- [ ] Disable root SSH login
- [ ] Use SSH keys instead of passwords
- [ ] Set up fail2ban for brute force protection
- [ ] Regular security updates (`apt upgrade`)
- [ ] Restrict file permissions on `.env` files
- [ ] Enable database backups
- [ ] Configure rate limiting in application
- [ ] Review and minimize exposed ports

### Firewall Setup

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Performance Optimization

### Database Optimization

```sql
-- Add indexes (already in migrations)
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = -64000;  -- 64MB cache
```

### Node.js Process Management

Consider using PM2 for advanced process management:

```bash
sudo npm install -g pm2

# Start application
cd /var/www/print-service/server
pm2 start index.js --name print-service

# Save process list
pm2 save

# Auto-restart on system boot
pm2 startup systemd
```

---

## Troubleshooting

### Check Service Status
```bash
sudo systemctl status print-service
sudo journalctl -u print-service --since "1 hour ago"
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t
tail -f /var/log/nginx/error.log
```

### Database Issues
```bash
cd /var/www/print-service/server/var
sqlite3 app.sqlite "PRAGMA integrity_check;"
```

### Disk Space
```bash
df -h
du -sh /var/www/print-service/server/var/*
```

---

## Update/Rollback Procedure

### Update Application

```bash
cd /var/www/print-service

# Backup database
./backup.sh

# Pull latest code
git pull origin main

# Update backend
cd server
npm ci --production
npm run migrate

# Rebuild frontend
cd ../client
npm ci
npm run build

# Restart services
sudo systemctl restart print-service
sudo systemctl reload nginx
```

### Rollback

```bash
git checkout <previous-commit>
# Restore database backup if needed
sqlite3 var/app.sqlite < backups/app_YYYYMMDD_HHMMSS.sql
sudo systemctl restart print-service
```

---

## Support

For deployment issues:
- Check logs: `journalctl -u print-service`
- Review Nginx logs: `/var/log/nginx/`
- Contact: devops@example.com

**Last Updated:** 2026-01-11
