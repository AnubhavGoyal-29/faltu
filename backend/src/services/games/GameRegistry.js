/**
 * Game Registry
 * 
 * Central registry of all games with unified interface.
 * Provides game discovery, instantiation, and management.
 * 
 * @version 1.0
 */

const gamesConfig = require('../../config/games');
const { createLogger } = require('../../utils/logger');
const logger = createLogger('GAME_REGISTRY');

class GameRegistry {
  constructor() {
    this.games = new Map();
    this.engineClasses = new Map();
  }

  /**
   * Register game engine class
   */
  register(gameName, EngineClass) {
    this.engineClasses.set(gameName, EngineClass);
    logger.info(`Game registered: ${gameName}`);
  }

  /**
   * Get or create game engine instance
   */
  getEngine(gameName) {
    // Check if game exists
    if (!this.engineClasses.has(gameName)) {
      throw new Error(`Game not found: ${gameName}`);
    }

    // Check if enabled
    const gameConfig = gamesConfig.games[gameName];
    if (gameConfig && !gameConfig.enabled) {
      throw new Error(`Game disabled: ${gameName}`);
    }

    // Return cached instance or create new one
    if (!this.games.has(gameName)) {
      const EngineClass = this.engineClasses.get(gameName);
      const instance = new EngineClass(gameName, gameConfig);
      this.games.set(gameName, instance);
    }

    return this.games.get(gameName);
  }

  /**
   * Play game (unified interface)
   */
  async play(gameName, userId, action, data = {}) {
    const engine = this.getEngine(gameName);
    
    try {
      return await engine.processAction(userId, action, data);
    } catch (error) {
      logger.error(`Error playing ${gameName}`, error);
      return engine.handleError(error, { userId, action, data });
    }
  }

  /**
   * Initialize game for user
   */
  async initialize(gameName, userId, options = {}) {
    const engine = this.getEngine(gameName);
    return await engine.initialize(userId, options);
  }

  /**
   * Get game state
   */
  async getState(gameName, userId) {
    const engine = this.getEngine(gameName);
    return await engine.getState(userId);
  }

  /**
   * End game
   */
  async end(gameName, userId, result = {}) {
    const engine = this.getEngine(gameName);
    return await engine.end(userId, result);
  }

  /**
   * Get all registered games
   */
  getRegisteredGames() {
    return Array.from(this.engineClasses.keys());
  }

  /**
   * Get enabled games
   */
  getEnabledGames() {
    return this.getRegisteredGames().filter(gameName => {
      const config = gamesConfig.games[gameName];
      return !config || config.enabled !== false;
    });
  }

  /**
   * Get game info
   */
  getGameInfo(gameName) {
    const engine = this.getEngine(gameName);
    const config = gamesConfig.games[gameName];
    
    return {
      name: gameName,
      enabled: !config || config.enabled !== false,
      config: config || {},
      engineInfo: engine.getInfo()
    };
  }

  /**
   * Get all games info
   */
  getAllGamesInfo() {
    return this.getRegisteredGames().map(gameName => this.getGameInfo(gameName));
  }

  /**
   * Check if game requires AI
   */
  requiresAI(gameName) {
    const config = gamesConfig.games[gameName];
    return config?.requiresAI || false;
  }

  /**
   * Get daily limit for game
   */
  getDailyLimit(gameName) {
    const config = gamesConfig.games[gameName];
    return config?.dailyLimit ?? gamesConfig.global.defaultDailyLimit;
  }

  /**
   * Clear game instance (force reload)
   */
  clearInstance(gameName) {
    this.games.delete(gameName);
  }

  /**
   * Clear all instances
   */
  clearAll() {
    this.games.clear();
  }
}

// Singleton instance
let registryInstance = null;

function getGameRegistry() {
  if (!registryInstance) {
    registryInstance = new GameRegistry();
  }
  return registryInstance;
}

module.exports = { GameRegistry, getGameRegistry };

