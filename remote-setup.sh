#!/bin/bash
# Remote setup script - runs installation on server via SSH
# This script will SSH into the server and run the installation

SERVER="root@72.61.170.102"
PASSWORD="ai-247@Solutions"
PROJECT_DIR="/var/www/faltuverse"

echo "🚀 Connecting to server and setting up Faltuverse..."

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo "Installing sshpass..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install hudochenkov/sshpass/sshpass 2>/dev/null || echo "Please install sshpass: brew install hudochenkov/sshpass/sshpass"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get install -y sshpass 2>/dev/null || sudo yum install -y sshpass 2>/dev/null || echo "Please install sshpass manually"
    fi
fi

# Run installation on remote server
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER << 'ENDSSH'
cd /var/www
git clone https://github.com/AnubhavGoyal-29/faltu.git faltuverse 2>/dev/null || (cd faltuverse && git pull origin main)
cd faltuverse
git checkout main
chmod +x install.sh
bash install.sh
ENDSSH

echo ""
echo "✅ Setup complete! Check https://faltuverse.cloud"

