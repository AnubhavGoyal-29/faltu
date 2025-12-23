# Faltuverse Setup Guide

## Server Setup (Production)

### 1. SSH into server
```bash
ssh root@72.61.170.102
# Password: ai-247@Solutions
```

### 2. Install dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install MySQL
apt install -y mysql-server
mysql_secure_installation

# Install Redis
apt install -y redis-server

# Install PM2
npm install -g pm2

# Install Nginx (optional, for reverse proxy)
apt install -y nginx
```

### 3. Setup MySQL Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE faltuverse;
CREATE USER 'faltuverse'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON faltuverse.* TO 'faltuverse'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Clone and Setup Project
```bash
cd /var/www
git clone <your-repo-url> faltuverse
cd faltuverse
git checkout faltuverse

# Create .env file
cp .env.example .env
nano .env  # Edit with your credentials
```

### 5. Configure .env
```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=faltuverse
DB_PASSWORD=your_secure_password
DB_NAME=faltuverse
REDIS_HOST=localhost
REDIS_PORT=6379
FRONTEND_URL=https://faltuverse.cloud
```

### 6. Install and Build
```bash
# Backend
cd server
npm install --production

# Frontend
cd ../client
npm install
npm run build
```

### 7. Start with PM2
```bash
cd /var/www/faltuverse
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions to enable auto-start
```

### 8. Setup Nginx (Reverse Proxy)
```bash
nano /etc/nginx/sites-available/faltuverse
```

```nginx
server {
    listen 80;
    server_name faltuverse.cloud www.faltuverse.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/faltuverse /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 9. SSL Certificate (Let's Encrypt)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d faltuverse.cloud -d www.faltuverse.cloud
```

## Deployment

After initial setup, deploy updates:
```bash
cd /var/www/faltuverse
./deploy.sh
```

## Monitoring

```bash
# Check PM2 status
pm2 status
pm2 logs faltuverse

# Check MySQL
mysql -u faltuverse -p faltuverse

# Check Redis
redis-cli ping
```

