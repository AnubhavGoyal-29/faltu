#!/bin/bash

# ============================================
# FaltuVerse Startup Script
# ============================================

echo "🎉 Starting FaltuVerse..."
echo ""

# Check if env.sh exists
if [ ! -f "env.sh" ]; then
    echo "❌ Error: env.sh file not found!"
    echo "Please create env.sh file with all credentials"
    exit 1
fi

# Source environment variables
echo "📦 Loading environment variables..."
source ./env.sh

# Check environment
echo ""
echo "🔍 Checking environment setup..."
if ! check_env; then
    echo ""
    echo "❌ Please fix the missing environment variables in env.sh"
    exit 1
fi

# Generate .env files
echo ""
echo "📝 Generating .env files..."
generate_env_files

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo ""
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo ""
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Check database migrations
echo ""
echo "🗄️  Checking database migrations..."
cd backend
if [ ! -f ".migrated" ]; then
    echo "Running database migrations..."
    npm run migrate
    touch .migrated
fi
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting servers..."
echo ""
echo "Backend will start on: http://localhost:5000"
echo "Frontend will start on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start backend in background
cd backend
source ../env.sh
npm start &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
cd frontend
source ../env.sh
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# Wait for processes
wait

