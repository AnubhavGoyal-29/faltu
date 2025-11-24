# Quick Setup Guide

## Prerequisites
- Node.js v16+ installed
- MySQL v8.0+ installed and running
- Google Cloud Console account (for OAuth)

## Step-by-Step Setup

### 1. Database Setup
```bash
mysql -u root -p
CREATE DATABASE faltuverse;
exit;
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials and Google OAuth credentials
npm run migrate
npm start
```

### 3. Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Google Client ID
npm run dev
```

### 4. Google OAuth Configuration

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: Web application
6. Authorized JavaScript origins: `http://localhost:5173`
7. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
8. Copy Client ID and Client Secret to your `.env` files

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running: `mysql.server start` (Mac) or `sudo systemctl start mysql` (Linux)
- Verify credentials in `backend/.env`
- Check if database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### Google OAuth Not Working
- Verify Client ID matches in both `.env` files
- Check authorized origins in Google Console
- Ensure Google+ API is enabled

### Socket.IO Connection Issues
- Verify backend is running
- Check CORS settings in `backend/src/server.js`
- Ensure token is stored in localStorage

## Development Commands

### Backend
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (auto-reload)
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=faltuverse
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_client_id
```

## Next Steps

1. Login with Google
2. Explore the dashboard
3. Join a random chat room
4. Trigger chaos events
5. Get random jokes
6. Check for lucky draw winners (hourly)

Enjoy FaltuVerse! 🎉

