# VPS Admin Panel Troubleshooting Guide

## Issue: Admin Panel Page Gets Stuck/Loading

### Step 1: Check if Dependencies are Installed on VPS

SSH into your VPS and run:

```bash
cd /var/www/faltuverse/backend
npm list adminjs @adminjs/express @adminjs/sequelize express-session
```

If any are missing, install them:

```bash
cd /var/www/faltuverse/backend
npm install adminjs @adminjs/express @adminjs/sequelize express-session
```

### Step 2: Check Server Logs

Check if admin panel is initializing:

```bash
pm2 logs faltuverse-backend --lines 50
```

Look for these messages:
- `✅ Admin Panel initialized at: http://localhost:5000/admin`
- `🔐 Login with: admin / admin123`

If you don't see these, the admin panel is not initializing.

### Step 3: Restart Backend Server

```bash
pm2 restart faltuverse-backend
pm2 logs faltuverse-backend --lines 20
```

### Step 4: Test Admin Panel Directly

Test if admin panel is accessible:

```bash
# On VPS, test locally
curl http://localhost:5000/admin

# Should return HTML (not 404)
```

### Step 5: Check Nginx Configuration

Make sure nginx is proxying `/admin` correctly:

```bash
sudo nano /etc/nginx/sites-available/faltuverse.cloud
```

Ensure this block exists (BEFORE `/api` block):

```nginx
location /admin {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # WebSocket support
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    
    # Timeouts for AdminJS
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

Then reload nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Check Browser Console

Open browser DevTools (F12) and check:
1. **Console tab** - Look for JavaScript errors
2. **Network tab** - Check if requests to `/admin` are failing
3. Check if there are CORS errors

### Step 7: Verify Environment Variables

Check if `ADMINJS_SECRET` is set in backend `.env`:

```bash
cd /var/www/faltuverse/backend
cat .env | grep ADMINJS
```

If not set, add it:

```bash
echo "ADMINJS_SECRET=your-secret-key-here-change-in-production" >> .env
pm2 restart faltuverse-backend
```

### Step 8: Check Port and Firewall

```bash
# Check if port 5000 is listening
sudo netstat -tlnp | grep 5000

# Check firewall
sudo ufw status
```

### Step 9: Test Direct Access

Try accessing admin panel directly (bypassing nginx):

```
https://your-vps-ip:5000/admin
```

If this works but domain doesn't, it's an nginx issue.

### Step 10: Full Reinstall (Last Resort)

If nothing works, reinstall admin dependencies:

```bash
cd /var/www/faltuverse/backend
npm uninstall adminjs @adminjs/express @adminjs/sequelize
npm install adminjs@^6.8.7 @adminjs/express@^5.0.0 @adminjs/sequelize@^3.0.0
pm2 restart faltuverse-backend
```

## Common Issues and Solutions

### Issue: "Cannot GET /admin"
**Solution:** Nginx is not proxying `/admin`. Add the location block (Step 5).

### Issue: Page loads but shows blank/white screen
**Solution:** 
- Check browser console for errors
- Check if AdminJS assets are loading (Network tab)
- Verify `express-session` is installed

### Issue: Login page shows but login doesn't work
**Solution:**
- Check if cookies are enabled in browser
- Check if `ADMINJS_SECRET` is set
- Check server logs for authentication errors

### Issue: CORS errors in console
**Solution:** AdminJS should handle CORS, but check if nginx is adding CORS headers incorrectly.

## Quick Fix Script

Run this on VPS to check everything:

```bash
#!/bin/bash
echo "=== Checking Admin Panel Setup ==="

cd /var/www/faltuverse/backend

echo "1. Checking dependencies..."
npm list adminjs @adminjs/express @adminjs/sequelize express-session

echo "2. Checking if server is running..."
pm2 list | grep faltuverse-backend

echo "3. Checking recent logs..."
pm2 logs faltuverse-backend --lines 10 --nostream | grep -i admin

echo "4. Testing local access..."
curl -I http://localhost:5000/admin 2>&1 | head -5

echo "5. Checking nginx config..."
sudo nginx -t

echo "=== Done ==="
```

Save as `check-admin.sh`, make executable (`chmod +x check-admin.sh`), and run it.

