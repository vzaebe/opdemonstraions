# Deployment Guide

This guide explains how to deploy the application with frontend on hosting and backend on VPS.

## Architecture Overview

```
┌─────────────────┐         HTTP/API         ┌─────────────────┐
│                 │ ───────────────────────> │                 │
│  Frontend       │                          │  Backend (VPS)  │
│  (Hosting)      │ <─────────────────────── │  (Port 3001)    │
│  Static Files   │                          │  Express API    │
└─────────────────┘                          └─────────────────┘
```

- **Frontend**: Built static files deployed to hosting (FTP, GitHub Pages, etc.)
- **Backend**: Node.js Express server running on VPS at IPv4 address
- **Connection**: Frontend makes API calls to backend via `VITE_API_URL`

## Step 1: Backend Deployment (VPS)

### 1.1 Prepare VPS Server

1. SSH into your VPS
2. Install Node.js (v18+ recommended)
3. Clone or upload your project

### 1.2 Configure Backend Environment

Create `.env` file on VPS in the project root:

```bash
# Backend Configuration
PORT=3001
HOST=0.0.0.0
PORT_FALLBACK=false
PORT_MAX_ATTEMPTS=1

# CORS - Allow your frontend domain and VPS IP
CORS_ORIGINS=https://yourdomain.com,http://YOUR_VPS_IP:3001

# Authentication (USE STRONG SECRET!)
AUTH_JWT_SECRET=your-very-strong-random-secret-here
AUTH_JWT_EXPIRES_IN=7d

# Telemetry
TELEMETRY_SALT=your-random-salt-here

# Database (optional - defaults to server/var/app.sqlite)
# DB_PATH=/var/www/opland/data/app.sqlite
```

Replace:
- `YOUR_VPS_IP` with your actual VPS IPv4 address (e.g., `123.45.67.89`)
- `yourdomain.com` with your actual frontend domain

### 1.3 Install Dependencies and Start

```bash
# Install dependencies
npm install

# Start backend (production mode)
npm run server:prod

# Or use PM2 for process management:
npm install -g pm2
pm2 start server/index.js --name "opland-backend" --env production
pm2 save
pm2 startup  # Follow instructions to enable auto-start
```

### 1.4 Configure Firewall

Allow port 3001 through firewall:

```bash
# Ubuntu/Debian
sudo ufw allow 3001/tcp

# Or with iptables
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT
```

### 1.5 (Optional) Set Up Reverse Proxy (Nginx)

For better security and SSL, use Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Then use `https://api.yourdomain.com/api` as `VITE_API_URL` instead of IP address.

## Step 2: Frontend Build and Deployment

### 2.1 Configure Production Environment

Create `.env.production` file in project root:

```bash
# Frontend Production Configuration
# Replace YOUR_VPS_IP with your actual VPS IPv4 address
VITE_API_URL=http://YOUR_VPS_IP:3001/api
VITE_API_TIMEOUT=10000
```

**Or if using reverse proxy:**
```bash
VITE_API_URL=https://api.yourdomain.com/api
VITE_API_TIMEOUT=10000
```

### 2.2 Build Frontend

```bash
# Build for production
npm run build

# Output will be in dist/ folder
```

### 2.3 Deploy to Hosting

Upload the contents of `dist/` folder to your hosting:

- **FTP**: Upload all files from `dist/` to your hosting root
- **GitHub Pages**: Use `npm run deploy` (if configured)
- **Other hosting**: Follow your hosting provider's instructions

## Step 3: Verify Deployment

### 3.1 Test Backend

```bash
# From your local machine or VPS
curl http://YOUR_VPS_IP:3001/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

### 3.2 Test Frontend

1. Open your frontend URL in browser
2. Open browser DevTools → Network tab
3. Check that API calls are going to correct backend URL
4. Verify no CORS errors in console

### 3.3 Common Issues

**CORS Errors:**
- Ensure `CORS_ORIGINS` includes your frontend domain
- Check that backend is accessible from frontend

**Connection Refused:**
- Verify firewall allows port 3001
- Check backend is running: `pm2 list` or `ps aux | grep node`
- Verify VPS IP address is correct

**404 on API calls:**
- Check `VITE_API_URL` in `.env.production`
- Ensure backend routes are correct
- Verify reverse proxy configuration (if used)

## Step 4: Print Service (Optional)

If you're also deploying the print service:

1. See `print-service/README.md` for print service deployment
2. Print service runs on port 3100 by default
3. Configure print service frontend to point to print service backend
4. Update CORS settings to include print service frontend domain

## Security Considerations

1. **Use HTTPS**: Set up SSL certificates (Let's Encrypt is free)
2. **Strong Secrets**: Use strong, random secrets for JWT and telemetry
3. **Firewall**: Only expose necessary ports
4. **Environment Variables**: Never commit `.env` files to git
5. **Rate Limiting**: Backend has rate limiting enabled
6. **CORS**: Restrict CORS origins to known domains only

## Monitoring

### Backend Health Check

```bash
# Add to monitoring service
curl http://YOUR_VPS_IP:3001/api/health
```

### Logs

```bash
# PM2 logs
pm2 logs opland-backend

# Or if running directly
# Logs will appear in console
```

## Updates

### Update Backend

```bash
# On VPS
cd /path/to/project
git pull  # or upload new files
npm install
pm2 restart opland-backend
```

### Update Frontend

1. Update `.env.production` if needed
2. Rebuild: `npm run build`
3. Upload new `dist/` files to hosting

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :3001
# or
sudo netstat -tulpn | grep 3001

# Kill the process if needed
sudo kill -9 <PID>
```

### Backend Won't Start

1. Check Node.js version: `node --version` (should be 18+)
2. Check logs: `pm2 logs opland-backend`
3. Verify `.env` file exists and has correct values
4. Check database permissions if using custom DB_PATH

### Frontend Can't Connect

1. Verify `VITE_API_URL` in built files (check `dist/assets/*.js`)
2. Test backend directly: `curl http://YOUR_VPS_IP:3001/api/health`
3. Check browser console for CORS errors
4. Verify firewall allows connections
