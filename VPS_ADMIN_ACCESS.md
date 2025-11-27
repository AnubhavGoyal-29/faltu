# VPS Admin Panel Access Guide

## Current VPS Setup
- **Domain:** `faltuverse.cloud`
- **Backend Port:** 5000 (default)
- **Frontend Port:** 3000

## Admin Panel Access Options

### Option 1: Direct Backend Port (If Port 5000 is Exposed)
```
https://faltuverse.cloud:5000/admin
```
OR
```
http://faltuverse.cloud:5000/admin
```

### Option 2: Through Domain (If Nginx Proxies All Backend Routes)
```
https://faltuverse.cloud/admin
```

### Option 3: Through API Subdomain/Path (If Nginx Proxies /api)
```
https://faltuverse.cloud/api/admin
```
OR if you have an API subdomain:
```
https://api.faltuverse.cloud/admin
```

## Nginx Configuration Needed

If admin panel is not accessible, you need to configure nginx to proxy `/admin` to backend.

### Example Nginx Config:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name faltuverse.cloud www.faltuverse.cloud;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name faltuverse.cloud www.faltuverse.cloud;

    # SSL certificates (adjust paths)
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend (Vite dev server or built files)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Admin Panel - IMPORTANT: Must be before /api
    location /admin {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support for AdminJS
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Quick Check Commands (Run on VPS)

1. **Check if backend is running:**
```bash
pm2 list
pm2 logs faltuverse-backend
```

2. **Check if port 5000 is accessible:**
```bash
curl http://localhost:5000/admin
```

3. **Check nginx config:**
```bash
sudo nginx -t
sudo systemctl status nginx
```

4. **Check nginx config file location:**
```bash
sudo find /etc/nginx -name "*.conf" | grep -i faltu
# Or check default sites
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/
```

## Login Credentials
- **Username:** `admin`
- **Password:** `admin123`

## Troubleshooting

### If `/admin` shows 404:
- Nginx is not proxying `/admin` to backend
- Add the `/admin` location block in nginx config (see above)

### If `/admin` shows connection refused:
- Backend is not running on port 5000
- Check: `pm2 list` and `pm2 logs faltuverse-backend`

### If `/admin` redirects to login but login doesn't work:
- Check AdminJS session configuration
- Check if cookies are being set properly
- Check browser console for errors

### If you can access locally but not on VPS:
- Check firewall rules: `sudo ufw status`
- Check if port 5000 is open: `sudo ufw allow 5000`
- Or use nginx proxy (recommended) instead of exposing port directly

## Recommended Setup

**Best Practice:** Use nginx to proxy `/admin` to backend (Option 2 above)
- More secure (no direct port exposure)
- Works with SSL/HTTPS
- Consistent with other routes

