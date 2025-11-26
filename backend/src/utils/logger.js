/**
 * Structured Logger with Winston
 * 
 * Provides file-based rotating logs with structured JSON output.
 * Logs are separated by category: server, errors, games, chaos, ai, cron
 * 
 * @version 2.0
 */

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log format with JSON structure
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `[${timestamp}] [${level}] [${context || 'APP'}] ${message} ${metaStr}`;
  })
);

// Create transports
const transports = [
  // Console transport (always enabled)
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    level: process.env.LOG_LEVEL || 'info'
  }),

  // General server logs
  new DailyRotateFile({
    filename: path.join(logsDir, 'server-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: process.env.LOG_RETENTION_DAYS || '30d',
    format: logFormat,
    level: 'info'
  }),

  // Error logs (errors and above)
  new DailyRotateFile({
    filename: path.join(logsDir, 'errors-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: process.env.LOG_RETENTION_DAYS || '30d',
    format: logFormat,
    level: 'error'
  }),

  // Game logs
  new DailyRotateFile({
    filename: path.join(logsDir, 'games-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: process.env.LOG_RETENTION_DAYS || '30d',
    format: logFormat,
    level: 'info'
  }),

  // Chaos event logs
  new DailyRotateFile({
    filename: path.join(logsDir, 'chaos-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: process.env.LOG_RETENTION_DAYS || '30d',
    format: logFormat,
    level: 'info'
  }),

  // AI logs
  new DailyRotateFile({
    filename: path.join(logsDir, 'ai-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: process.env.LOG_RETENTION_DAYS || '30d',
    format: logFormat,
    level: 'info'
  }),

  // Cron logs
  new DailyRotateFile({
    filename: path.join(logsDir, 'cron-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: process.env.LOG_RETENTION_DAYS || '30d',
    format: logFormat,
    level: 'info'
  })
];

// Create main logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'faltuverse' },
  transports,
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: process.env.LOG_RETENTION_DAYS || '30d'
    })
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: process.env.LOG_RETENTION_DAYS || '30d'
    })
  ]
});

// Create category-specific loggers
const categoryLoggers = {
  games: logger.child({ category: 'games' }),
  chaos: logger.child({ category: 'chaos' }),
  ai: logger.child({ category: 'ai' }),
  cron: logger.child({ category: 'cron' }),
  server: logger.child({ category: 'server' }),
  errors: logger.child({ category: 'errors' })
};

/**
 * Create a logger instance with context
 * @param {string} context - Context name (e.g., 'GAME_REGISTRY', 'REDIS')
 * @returns {Object} Logger instance
 */
function createLogger(context = 'APP') {
  return {
    error: (message, error = null, meta = {}) => {
      const logMeta = {
        context,
        ...meta,
        ...(error && { error: error.message, stack: error.stack })
      };
      logger.error(message, logMeta);
    },

    warn: (message, meta = {}) => {
      logger.warn(message, { context, ...meta });
    },

    info: (message, meta = {}) => {
      logger.info(message, { context, ...meta });
    },

    debug: (message, meta = {}) => {
      logger.debug(message, { context, ...meta });
    },

    success: (message, meta = {}) => {
      logger.info(`✅ ${message}`, { context, ...meta });
    }
  };
}

// Export category loggers
module.exports = {
  Logger: logger,
  createLogger,
  games: categoryLoggers.games,
  chaos: categoryLoggers.chaos,
  ai: categoryLoggers.ai,
  cron: categoryLoggers.cron,
  server: categoryLoggers.server,
  errors: categoryLoggers.errors,
  LOG_LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
  }
};
