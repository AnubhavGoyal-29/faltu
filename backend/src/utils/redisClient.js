/**
 * Redis Client Utility
 * 
 * Provides a centralized Redis client with:
 * - Connection management
 * - JSON serialization/deserialization
 * - Safe fallbacks when Redis is unavailable
 * - Common operations (get, set, del, lists, sets)
 * 
 * @version 1.0
 */

const Redis = require('ioredis');
const { createLogger } = require('./logger');
const logger = createLogger('REDIS');

let redisClient = null;
let redisEnabled = false;

/**
 * Initialize Redis connection
 */
const initializeRedis = () => {
  try {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisPassword = process.env.REDIS_PASSWORD || null;
    const redisDb = parseInt(process.env.REDIS_DB || '0', 10);

    // Use URL if provided, otherwise use host/port
    if (redisUrl) {
      redisClient = new Redis(redisUrl, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true
      });
    } else {
      redisClient = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        db: redisDb,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true
      });
    }

    // Event handlers
    redisClient.on('connect', () => {
      logger.info('Redis connecting...');
    });

    redisClient.on('ready', () => {
      redisEnabled = true;
      logger.success('Redis connected and ready');
    });

    redisClient.on('error', (error) => {
      redisEnabled = false;
      logger.warn('Redis error (falling back to DB):', { error: error.message });
    });

    redisClient.on('close', () => {
      redisEnabled = false;
      logger.warn('Redis connection closed');
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    // Attempt connection
    redisClient.connect().catch((error) => {
      redisEnabled = false;
      logger.warn('Redis connection failed (falling back to DB):', { error: error.message });
    });

    return redisClient;
  } catch (error) {
    redisEnabled = false;
    logger.error('Redis initialization failed (falling back to DB):', error);
    return null;
  }
};

/**
 * Check if Redis is available
 */
const isRedisAvailable = () => {
  return redisEnabled && redisClient && redisClient.status === 'ready';
};

/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {Promise<any>} - Cached value or null
 */
const get = async (key) => {
  if (!isRedisAvailable()) {
    return null;
  }

  try {
    const value = await redisClient.get(key);
    if (value === null) {
      return null;
    }
    
    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    logger.warn('Redis get error:', { key, error: error.message });
    return null;
  }
};

/**
 * Set value in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache (will be JSON stringified)
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {Promise<boolean>} - Success status
 */
const set = async (key, value, ttl = null) => {
  if (!isRedisAvailable()) {
    return false;
  }

  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (ttl) {
      await redisClient.setex(key, ttl, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
    
    return true;
  } catch (error) {
    logger.warn('Redis set error:', { key, error: error.message });
    return false;
  }
};

/**
 * Delete key from cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} - Success status
 */
const del = async (key) => {
  if (!isRedisAvailable()) {
    return false;
  }

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.warn('Redis del error:', { key, error: error.message });
    return false;
  }
};

/**
 * Delete multiple keys matching pattern
 * @param {string} pattern - Key pattern (e.g., 'user:*')
 * @returns {Promise<number>} - Number of keys deleted
 */
const delPattern = async (pattern) => {
  if (!isRedisAvailable()) {
    return 0;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) {
      return 0;
    }
    await redisClient.del(...keys);
    return keys.length;
  } catch (error) {
    logger.warn('Redis delPattern error:', { pattern, error: error.message });
    return 0;
  }
};

/**
 * Set expiration on key
 * @param {string} key - Cache key
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<boolean>} - Success status
 */
const expire = async (key, ttl) => {
  if (!isRedisAvailable()) {
    return false;
  }

  try {
    await redisClient.expire(key, ttl);
    return true;
  } catch (error) {
    logger.warn('Redis expire error:', { key, error: error.message });
    return false;
  }
};

/**
 * Get TTL of key
 * @param {string} key - Cache key
 * @returns {Promise<number>} - TTL in seconds (-1 if no expiry, -2 if key doesn't exist)
 */
const ttl = async (key) => {
  if (!isRedisAvailable()) {
    return -2;
  }

  try {
    return await redisClient.ttl(key);
  } catch (error) {
    logger.warn('Redis ttl error:', { key, error: error.message });
    return -2;
  }
};

/**
 * List operations - Push to left of list
 */
const lpush = async (key, ...values) => {
  if (!isRedisAvailable()) {
    return 0;
  }

  try {
    return await redisClient.lpush(key, ...values.map(v => typeof v === 'string' ? v : JSON.stringify(v)));
  } catch (error) {
    logger.warn('Redis lpush error:', { key, error: error.message });
    return 0;
  }
};

/**
 * List operations - Pop from left of list
 */
const lpop = async (key) => {
  if (!isRedisAvailable()) {
    return null;
  }

  try {
    const value = await redisClient.lpop(key);
    if (value === null) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    logger.warn('Redis lpop error:', { key, error: error.message });
    return null;
  }
};

/**
 * Set operations - Add member to set
 */
const sadd = async (key, ...members) => {
  if (!isRedisAvailable()) {
    return 0;
  }

  try {
    return await redisClient.sadd(key, ...members);
  } catch (error) {
    logger.warn('Redis sadd error:', { key, error: error.message });
    return 0;
  }
};

/**
 * Set operations - Remove member from set
 */
const srem = async (key, ...members) => {
  if (!isRedisAvailable()) {
    return 0;
  }

  try {
    return await redisClient.srem(key, ...members);
  } catch (error) {
    logger.warn('Redis srem error:', { key, error: error.message });
    return 0;
  }
};

/**
 * Set operations - Get all members of set
 */
const smembers = async (key) => {
  if (!isRedisAvailable()) {
    return [];
  }

  try {
    return await redisClient.smembers(key);
  } catch (error) {
    logger.warn('Redis smembers error:', { key, error: error.message });
    return [];
  }
};

/**
 * Check if key exists
 */
const exists = async (key) => {
  if (!isRedisAvailable()) {
    return false;
  }

  try {
    const result = await redisClient.exists(key);
    return result === 1;
  } catch (error) {
    logger.warn('Redis exists error:', { key, error: error.message });
    return false;
  }
};

/**
 * Get or set with fallback
 * @param {string} key - Cache key
 * @param {Function} fallback - Function to call if cache miss
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<any>} - Cached value or fallback result
 */
const getOrSet = async (key, fallback, ttl = null) => {
  // Try to get from cache
  const cached = await get(key);
  if (cached !== null) {
    return cached;
  }

  // Cache miss - call fallback
  try {
    const value = await fallback();
    if (value !== null && value !== undefined) {
      await set(key, value, ttl);
    }
    return value;
  } catch (error) {
    logger.error('getOrSet fallback error:', { key, error: error.message });
    throw error;
  }
};

/**
 * Close Redis connection
 */
const close = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
      redisEnabled = false;
      logger.info('Redis connection closed');
    } catch (error) {
      logger.warn('Error closing Redis connection:', { error: error.message });
    }
  }
};

// Initialize on module load
if (process.env.REDIS_ENABLED !== 'false') {
  initializeRedis();
}

module.exports = {
  initializeRedis,
  isRedisAvailable,
  get,
  set,
  del,
  delPattern,
  expire,
  ttl,
  lpush,
  lpop,
  sadd,
  srem,
  smembers,
  exists,
  getOrSet,
  close,
  client: () => redisClient
};

