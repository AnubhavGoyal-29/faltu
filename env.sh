#!/bin/bash

# ============================================
# FaltuVerse Environment Variables
# ============================================
# Source this file before starting servers:
# source env.sh
# ============================================

# ============================================
# BACKEND CONFIGURATION
# ============================================

# Server Configuration
export PORT=3000
export NODE_ENV=development

# Database Configuration (MySQL)
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=faltuverse
export DB_USER=root
export DB_PASSWORD='ai-247@Solutions'

# JWT Configuration
export JWT_SECRET=faltuverse_super_secret_jwt_key_2024_abcdefghijklmnopqrstuvwxyz
export JWT_EXPIRES_IN=7d

# Google OAuth Configuration
export GOOGLE_CLIENT_ID=182449420217-nus093tc0cuod8mm56i6qtj89ceuvf6f.apps.googleusercontent.com
export GOOGLE_CLIENT_SECRET=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
export GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Frontend URL (for CORS)
export FRONTEND_URL=https://faltuverse.cloud

# OpenAI Configuration (Optional - AI features work without it)
export OPENAI_API_KEY="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"
export OPENAI_MODEL=gpt-3.5-turbo

# ============================================
# FRONTEND CONFIGURATION
# ============================================

export VITE_API_URL=https://faltuverse.cloud
export FRONTEND_URL=https://faltuverse.cloud

# ============================================
# Helper Functions
# ============================================

# Function to generate .env files from environment variables
generate_env_files() {
    echo "Generating .env files..."
    
cat > server/.env << EOF
PORT=$PORT
NODE_ENV=$NODE_ENV
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD='$DB_PASSWORD'
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=$JWT_EXPIRES_IN
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI=$GOOGLE_REDIRECT_URI
FRONTEND_URL=$FRONTEND_URL
OPENAI_API_KEY=$OPENAI_API_KEY
OPENAI_MODEL=$OPENAI_MODEL
EOF

    # Frontend .env
    cat > client/.env << EOF
VITE_API_URL=$VITE_API_URL
VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
EOF

    echo "✅ .env files generated successfully!"
}

# Function to check if all required variables are set
check_env() {
    local missing=0
    
    echo "Checking environment variables..."
    
    # Backend required (empty password is allowed for MySQL without password)
    if [ "$DB_PASSWORD" = "YOUR_MYSQL_PASSWORD_HERE" ]; then
        echo "⚠️  DB_PASSWORD not set (using empty password - MySQL without password)"
    fi
    
    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "YOUR_SUPER_SECRET_JWT_KEY_CHANGE_THIS_IN_PRODUCTION" ]; then
        echo "❌ JWT_SECRET not set"
        missing=$((missing + 1))
    fi
    
    if [ -z "$GOOGLE_CLIENT_ID" ] || [ "$GOOGLE_CLIENT_ID" = "YOUR_GOOGLE_CLIENT_ID_HERE" ]; then
        echo "❌ GOOGLE_CLIENT_ID not set"
        missing=$((missing + 1))
    fi
    
    if [ -z "$GOOGLE_CLIENT_SECRET" ] || [ "$GOOGLE_CLIENT_SECRET" = "YOUR_GOOGLE_CLIENT_SECRET_HERE" ]; then
        echo "❌ GOOGLE_CLIENT_SECRET not set"
        missing=$((missing + 1))
    fi
    
    # Frontend required
    if [ -z "$VITE_GOOGLE_CLIENT_ID" ] || [ "$VITE_GOOGLE_CLIENT_ID" = "YOUR_GOOGLE_CLIENT_ID_HERE" ]; then
        echo "❌ VITE_GOOGLE_CLIENT_ID not set"
        missing=$((missing + 1))
    fi
    
    # Optional (AI)
    if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "YOUR_OPENAI_API_KEY_HERE" ]; then
        echo "⚠️  OPENAI_API_KEY not set (AI features will be disabled)"
    fi
    
    if [ $missing -eq 0 ]; then
        echo "✅ All required environment variables are set!"
        return 0
    else
        echo "❌ $missing required environment variable(s) missing"
        return 1
    fi
}

# Function to start backend server
start_backend() {
    echo "Starting backend server..."
    cd backend
    source ../env.sh
    npm start
}

# Function to start frontend server
start_frontend() {
    echo "Starting frontend server..."
    cd frontend
    source ../env.sh
    npm run dev
}

# Display usage
echo "============================================"
echo "FaltuVerse Environment Setup"
echo "============================================"
echo ""
echo "Usage:"
echo "  1. Edit this file (env.sh) and set all YOUR_*_HERE values"
echo "  2. Source this file: source env.sh"
echo "  3. Generate .env files: generate_env_files"
echo "  4. Check setup: check_env"
echo ""
echo "To start servers:"
echo "  Backend:  cd backend && npm start"
echo "  Frontend: cd frontend && npm run dev"

