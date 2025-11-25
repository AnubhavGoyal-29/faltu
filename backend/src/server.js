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
const wordleRoutes = require('./routes/wordleRoutes');

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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FaltuVerse API is running' });
});

// Make io available to routes (for chaos events broadcasting)
app.set('io', io);

// Schedule hourly lucky draw (original)
cron.schedule('0 * * * *', async () => {
  console.log('🎰 [LUCKY DRAW] Hourly draw chala rahe hain...');
  try {
    const result = await runLuckyDraw();
    if (result) {
      console.log(`🎰 [LUCKY DRAW] ✅ Winner: ${result.winner.name} - ${result.reward_points} points mil gaye!`);
      io.emit('lucky_draw_winner', {
        winner: result.winner,
        reward_points: result.reward_points,
        timestamp: result.draw.timestamp,
        type: 'hourly'
      });
    } else {
      console.log(`🎰 [LUCKY DRAW] ⚠️ Koi winner nahi mila`);
    }
  } catch (error) {
    console.error('🎰 [LUCKY DRAW] ❌ Error aaya bhai:', error.message);
  }
});

// Backend-driven lucky draw timer (every 5 minutes, persistent)
let luckyDrawTimer = 300; // 5 minutes in seconds
let luckyDrawStartTime = Date.now();

// Update timer every second and broadcast
setInterval(() => {
  const elapsed = Math.floor((Date.now() - luckyDrawStartTime) / 1000);
  luckyDrawTimer = Math.max(0, 300 - elapsed);
  
  // Broadcast timer to all clients
  io.emit('lucky_draw_timer', {
    timeLeft: luckyDrawTimer,
    nextDrawTime: luckyDrawStartTime + 300000
  });
  
  // Reset timer when it reaches 0
  if (luckyDrawTimer <= 0) {
    luckyDrawStartTime = Date.now();
    luckyDrawTimer = 300;
  }
}, 1000);

// Schedule 5-minute lucky draw
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log(`🎰 [LUCKY DRAW] 5-minute draw chala rahe hain...`);
    const result = await runMinuteLuckyDraw();
    
    if (result.shouldRun && result.winner) {
      console.log(`🎰 [LUCKY DRAW] ✅ Winner: ${result.winner.name} - ${result.reward_points} points!`);
      // Broadcast to all connected clients
      io.emit('lucky_draw_result', {
        winner: result.winner,
        reward_points: result.reward_points,
        message: result.message,
        timestamp: result.timestamp,
        type: 'winner'
      });
    } else if (result.message) {
      console.log(`🎰 [LUCKY DRAW] 💬 Message: ${result.message}`);
      // Broadcast message
      io.emit('lucky_draw_result', {
        message: result.message,
        type: result.type || 'message'
      });
    }
    
    // Reset timer
    luckyDrawStartTime = Date.now();
    luckyDrawTimer = 300;
  } catch (error) {
    console.error('🎰 [LUCKY DRAW] ❌ Error:', error.message);
  }
});

// Schedule periodic AI chat room checks (every 2 minutes)
cron.schedule('*/2 * * * *', async () => {
  try {
    console.log(`🤖 [CHAT BOT] Periodic check chala rahe hain...`);
    const { ChatRoom } = require('./models');
    const { processChatRoomForAI } = require('./services/aiChatBot');
    
    const activeRooms = await ChatRoom.findAll({
      limit: 10,
      order: [['created_at', 'DESC']]
    });

    console.log(`🤖 [CHAT BOT] ${activeRooms.length} active rooms mil gaye`);
    for (const room of activeRooms) {
      await processChatRoomForAI(room.room_id, room.name, io);
    }
  } catch (error) {
    console.error(`🤖 [CHAT BOT] ❌ Periodic check error:`, error.message);
  }
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connect ho gaya bhai!');
    return sequelize.sync({ alter: false }); // Use migrations instead of sync in production
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

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    sequelize.close();
  });
});

