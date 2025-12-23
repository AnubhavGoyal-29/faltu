#!/bin/bash
# One-command installation script for Faltuverse
# Copy and paste this entire script on your server

set -e

PROJECT_DIR="/var/www/faltuverse"
REPO_URL="https://github.com/AnubhavGoyal-29/faltu.git"

echo "🚀 Starting Faltuverse Installation..."

# Update system
apt update -y && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install MySQL, Redis, Nginx, Git
apt install -y mysql-server redis-server nginx git

# Start services
systemctl start mysql redis-server nginx
systemctl enable mysql redis-server nginx

# Install PM2
npm install -g pm2

# Create project directory
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Clone repository
if [ ! -d ".git" ]; then
    git clone $REPO_URL .
    git checkout main
else
    git pull origin main
fi

# Install backend dependencies
cd server
npm install --production

# Install frontend dependencies and build
cd ../client
npm install
npm run build

# Create .env file
cd ..
if [ ! -f ".env" ]; then
    cat > .env << 'ENVFILE'
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
ANALYTICS_ENABLED=true
ENVFILE
    echo "✅ Created .env file"
fi

# Setup MySQL database
mysql -u root << 'MYSQLSETUP'
CREATE DATABASE IF NOT EXISTS faltuverse;
CREATE USER IF NOT EXISTS 'faltuverse'@'localhost' IDENTIFIED BY 'Faltuverse@2024!';
GRANT ALL PRIVILEGES ON faltuverse.* TO 'faltuverse'@'localhost';
FLUSH PRIVILEGES;
MYSQLSETUP

# Setup Nginx
cat > /etc/nginx/sites-available/faltuverse << 'NGINXCONFIG'
server {
    listen 80;
    server_name faltuverse.cloud www.faltuverse.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXCONFIG

ln -sf /etc/nginx/sites-available/faltuverse /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Start with PM2
cd $PROJECT_DIR
pm2 delete faltuverse 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -1 | bash 2>/dev/null || true

echo ""
echo "============================================"
echo "✅ Installation Complete!"
echo "============================================"
echo ""
echo "Your app is running at: http://faltuverse.cloud"
echo ""
echo "To setup SSL (recommended):"
echo "  apt install -y certbot python3-certbot-nginx"
echo "  certbot --nginx -d faltuverse.cloud -d www.faltuverse.cloud"
echo ""
echo "Check status: pm2 status"
echo "View logs: pm2 logs faltuverse"

