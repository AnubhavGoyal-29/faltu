#!/bin/bash
# Deployment script for Faltuverse

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

echo "============================================"
echo "🚀 Deploying Faltuverse"
echo "============================================"

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull origin faltuverse || echo "⚠️  Git pull failed, continuing..."

# 2. Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install --production

# 3. Install frontend dependencies and build
echo "🏗️  Building frontend..."
cd ../client
npm install
npm run build

# 4. Restart PM2 process
echo "🔄 Restarting server..."
cd "$PROJECT_ROOT"
pm2 restart faltuverse || pm2 start server/index.js --name faltuverse

echo ""
echo "============================================"
echo "✅ Deployment complete!"
echo "============================================"
pm2 status

