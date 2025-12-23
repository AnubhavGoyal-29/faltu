#!/bin/bash
# Script to run on server: Pull latest code and restart
# Usage: ssh to server and run: bash /var/www/faltuverse/pull-restart.sh

cd /var/www/faltuverse

echo "📥 Pulling latest code from main branch..."
git pull origin main

echo "📦 Installing dependencies..."
cd server && npm install --production
cd ../client && npm install
cd ..

echo "🏗️  Building frontend..."
cd client && npm run build
cd ..

echo "🔄 Restarting PM2..."
pm2 restart faltuverse
sleep 2
pm2 status

echo "✅ Done!"

