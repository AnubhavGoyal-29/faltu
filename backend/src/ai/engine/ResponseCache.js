/**
 * Response Cache
 * 
 * Caches AI responses to reduce API calls and improve performance.
 * Implements TTL-based cache with reason-specific expiration.
 * 
 * @version 1.0
 */

const crypto = require('crypto');

class ResponseCache {
  constructor() {
    this.cache = new Map();
    
    // TTL (time to live) in seconds for each reason type
    this.ttl = {
      'login': 60 * 5, // 5 minutes
      'idle': 60 * 2, // 2 minutes
      'chat': 60 * 1, // 1 minute
      'chaos': 60 * 3, // 3 minutes
      'joke': 60 * 10, // 10 minutes
      'roast': 60 * 5, // 5 minutes
      'dare': 60 * 5, // 5 minutes
      'rewards': 60 * 2, // 2 minutes
      'default': 60 * 3 // 3 minutes
    };
    
    // Max cache size
    this.maxSize = 1000;
    
    // Start cleanup interval
    this.startCleanup();
  }

  /**
   * Generate cache key from context
   */
  generateKey(context) {
    const keyData = {
      reason: context.reason,
      userId: context.user?.user_id || 'anonymous',
      action: context.appState?.action || context.appState?.mode || 'default'
    };
    
    const keyString = JSON.stringify(keyData);
    return crypto.createHash('md5').update(keyString).digest('hex');
  }

  /**
   * Get cached response
   */
  async get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    // Update access time
    cached.lastAccessed = Date.now();
    cached.hits++;
    
    return cached.data;
  }

  /**
   * Set cache entry
   */
  async set(key, data, reason = 'default') {
    // Check cache size limit
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    
    const ttl = (this.ttl[reason] || this.ttl.default) * 1000; // Convert to ms
    
    this.cache.set(key, {
      data,
      reason,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttl,
      lastAccessed: Date.now(),
      hits: 0
    });
  }

  /**
   * Evict oldest cache entry
   */
  evictOldest() {
    let oldestKey = null;
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Clear expired entries
   */
  clearExpired() {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    if (cleared > 0) {
      console.log(`🗑️ [CACHE] Cleared ${cleared} expired entries`);
    }
  }

  /**
   * Start automatic cleanup
   */
  startCleanup() {
    // Clean expired entries every minute
    setInterval(() => {
      this.clearExpired();
    }, 60 * 1000);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    let totalHits = 0;
    const reasonStats = {};
    
    for (const [key, entry] of this.cache.entries()) {
      totalHits += entry.hits;
      
      if (!reasonStats[entry.reason]) {
        reasonStats[entry.reason] = { count: 0, hits: 0 };
      }
      
      reasonStats[entry.reason].count++;
      reasonStats[entry.reason].hits += entry.hits;
    }
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      totalHits,
      reasonStats,
      hitRate: totalHits > 0 ? `${Math.round((totalHits / this.cache.size) * 100)}%` : '0%'
    };
  }

  /**
   * Set TTL for reason
   */
  setTTL(reason, seconds) {
    this.ttl[reason] = seconds;
  }

  /**
   * Get TTL for reason
   */
  getTTL(reason) {
    return this.ttl[reason] || this.ttl.default;
  }
}

module.exports = ResponseCache;

