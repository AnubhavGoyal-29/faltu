const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const { initializeChatSocket } = require('./events/socketEvents');
const { createSystemUsers } = require('./services/systemUsersService');

// Import cron jobs
const { initializeLuckyDrawCrons } = require('./cron/luckyDrawCron');
const { scheduleChatBotChecks } = require('./cron/chatBotCron');
const { initializeTambolaGame } = require('./cron/tambolaCron');
const { scheduleRushReset } = require('./cron/rushResetCron');

// Import routes
const authRoutes = require('./api/routes/authRoutes');
const userRoutes = require('./api/routes/userRoutes');
const jokeRoutes = require('./api/routes/jokeRoutes');
const luckyDrawRoutes = require('./api/routes/luckyDrawRoutes');
const chaosRoutes = require('./api/routes/chaosRoutes');
const wordleRoutes = require('./api/routes/wordleRoutes');
const tambolaRoutes = require('./api/routes/tambolaRoutes');
const gamesRoutes = require('./api/routes/gamesRoutes');
const rushRoutes = require('./api/routes/rushRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize chat socket
initializeChatSocket(io);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jokes', jokeRoutes);
app.use('/api/lucky-draws', luckyDrawRoutes);
app.use('/api/chaos', chaosRoutes);
app.use('/api/wordle', wordleRoutes);
app.use('/api/tambola', tambolaRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/rush', rushRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FaltuVerse API is running' });
});

// Make io available to routes (for chaos events broadcasting)
app.set('io', io);

// Initialize cron jobs
initializeLuckyDrawCrons(io);
scheduleChatBotChecks(io);
scheduleRushReset();

// Initialize system users on server start
sequelize.authenticate()
  .then(async () => {
    console.log('✅ Database connect ho gaya bhai!');
    await sequelize.sync({ alter: false });
    
    // Create system users
    await createSystemUsers();
    
    // Initialize tambola game
    await initializeTambolaGame(io);
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 FaltuVerse server chal raha hai port ${PORT} par`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🤖 AI Status: ${process.env.OPENAI_API_KEY ? '✅ Enabled' : '❌ Disabled'}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connect nahi hua bhai:', error.message);
    process.exit(1);
  });

// Database connection and server start
const PORT = process.env.PORT || 5000;

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    sequelize.close();
  });
});

