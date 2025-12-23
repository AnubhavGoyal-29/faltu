#!/bin/bash
# Complete server setup script for Faltuverse
# Run this on the server: bash server-setup.sh

set -e

echo "============================================"
echo "🚀 Faltuverse Server Setup"
echo "============================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Update system
echo -e "${GREEN}📦 Updating system...${NC}"
apt update && apt upgrade -y

# 2. Install Node.js
echo -e "${GREEN}📦 Installing Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
else
    echo "Node.js already installed: $(node --version)"
fi

# 3. Install MySQL
echo -e "${GREEN}📦 Installing MySQL...${NC}"
if ! command -v mysql &> /dev/null; then
    apt install -y mysql-server
    systemctl start mysql
    systemctl enable mysql
else
    echo "MySQL already installed"
fi

# 4. Install Redis
echo -e "${GREEN}📦 Installing Redis...${NC}"
if ! command -v redis-cli &> /dev/null; then
    apt install -y redis-server
    systemctl start redis-server
    systemctl enable redis-server
else
    echo "Redis already installed"
fi

# 5. Install PM2
echo -e "${GREEN}📦 Installing PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
else
    echo "PM2 already installed: $(pm2 --version)"
fi

# 6. Install Nginx
echo -e "${GREEN}📦 Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
else
    echo "Nginx already installed"
fi

# 7. Install Git
echo -e "${GREEN}📦 Installing Git...${NC}"
apt install -y git

# 8. Create project directory
echo -e "${GREEN}📁 Setting up project directory...${NC}"
PROJECT_DIR="/var/www/faltuverse"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# 9. Clone repository (if not exists)
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Please clone your repository manually:${NC}"
    echo "cd $PROJECT_DIR"
    echo "git clone <your-repo-url> ."
    echo "git checkout main"
else
    echo "Repository already exists, pulling latest..."
    git pull origin main
fi

# 10. Setup MySQL Database
echo -e "${GREEN}🗄️  Setting up MySQL database...${NC}"
echo -e "${YELLOW}Please run these MySQL commands manually:${NC}"
echo "mysql -u root -p"
echo "CREATE DATABASE IF NOT EXISTS faltuverse;"
echo "CREATE USER IF NOT EXISTS 'faltuverse'@'localhost' IDENTIFIED BY 'your_secure_password';"
echo "GRANT ALL PRIVILEGES ON faltuverse.* TO 'faltuverse'@'localhost';"
echo "FLUSH PRIVILEGES;"
echo "EXIT;"

# 11. Install dependencies
echo -e "${GREEN}📦 Installing dependencies...${NC}"
cd $PROJECT_DIR/server
npm install --production

cd $PROJECT_DIR/client
npm install
npm run build

# 12. Create .env file
echo -e "${GREEN}⚙️  Setting up environment variables...${NC}"
cd $PROJECT_DIR
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your credentials:${NC}"
    echo "nano .env"
else
    echo ".env file already exists"
fi

# 13. Setup PM2
echo -e "${GREEN}🔄 Setting up PM2...${NC}"
cd $PROJECT_DIR
pm2 delete faltuverse 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -1 | bash || echo "PM2 startup already configured"

# 14. Setup Nginx
echo -e "${GREEN}🌐 Setting up Nginx...${NC}"
NGINX_CONFIG="/etc/nginx/sites-available/faltuverse"
cat > $NGINX_CONFIG << 'EOF'
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
EOF

# Enable site
ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Test and reload Nginx
nginx -t && systemctl reload nginx

# 15. Setup SSL (optional)
echo -e "${GREEN}🔒 SSL Setup (optional)...${NC}"
echo -e "${YELLOW}To setup SSL, run:${NC}"
echo "apt install -y certbot python3-certbot-nginx"
echo "certbot --nginx -d faltuverse.cloud -d www.faltuverse.cloud"

echo ""
echo "============================================"
echo -e "${GREEN}✅ Server setup complete!${NC}"
echo "============================================"
echo ""
echo "Next steps:"
echo "1. Edit .env file: nano $PROJECT_DIR/.env"
echo "2. Setup MySQL database (see instructions above)"
echo "3. Restart PM2: pm2 restart faltuverse"
echo "4. Check status: pm2 status"
echo "5. View logs: pm2 logs faltuverse"
echo ""
echo "Your app should be live at: http://faltuverse.cloud"

