# 🎉 FaltuVerse - Pure Entertainment for No Reason

FaltuVerse is a "pure entertainment for no reason" web application where users can enjoy random, pointless fun activities including random chat rooms, lucky draws, chaos events, and AI-generated jokes.

## 🚀 Features

- **Google OAuth Login** - Secure authentication with Google
- **Random Chat Rooms** - Join random chat rooms with funny names and chat in real-time
- **Lucky Draws** - Hourly random lucky draws for active users
- **Chaos Events** - Trigger random chaos events (confetti, upside-down screen, breaking news, etc.)
- **AI Jokes** - Get random AI-generated nonsense jokes
- **Points System** - Earn points for various activities (chatting, logging in, triggering chaos, winning draws)
- **Login Streaks** - Track your daily login streak

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MySQL with Sequelize ORM
- Socket.IO for real-time chat
- JWT for authentication
- Google OAuth 2.0

### Frontend
- React 18
- Vite
- Socket.IO Client
- React Router
- Google OAuth React Library
- Canvas Confetti

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v20 or higher) - **Required: v20.x.x**
- MySQL (v8.0 or higher)
- npm or yarn

**Note:** This project requires Node.js 20. The project includes `.nvmrc` and `.node-version` files to automatically use the correct version.

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd faltu
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE faltuverse;
```

### 3. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=faltuverse
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

FRONTEND_URL=http://localhost:5173
```

5. Run database migrations:
```bash
npm run migrate
```

6. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### 4. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set authorized JavaScript origins:
   - `http://localhost:5173` (for development)
6. Set authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (for backend)
7. Copy the Client ID and Client Secret to your `.env` files

## 📁 Project Structure

```
faltu/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth middleware
│   │   ├── migrations/      # Database migrations
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── sockets/         # Socket.IO handlers
│   │   └── server.js        # Entry point
│   ├── config/              # Sequelize config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # React components
│   │   ├── context/         # React contexts
│   │   ├── pages/           # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## 🎮 Usage

1. **Login**: Click "Login with Google" on the login page
2. **Dashboard**: View your points, login streak, and access various features
3. **Chat**: Click "Go to Chat" to join a random chat room
4. **Chaos Events**: Click "Trigger Chaos" to cause random chaos events
5. **Jokes**: Click "Get Joke" to receive a random AI-generated joke
6. **Lucky Draws**: Check the dashboard for the last lucky draw winner (draws happen hourly)

## 🎨 Chaos Events

When triggered, chaos events can cause:
- **Breaking News**: Popup with random news message
- **Confetti**: Colorful confetti explosion
- **Upside Down**: Screen flips upside down
- **Shake**: Screen shakes
- **Color Invert**: Colors invert
- **Rainbow**: Rainbow color effect
- **Sound**: Random sound plays

## 📊 Database Schema

- **users**: User information
- **chat_rooms**: Chat room data
- **chat_messages**: Chat messages
- **lucky_draws**: Lucky draw records
- **user_points**: User points and streaks
- **chaos_events**: Chaos event logs

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Configure CORS properly for production
- Use HTTPS in production
- Keep dependencies updated

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Verify database credentials in `.env`
- Check if the database exists

### Google OAuth Issues
- Verify Google Client ID and Secret are correct
- Check authorized origins and redirect URIs
- Ensure Google+ API is enabled

### Socket.IO Connection Issues
- Verify backend is running
- Check CORS configuration
- Ensure token is being sent correctly

## 📝 API Endpoints

### Authentication
- `POST /api/auth/google` - Google login

### Users
- `GET /api/users/profile` - Get user profile (protected)

### Jokes
- `GET /api/jokes/random` - Get random joke (protected)

### Lucky Draws
- `GET /api/lucky-draws/last` - Get last lucky draw (protected)

### Chaos Events
- `POST /api/chaos/trigger` - Trigger chaos event (protected)
- `GET /api/chaos/recent` - Get recent chaos events (protected)

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Update database credentials
3. Configure proper CORS origins
4. Use environment variables for all secrets
5. Build frontend: `npm run build`
6. Serve frontend build with a web server (nginx, etc.)
7. Use PM2 or similar for backend process management

## 📄 License

This project is for entertainment purposes only.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Enjoy the chaos! 🎉**

