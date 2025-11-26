/**
 * Base Game Engine Class
 * 
 * Abstract base class for all FaltuVerse games.
 * Provides common game functionality and enforces consistent interfaces.
 * 
 * @version 1.0
 */

const { addPoints } = require('../core/pointsService');

class GameEngine {
  /**
   * @param {string} gameName - Unique game identifier
   * @param {Object} config - Game configuration
   */
  constructor(gameName, config = {}) {
    this.gameName = gameName;
    this.config = {
      pointsPerWin: 10,
      pointsPerPlay: 1,
      dailyLimit: null, // null = unlimited
      requiresAI: false,
      ...config
    };
    
    this.analytics = [];
  }

  // ===== ABSTRACT METHODS (Must be implemented by subclasses) =====

  /**
   * Initialize new game for user
   * @abstract
   */
  async initialize(userId, options = {}) {
    throw new Error(`${this.gameName}: initialize() must be implemented`);
  }

  /**
   * Process game action
   * @abstract
   */
  async processAction(userId, action, data = {}) {
    throw new Error(`${this.gameName}: processAction() must be implemented`);
  }

  /**
   * Get current game state for user
   * @abstract
   */
  async getState(userId) {
    throw new Error(`${this.gameName}: getState() must be implemented`);
  }

  /**
   * End/complete game
   * @abstract
   */
  async end(userId, result = {}) {
    throw new Error(`${this.gameName}: end() must be implemented`);
  }

  // ===== COMMON METHODS (Available to all games) =====

  /**
   * Award points to user
   */
  async awardPoints(userId, points, reason = null) {
    const finalReason = reason || `${this.gameName}_play`;
    await addPoints(userId, points, finalReason);
    
    this.trackEvent('points_awarded', {
      userId,
      points,
      reason: finalReason
    });
    
    return points;
  }

  /**
   * Validate action
   */
  validateAction(action, allowedActions) {
    if (!allowedActions.includes(action)) {
      throw new Error(`Invalid action: ${action}. Allowed: ${allowedActions.join(', ')}`);
    }
    return true;
  }

  /**
   * Check if user can play (daily limit check)
   */
  async canPlay(userId, playCount) {
    if (this.config.dailyLimit === null) return true;
    return playCount < this.config.dailyLimit;
  }

  /**
   * Track analytics event
   */
  trackEvent(eventType, data = {}) {
    const event = {
      game: this.gameName,
      eventType,
      data,
      timestamp: new Date().toISOString()
    };
    
    this.analytics.push(event);
    
    // Log for monitoring
    console.log(`🎮 [${this.gameName.toUpperCase()}] ${eventType}:`, JSON.stringify(data));
    
    return event;
  }

  /**
   * Get analytics data
   */
  getAnalytics() {
    return {
      game: this.gameName,
      events: this.analytics,
      summary: this.summarizeAnalytics()
    };
  }

  /**
   * Summarize analytics
   */
  summarizeAnalytics() {
    const summary = {
      totalEvents: this.analytics.length,
      eventTypes: {}
    };

    this.analytics.forEach(event => {
      if (!summary.eventTypes[event.eventType]) {
        summary.eventTypes[event.eventType] = 0;
      }
      summary.eventTypes[event.eventType]++;
    });

    return summary;
  }

  /**
   * Calculate score based on performance metrics
   */
  calculateScore(metrics = {}) {
    // Default scoring logic - override in subclasses
    const {
      accuracy = 0,
      speed = 0,
      creativity = 0,
      difficulty = 1
    } = metrics;

    const baseScore = (accuracy * 40) + (speed * 30) + (creativity * 30);
    const finalScore = Math.round(baseScore * difficulty);

    return Math.max(0, Math.min(100, finalScore));
  }

  /**
   * Get game config
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Update game config
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Reset analytics
   */
  resetAnalytics() {
    this.analytics = [];
  }

  /**
   * Get game info
   */
  getInfo() {
    return {
      name: this.gameName,
      config: this.getConfig(),
      stats: this.summarizeAnalytics()
    };
  }

  /**
   * Validate required data fields
   */
  validateData(data, requiredFields = []) {
    const missing = requiredFields.filter(field => !(field in data));
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    return true;
  }

  /**
   * Generate unique game session ID
   */
  generateSessionId(userId) {
    return `${this.gameName}_${userId}_${Date.now()}`;
  }

  /**
   * Format response for API
   */
  formatResponse(status, data = {}, message = null) {
    return {
      status,
      game: this.gameName,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Handle errors gracefully
   */
  handleError(error, context = {}) {
    console.error(`❌ [${this.gameName.toUpperCase()}] Error:`, error.message);
    console.error('Context:', context);
    
    this.trackEvent('error', {
      error: error.message,
      context
    });

    return this.formatResponse('error', {}, error.message);
  }
}

module.exports = GameEngine;

