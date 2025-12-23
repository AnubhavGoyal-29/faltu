#!/bin/bash

# Faltuverse Server Pull & Restart Script
# This script pulls latest code from main branch and restarts everything
# Usage: bash /var/www/faltuverse/pull-restart.sh

set -e

cd /var/www/faltuverse

echo "🚀 Starting deployment..."
echo ""

# Step 1: Pull latest code
echo "📥 Pulling latest code from main branch..."
git pull origin main
echo "✅ Code pulled"
echo ""

# Step 2: Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install --production
cd ..
echo "✅ Backend dependencies installed"
echo ""

# Step 3: Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..
echo "✅ Frontend dependencies installed"
echo ""

# Step 4: Build frontend
echo "🏗️  Building frontend..."
cd client
npm run build
cd ..
echo "✅ Frontend built"
echo ""

# Step 5: Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart faltuverse || pm2 start server/index.js --name faltuverse --update-env
sleep 3
pm2 status
echo ""

# Step 6: Show recent logs
echo "📋 Recent server logs:"
pm2 logs faltuverse --lines 5 --nostream
echo ""

echo "✅ Deployment complete!"
echo "🌐 Server should be running at https://faltuverse.cloud"
