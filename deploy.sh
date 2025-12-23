#!/bin/bash
# High-Efficiency Unified Deployment for gemini_developer branch
set -e

PROJECT_ROOT=$(pwd)
BRANCH="gemini_developer"

echo "============================================"
echo "🚀 Starting DEEP Deployment on branch: $BRANCH"
echo "============================================"

# Port Cleanup
echo "🧹 Ensuring port 3000 is clear..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Git Operations
echo "📦 Syncing with GitHub..."
git fetch origin
git checkout -f $BRANCH
git reset --hard origin/$BRANCH

# Environment Setup
echo "🔑 Restoring environment variables..."
chmod +x ./env.sh
source ./env.sh
generate_env_files

# Database Prep
echo "🗄️  Ensuring database exists..."
# Using blank password as requested
mysql -u root -e "CREATE DATABASE IF NOT EXISTS faltuverse;"

# Backend Refresh
echo "⚙️  Updating Backend (server/)..."
cd server
npm install
cd ..

# Frontend Refresh - NUCLEAR CLEANUP
echo "🎨 Building Frontend (client/)..."
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
cd ..

# Restart Production Services
echo "🔄 Fresh restart via PM2..."
pm2 delete all || true
pm2 start server/index.js --name faltuverse-backend --update-env
pm2 save

echo "============================================"
echo "✅ Deployment Successful! Your site is live."
echo "============================================"
