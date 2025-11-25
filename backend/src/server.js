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
const {
  createTambolaRoom,
  startTambolaGame,
  callNextNumber,
  completeGame,
  getActiveRoom
} = require('./services/tambolaService');
const {
  createSystemUsers,
  joinSystemUsersToTambola
} = require('./services/systemUsersService');
const cron = require('node-cron');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jokeRoutes = require('./routes/jokeRoutes');
const luckyDrawRoutes = require('./routes/luckyDrawRoutes');
const chaosRoutes = require('./routes/chaosRoutes');
const wordleRoutes = require('./routes/wordleRoutes');
const tambolaRoutes = require('./routes/tambolaRoutes');

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

// Tambola game management
let currentTambolaRoom = null;
let tambolaNumberInterval = null;
let tambolaGameActive = false;

// Initialize system users on server start
sequelize.authenticate()
  .then(async () => {
    console.log('✅ Database connect ho gaya bhai!');
    await sequelize.sync({ alter: false });
    
    // Create system users
    await createSystemUsers();
    
    // Start first tambola game after 5 minutes
    setTimeout(async () => {
      await startNewTambolaGame();
    }, 5 * 60 * 1000); // 5 minutes
    
    console.log('🎲 [TAMBOLA] First game 5 minutes mein start hogi!');
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

// Start new tambola game
const startNewTambolaGame = async () => {
  try {
    if (tambolaGameActive) {
      console.log('🎲 [TAMBOLA] Game already active hai!');
      return;
    }
    
    console.log('🎲 [TAMBOLA] Naya game start kar rahe hain...');
    
    // Create new room
    const room = await createTambolaRoom();
    currentTambolaRoom = room;
    
    // Join system users
    await joinSystemUsersToTambola(room.room_id);
    
    // Broadcast room created
    io.emit('tambola_room_created', {
      room_id: room.room_id,
      status: 'waiting',
      message: 'Naya tambola room open hai! Register karo!'
    });
    
    // Wait 30 seconds for registrations, then start
    setTimeout(async () => {
      const result = await startTambolaGame(room.room_id);
      
      if (result.success) {
        tambolaGameActive = true;
        
        // Broadcast game started
        io.emit('tambola_game_started', {
          room_id: room.room_id,
          message: 'Tambola game start ho gayi!'
        });
        
        // Start calling numbers every 20 seconds
        tambolaNumberInterval = setInterval(async () => {
          const numberResult = await callNextNumber(room.room_id);
          
          if (numberResult.success) {
            // Broadcast new number
            io.emit('tambola_number_called', {
              room_id: room.room_id,
              number: numberResult.number,
              called_numbers: numberResult.calledNumbers
            });
            
            // Check for winners
            if (numberResult.winners && numberResult.winners.length > 0) {
              for (const winner of numberResult.winners) {
                io.emit('tambola_winner', {
                  room_id: room.room_id,
                  winner: winner,
                  message: `${winner.name} ne ${winner.win_type} complete kar liya! 🎉`
                });
                
                // If full house, end game
                if (winner.win_type === 'Full House') {
                  await completeTambolaGame(room.room_id, winner.user_id);
                }
              }
            }
          } else {
            // All numbers called or game ended
            if (numberResult.message.includes('Sab numbers')) {
              await completeTambolaGame(room.room_id, null);
            }
          }
        }, 20000); // 20 seconds
      }
    }, 30000); // 30 seconds wait
    
  } catch (error) {
    console.error('🎲 [TAMBOLA] Start game error:', error);
  }
};

// Complete tambola game
const completeTambolaGame = async (roomId, winnerId) => {
  try {
    if (tambolaNumberInterval) {
      clearInterval(tambolaNumberInterval);
      tambolaNumberInterval = null;
    }
    
    tambolaGameActive = false;
    await completeGame(roomId, winnerId);
    
    // Broadcast game completed
    io.emit('tambola_game_completed', {
      room_id: roomId,
      winner_user_id: winnerId,
      message: 'Game complete ho gayi!'
    });
    
    currentTambolaRoom = null;
    
    // Start next game after 5 minutes
    setTimeout(() => {
      startNewTambolaGame();
    }, 5 * 60 * 1000);
    
    console.log('🎲 [TAMBOLA] Game complete! Next game 5 minutes mein start hogi.');
  } catch (error) {
    console.error('🎲 [TAMBOLA] Complete game error:', error);
  }
};

// Schedule tambola games every 5 minutes (backup scheduler)
cron.schedule('*/5 * * * *', async () => {
  if (!tambolaGameActive && !currentTambolaRoom) {
    await startNewTambolaGame();
  }
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

