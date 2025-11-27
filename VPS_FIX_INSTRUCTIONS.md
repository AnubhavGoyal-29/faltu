# VPS Admin Panel Fix - Step by Step

## Quick Fix (Run these commands on VPS)

### Step 1: SSH into VPS
```bash
ssh root@72.61.170.102
# Password: ai-247@Solutions
```

### Step 2: Run Diagnostic Script
```bash
cd /var/www/faltuverse
chmod +x check-admin-vps.sh
./check-admin-vps.sh
```

### Step 3: Install Dependencies and Fix
```bash
cd /var/www/faltuverse/backend

# Install AdminJS dependencies
npm install adminjs@^6.8.7 @adminjs/express@^5.0.0 @adminjs/sequelize@^3.0.0 express-session@^1.18.2

# Verify installation
npm list adminjs @adminjs/express @adminjs/sequelize express-session

# Restart backend
pm2 restart faltuverse-backend

# Check logs
pm2 logs faltuverse-backend --lines 30 --nostream | grep -i admin
```

### Step 4: Test Locally on VPS
```bash
curl http://localhost:5000/admin
```

Should return HTML (not 404 or error).

### Step 5: Check Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/faltuverse.cloud
```

Make sure this block exists (BEFORE `/api` block):

```nginx
    # Admin Panel - MUST be before /api
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        ...
    }
```

Then:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Test from Browser
```
https://faltuverse.cloud/admin
```

Login with:
- Username: `admin`
- Password: `admin123`

## Common Issues

### Issue 1: Dependencies Not Installed
**Solution:** Run `npm install` in backend directory

### Issue 2: Admin Panel Not in Logs
**Check:** 
```bash
pm2 logs faltuverse-backend | grep -i admin
```
If nothing appears, admin panel is not initializing. Check if `src/admin/adminPanel.js` exists.

### Issue 3: 404 Error
**Solution:** Nginx is not proxying `/admin`. Add location block (Step 5).

### Issue 4: Page Stuck/Loading
**Check:**
1. Browser console (F12) for errors
2. Network tab for failed requests
3. Server logs for errors

### Issue 5: CORS Errors
**Solution:** AdminJS handles CORS, but check nginx is not adding conflicting headers.

## Manual Verification

```bash
# 1. Check if file exists
ls -la /var/www/faltuverse/backend/src/admin/adminPanel.js

# 2. Check if imported in server.js
grep "adminPanel" /var/www/faltuverse/backend/src/server.js

# 3. Check dependencies
cd /var/www/faltuverse/backend
npm list | grep adminjs

# 4. Check PM2
pm2 list
pm2 logs faltuverse-backend --lines 50

# 5. Test locally
curl -v http://localhost:5000/admin

# 6. Check nginx
sudo nginx -t
sudo cat /etc/nginx/sites-available/faltuverse.cloud | grep -A 10 "location /admin"
```

## If Still Not Working

1. **Check if branch is correct:**
```bash
cd /var/www/faltuverse
git branch
git status
```

2. **Pull latest code:**
```bash
cd /var/www/faltuverse
git pull origin admin_branch
cd backend
npm install
pm2 restart faltuverse-backend
```

3. **Check for errors in adminPanel.js:**
```bash
cd /var/www/faltuverse/backend
node -c src/admin/adminPanel.js
```

4. **Check server startup:**
```bash
pm2 logs faltuverse-backend --lines 100 | grep -i -E "(error|Error|admin|Admin)"
```

