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

# Source environment variables (suppress the echo from env.sh)
echo "📦 Loading environment variables..."
source ./env.sh > /dev/null 2>&1

# Check if DB_PASSWORD is set (allow empty string for no password)
if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" = "YOUR_MYSQL_PASSWORD_HERE" ]; then
    echo "⚠️  DB_PASSWORD not set (using empty password - MySQL without password)"
    export DB_PASSWORD=""
fi

# Check if JWT_SECRET is set
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "YOUR_SUPER_SECRET_JWT_KEY_CHANGE_THIS_IN_PRODUCTION" ]; then
    echo "❌ JWT_SECRET not set in env.sh"
    exit 1
fi

# Check if GOOGLE_CLIENT_ID is set
if [ -z "$GOOGLE_CLIENT_ID" ] || [ "$GOOGLE_CLIENT_ID" = "YOUR_GOOGLE_CLIENT_ID_HERE" ]; then
    echo "⚠️  GOOGLE_CLIENT_ID not set (Google login won't work)"
fi

# Generate .env files
echo ""
echo "📝 Generating .env files..."
cat > backend/.env << EOF
PORT=$PORT
NODE_ENV=$NODE_ENV
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=$JWT_EXPIRES_IN
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI=$GOOGLE_REDIRECT_URI
FRONTEND_URL=$FRONTEND_URL
OPENAI_API_KEY=$OPENAI_API_KEY
OPENAI_MODEL=$OPENAI_MODEL
EOF

cat > frontend/.env << EOF
VITE_API_URL=$VITE_API_URL
VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
EOF

echo "✅ .env files generated!"

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

# Check database migrations (optional, don't fail if MySQL not running)
echo ""
echo "🗄️  Checking database migrations..."
cd backend
if [ ! -f ".migrated" ]; then
    echo "Running database migrations..."
    npm run migrate 2>/dev/null || echo "⚠️  Migration failed (MySQL might not be running - that's okay)"
    touch .migrated
fi
cd ..

echo ""
echo "✅ Setup complete!"
echo ""

# Kill any existing processes on ports 5000 and 3000
echo "🛑 Stopping any existing servers..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

echo ""
echo "🚀 Starting servers..."
echo ""
echo "Backend will start on: http://localhost:5000"
echo "Frontend will start on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Export environment variables for child processes
export PORT DB_HOST DB_PORT DB_NAME DB_USER DB_PASSWORD
export JWT_SECRET JWT_EXPIRES_IN
export GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET GOOGLE_REDIRECT_URI
export FRONTEND_URL OPENAI_API_KEY OPENAI_MODEL
export VITE_API_URL VITE_GOOGLE_CLIENT_ID

# Check if fnm is available
if command -v fnm &> /dev/null; then
    eval "$(fnm env)"
    fnm use 20 > /dev/null 2>&1 || echo "⚠️  Node 20 not found, using default node"
fi

# Start backend in background
cd backend
# Export all env vars explicitly
export PORT DB_HOST DB_PORT DB_NAME DB_USER DB_PASSWORD
export JWT_SECRET JWT_EXPIRES_IN
export GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET GOOGLE_REDIRECT_URI
export FRONTEND_URL OPENAI_API_KEY OPENAI_MODEL

# Use fnm if available - ensure Node 20 is used
if command -v fnm &> /dev/null; then
    eval "$(fnm env)"
    fnm use 20
    export PATH="$HOME/.local/share/fnm_multishells/current/bin:$PATH"
fi

# Verify Node version
NODE_VERSION=$(node --version 2>&1)
echo "Using Node: $NODE_VERSION"

npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 5

# Check if backend started
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start. Check backend.log for errors:"
    echo ""
    tail -20 backend.log
    exit 1
fi

# Check if backend is listening on port
if ! lsof -ti:5000 > /dev/null 2>&1; then
    echo "⚠️  Backend process started but not listening on port 5000 yet..."
    sleep 3
    if ! lsof -ti:5000 > /dev/null 2>&1; then
        echo "❌ Backend still not listening. Check backend.log:"
        tail -20 backend.log
        exit 1
    fi
fi

# Start frontend
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait a bit for frontend to start
sleep 3

echo ""
echo "✅ Servers started!"
echo "📋 Backend PID: $BACKEND_PID"
echo "📋 Frontend PID: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# Wait for processes
wait

