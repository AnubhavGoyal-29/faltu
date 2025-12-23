#!/bin/bash

# Git-based deployment script for Faltuverse
# Usage: ./deploy-git.sh

set -e

SERVER="root@72.61.170.102"
SERVER_PASS="ai-247@Solutions"
SERVER_PATH="/var/www/faltuverse"

echo "🚀 Starting Git-based deployment..."
echo ""

# Step 1: Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main
echo "✅ Pushed to GitHub"
echo ""

# Step 2: Pull on server
echo "📥 Pulling latest code on server..."
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER "cd $SERVER_PATH && git pull origin main"
echo "✅ Code pulled on server"
echo ""

# Step 3: Install dependencies and build
echo "📦 Installing dependencies..."
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER "cd $SERVER_PATH/server && npm install --production 2>&1 | tail -5"
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER "cd $SERVER_PATH/client && npm install 2>&1 | tail -5"
echo "✅ Dependencies installed"
echo ""

# Step 4: Build frontend
echo "🏗️  Building frontend..."
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER "cd $SERVER_PATH/client && npm run build 2>&1 | tail -10"
echo "✅ Frontend built"
echo ""

# Step 5: Restart PM2
echo "🔄 Restarting server..."
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER "pm2 restart faltuverse && sleep 2 && pm2 status"
echo ""
echo "✅ Deployment complete!"

