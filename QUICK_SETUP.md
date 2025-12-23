# Quick Server Setup Guide

## Step 1: SSH into Server
```bash
ssh root@72.61.170.102
# Password: ai-247@Solutions
```

## Step 2: Run Setup Script
```bash
cd /var/www
git clone https://github.com/AnubhavGoyal-29/faltu.git faltuverse
cd faltuverse
git checkout main
chmod +x server-setup.sh
bash server-setup.sh
```

## Step 3: Configure Database
```bash
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE IF NOT EXISTS faltuverse;
CREATE USER IF NOT EXISTS 'faltuverse'@'localhost' IDENTIFIED BY 'Faltuverse@2024!';
GRANT ALL PRIVILEGES ON faltuverse.* TO 'faltuverse'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 4: Configure Environment
```bash
cd /var/www/faltuverse
nano .env
```

Update these values:
```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=faltuverse
DB_PASSWORD=Faltuverse@2024!
DB_NAME=faltuverse
REDIS_HOST=localhost
REDIS_PORT=6379
FRONTEND_URL=https://faltuverse.cloud
```

## Step 5: Build and Start
```bash
cd /var/www/faltuverse

# Install dependencies
cd server && npm install --production
cd ../client && npm install && npm run build

# Start with PM2
cd ..
pm2 start ecosystem.config.js
pm2 save
```

## Step 6: Setup SSL (Optional but Recommended)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d faltuverse.cloud -d www.faltuverse.cloud
```

## Step 7: Verify
```bash
pm2 status
pm2 logs faltuverse
```

Visit: https://faltuverse.cloud

## Troubleshooting

### Check if services are running:
```bash
systemctl status mysql
systemctl status redis-server
systemctl status nginx
pm2 status
```

### View logs:
```bash
pm2 logs faltuverse
tail -f /var/log/nginx/error.log
```

### Restart services:
```bash
pm2 restart faltuverse
systemctl restart nginx
```

