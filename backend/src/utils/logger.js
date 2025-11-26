/**
 * Structured Logger
 * 
 * Provides consistent logging across the application.
 * 
 * @version 1.0
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] || LOG_LEVELS.INFO;

class Logger {
  constructor(context = 'APP') {
    this.context = context;
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] [${this.context}] ${message}${dataStr}`;
  }

  error(message, error = null, data = null) {
    if (CURRENT_LEVEL >= LOG_LEVELS.ERROR) {
      console.error(this.formatMessage('ERROR', message, data));
      if (error) {
        console.error('Error details:', error);
      }
    }
  }

  warn(message, data = null) {
    if (CURRENT_LEVEL >= LOG_LEVELS.WARN) {
      console.warn(this.formatMessage('WARN', message, data));
    }
  }

  info(message, data = null) {
    if (CURRENT_LEVEL >= LOG_LEVELS.INFO) {
      console.log(this.formatMessage('INFO', message, data));
    }
  }

  debug(message, data = null) {
    if (CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
      console.log(this.formatMessage('DEBUG', message, data));
    }
  }

  success(message, data = null) {
    if (CURRENT_LEVEL >= LOG_LEVELS.INFO) {
      console.log(`✅ ${this.formatMessage('SUCCESS', message, data)}`);
    }
  }
}

// Create logger factory
function createLogger(context) {
  return new Logger(context);
}

module.exports = { Logger, createLogger, LOG_LEVELS };

