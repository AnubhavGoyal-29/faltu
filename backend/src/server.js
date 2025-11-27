const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// PORT must be defined early
const PORT = process.env.PORT || 5000;

const sequelize = require('./config/db');
const { initializeRedis } = require('./utils/redisClient');
const { createLogger } = require('./utils/logger');
const logger = createLogger('SERVER');
const { initializeChatSocket } = require('./events/socketEvents');
const { createSystemUsers } = require('./services/systemUsersService');
const { initializeAdminPanel } = require('./admin/adminPanel');

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

// CORS middleware (needed early)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware (needed for AdminJS login form)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Admin Panel (after body-parser for login form to work)
// AdminJS login form needs body-parser to parse form data
initializeAdminPanel(app, sequelize);

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

// Health check for logs
app.get('/api/health/logs', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const logsDir = path.join(__dirname, '../logs');
  
  try {
    const logFiles = [
      'server',
      'errors',
      'games',
      'chaos',
      'ai',
      'cron'
    ];
    
    const logInfo = {};
    logFiles.forEach(file => {
      const files = fs.readdirSync(logsDir).filter(f => f.startsWith(file));
      if (files.length > 0) {
        // Get most recent file
        const latestFile = files.sort().reverse()[0];
        const filePath = path.join(logsDir, latestFile);
        const stats = fs.statSync(filePath);
        logInfo[file] = {
          latestFile: latestFile,
          lastModified: stats.mtime.toISOString(),
          size: stats.size
        };
      }
    });
    
    res.json({
      status: 'ok',
      logsDir: logsDir,
      logFiles: logInfo
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Make io available to routes (for chaos events broadcasting)
app.set('io', io);

// Initialize Redis (non-blocking)
logger.info('Initializing Redis...');
initializeRedis();

// Initialize cron jobs (non-blocking)
logger.info('Initializing cron jobs...');
try {
  initializeLuckyDrawCrons(io);
  scheduleChatBotChecks(io);
  scheduleRushReset();
  logger.info('Cron jobs initialized');
} catch (cronError) {
  logger.warn('Cron jobs initialization warning:', cronError.message);
}

// Start server immediately
logger.info('Starting server...');
server.listen(PORT, () => {
  logger.success(`FaltuVerse server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`AI Status: ${process.env.OPENAI_API_KEY ? 'Enabled' : 'Disabled'}`);
  logger.info(`Redis: ${process.env.REDIS_ENABLED !== 'false' ? 'Enabled' : 'Disabled'}`);
  
  // Initialize database in background (non-blocking)
  (async () => {
    try {
      logger.info('Connecting to database...');
      await sequelize.authenticate();
      logger.success('Database connected');
      
      try {
        await sequelize.sync({ alter: false });
        logger.success('Database synced');
      } catch (syncError) {
        logger.warn('Database sync warning:', syncError.message);
      }
      
      // Create system users
      try {
        await createSystemUsers();
        logger.success('System users initialized');
      } catch (userError) {
        logger.warn('System users creation warning:', userError.message);
      }
      
      // Initialize tambola game
      try {
        await initializeTambolaGame(io);
        logger.success('Tambola game initialized');
      } catch (tambolaError) {
        logger.warn('Tambola initialization warning:', tambolaError.message);
      }
    } catch (error) {
      logger.error('Database initialization failed:', error.message);
      logger.warn('Server running without database (some features may not work)');
    }
  })();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    await sequelize.close();
    const { close: closeRedis } = require('./utils/redisClient');
    await closeRedis();
    process.exit(0);
  });
});

