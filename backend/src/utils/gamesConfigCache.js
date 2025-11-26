/**
 * Games Config Cache Helper
 * 
 * Provides cached access to games configuration
 * 
 * @version 1.0
 */

const gamesConfig = require('../config/games');
const { getOrSet } = require('./redisClient');
const cacheConfig = require('../config/cache');

/**
 * Get games configuration (cached)
 * @returns {Promise<Object>} Games configuration
 */
const getGamesConfig = async () => {
  const cacheKey = cacheConfig.keys.gamesConfig();
  
  return await getOrSet(
    cacheKey,
    () => gamesConfig,
    cacheConfig.ttl.gamesConfig
  );
};

/**
 * Get specific game configuration
 * @param {string} gameName - Game name
 * @returns {Promise<Object>} Game configuration
 */
const getGameConfig = async (gameName) => {
  const config = await getGamesConfig();
  return config.games[gameName] || null;
};

/**
 * Clear games config cache
 */
const clearGamesConfigCache = async () => {
  const { del } = require('./redisClient');
  const cacheKey = cacheConfig.keys.gamesConfig();
  await del(cacheKey);
};

module.exports = {
  getGamesConfig,
  getGameConfig,
  clearGamesConfigCache
};

