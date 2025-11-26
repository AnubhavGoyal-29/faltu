/**
 * Redis-based Distributed Locks for Cron Jobs
 * 
 * Prevents double execution of cron jobs using Redis SETNX
 * 
 * @version 1.0
 */

const { get, set, del, expire } = require('../utils/redisClient');
const { createLogger } = require('../utils/logger');
const logger = createLogger('CRON_LOCKS');

/**
 * Acquire a distributed lock
 * @param {string} lockKey - Lock key
 * @param {number} ttl - Lock TTL in seconds (default: 300 = 5 minutes)
 * @returns {Promise<boolean>} - True if lock acquired, false otherwise
 */
const acquireLock = async (lockKey, ttl = 300) => {
  try {
    const lockValue = `${Date.now()}-${Math.random()}`;
    const result = await set(`lock:${lockKey}`, lockValue, ttl);
    
    if (result) {
      logger.debug(`Lock acquired: ${lockKey}`, { ttl });
      return true;
    }
    
    logger.debug(`Lock already held: ${lockKey}`);
    return false;
  } catch (error) {
    logger.warn('Failed to acquire lock (assuming lock held):', { lockKey, error: error.message });
    // On error, assume lock is held to prevent double execution
    return false;
  }
};

/**
 * Release a distributed lock
 * @param {string} lockKey - Lock key
 * @returns {Promise<boolean>} - True if lock released
 */
const releaseLock = async (lockKey) => {
  try {
    await del(`lock:${lockKey}`);
    logger.debug(`Lock released: ${lockKey}`);
    return true;
  } catch (error) {
    logger.warn('Failed to release lock:', { lockKey, error: error.message });
    return false;
  }
};

/**
 * Check if a lock is currently held
 * @param {string} lockKey - Lock key
 * @returns {Promise<boolean>} - True if lock is held
 */
const isLocked = async (lockKey) => {
  try {
    const value = await get(`lock:${lockKey}`);
    return value !== null;
  } catch (error) {
    logger.warn('Failed to check lock status:', { lockKey, error: error.message });
    // On error, assume lock is held to be safe
    return true;
  }
};

/**
 * Extend lock TTL
 * @param {string} lockKey - Lock key
 * @param {number} ttl - New TTL in seconds
 * @returns {Promise<boolean>} - True if lock extended
 */
const extendLock = async (lockKey, ttl) => {
  try {
    const result = await expire(`lock:${lockKey}`, ttl);
    if (result) {
      logger.debug(`Lock extended: ${lockKey}`, { ttl });
    }
    return result;
  } catch (error) {
    logger.warn('Failed to extend lock:', { lockKey, error: error.message });
    return false;
  }
};

/**
 * Execute a function with a distributed lock
 * @param {string} lockKey - Lock key
 * @param {Function} fn - Function to execute
 * @param {number} ttl - Lock TTL in seconds
 * @returns {Promise<any>} - Function result
 */
const withLock = async (lockKey, fn, ttl = 300) => {
  const acquired = await acquireLock(lockKey, ttl);
  
  if (!acquired) {
    logger.warn(`Skipping execution - lock held: ${lockKey}`);
    return null;
  }

  try {
    const result = await fn();
    return result;
  } finally {
    await releaseLock(lockKey);
  }
};

/**
 * Lock keys for common cron jobs
 */
const LOCK_KEYS = {
  LUCKY_DRAW_HOURLY: 'cron:lucky-draw:hourly',
  LUCKY_DRAW_MINUTE: 'cron:lucky-draw:minute',
  RUSH_RESET: 'cron:rush:reset',
  TAMBOLA_INIT: 'cron:tambola:init',
  CHAT_BOT_CHECK: 'cron:chat-bot:check'
};

module.exports = {
  acquireLock,
  releaseLock,
  isLocked,
  extendLock,
  withLock,
  LOCK_KEYS
};

