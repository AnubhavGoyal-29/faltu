# VPS Nginx Fix for Admin Panel

## Problem
Admin panel is initialized on VPS but not accessible via `https://faltuverse.cloud/admin`

## Solution: Fix Nginx Configuration

### Step 1: Edit Nginx Config
```bash
ssh root@72.61.170.102
sudo nano /etc/nginx/sites-available/faltuverse.cloud
```

### Step 2: Add/Update Admin Location Block

**IMPORTANT:** The `/admin` location block MUST be BEFORE the `/api` location block!

Find your nginx config and make sure it looks like this:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name faltuverse.cloud www.faltuverse.cloud;

    # SSL certificates
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Admin Panel - MUST be BEFORE /api
    location /admin {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering off;
        proxy_request_buffering off;
    }

    # Backend API - MUST be AFTER /admin
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
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

### Step 3: Test and Reload Nginx
```bash
# Test configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### Step 4: Test Admin Panel
```bash
# Test locally on VPS
curl -I http://localhost:5000/admin

# Should return HTTP 302 (redirect to login) or 200
```

### Step 5: Access from Browser
```
https://faltuverse.cloud/admin
```

Login with:
- Username: `admin`
- Password: `admin123`

## Quick Check Commands

```bash
# Check if nginx config has /admin block
sudo grep -A 10 "location /admin" /etc/nginx/sites-available/faltuverse.cloud

# Check nginx error logs if still not working
sudo tail -f /var/log/nginx/error.log

# Check if backend is accessible
curl http://localhost:5000/admin

# Check nginx access logs
sudo tail -f /var/log/nginx/access.log
```

## Common Issues

### Issue: 404 Not Found
**Cause:** `/admin` location block missing or after `/api` block
**Fix:** Add `/admin` block BEFORE `/api` block

### Issue: 502 Bad Gateway
**Cause:** Backend not running or wrong proxy_pass URL
**Fix:** Check `pm2 list` and verify `proxy_pass http://localhost:5000;`

### Issue: Page loads but stuck
**Cause:** WebSocket not configured or timeouts too short
**Fix:** Add WebSocket headers and increase timeouts (see config above)

### Issue: CORS errors
**Cause:** AdminJS handles CORS, but check nginx isn't adding conflicting headers
**Fix:** Don't add CORS headers in nginx for `/admin` location

