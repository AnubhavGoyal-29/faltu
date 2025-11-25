const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const { initializeChatSocket } = require('./sockets/chatSocket');
const { runLuckyDraw } = require('./services/luckyDrawService');
const { runMinuteLuckyDraw } = require('./services/minuteLuckyDrawService');
const { generateCronEventSuggestion } = require('./services/aiDecisionEngine');
const cron = require('node-cron');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jokeRoutes = require('./routes/jokeRoutes');
const luckyDrawRoutes = require('./routes/luckyDrawRoutes');
const chaosRoutes = require('./routes/chaosRoutes');

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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FaltuVerse API is running' });
});

// Make io available to routes (for chaos events broadcasting)
app.set('io', io);

// Schedule hourly lucky draw (original)
cron.schedule('0 * * * *', async () => {
  console.log('Running hourly lucky draw...');
  try {
    const result = await runLuckyDraw();
    if (result) {
      console.log(`Hourly lucky draw winner: ${result.winner.name} - ${result.reward_points} points`);
      io.emit('lucky_draw_winner', {
        winner: result.winner,
        reward_points: result.reward_points,
        timestamp: result.draw.timestamp,
        type: 'hourly'
      });
    }
  } catch (error) {
    console.error('Hourly lucky draw error:', error);
  }
});

// Schedule minute lucky draw (every minute)
cron.schedule('* * * * *', async () => {
  try {
    const result = await runMinuteLuckyDraw();
    
    if (result.shouldRun && result.winner) {
      console.log(`Minute lucky draw: ${result.winner.name} - ${result.reward_points} points`);
      // Broadcast to all connected clients
      io.emit('minute_lucky_draw', {
        winner: result.winner,
        reward_points: result.reward_points,
        message: result.message,
        timestamp: result.timestamp,
        type: 'minute'
      });
    } else if (result.message) {
      // Broadcast bakchod message even if no winner
      io.emit('minute_lucky_draw_message', {
        message: result.message,
        type: result.type || 'info'
      });
    }
  } catch (error) {
    console.error('Minute lucky draw error:', error);
  }
});

// Schedule periodic AI chat room checks (every 2 minutes)
cron.schedule('*/2 * * * *', async () => {
  try {
    const { ChatRoom } = require('./models');
    const { processChatRoomForAI } = require('./services/aiChatBot');
    
    const activeRooms = await ChatRoom.findAll({
      limit: 10,
      order: [['created_at', 'DESC']]
    });

    for (const room of activeRooms) {
      await processChatRoomForAI(room.room_id, room.name, io);
    }
  } catch (error) {
    console.error('AI chat room check error:', error);
  }
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync({ alter: false }); // Use migrations instead of sync in production
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`FaltuVerse server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    sequelize.close();
  });
});

