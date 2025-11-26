/**
 * Cache Configuration
 * 
 * Central configuration for Redis cache keys and TTLs
 * 
 * @version 1.0
 */

module.exports = {
  // Cache Key Prefixes
  prefixes: {
    games: 'games',
    rush: 'rush',
    wordle: 'wordle',
    tambola: 'tambola',
    leaderboard: 'leaderboard',
    prompts: 'prompts',
    lucky: 'lucky',
    user: 'user'
  },

  // Cache TTLs (in seconds)
  ttl: {
    // Game configurations - rarely change
    gamesConfig: 12 * 60 * 60, // 12 hours
    
    // Daily rush activities - regenerated at midnight
    rushNext: 15 * 60, // 15 minutes
    rushQueue: 15 * 60, // 15 minutes
    
    // Wordle daily word - changes daily
    wordleDaily: 26 * 60 * 60, // 26 hours (covers day boundary)
    
    // Tambola room state - active during game
    tambolaRoom: 60 * 60, // 1 hour (or until room completes)
    
    // Leaderboard snapshots - update frequently
    leaderboardSnapshot: 5 * 60, // 5 minutes
    
    // AI prompts - loaded from filesystem
    prompts: 24 * 60 * 60, // 24 hours
    
    // Lucky draw active users - heartbeat-based expiry
    luckyActiveSet: 10 * 60, // 10 minutes (refreshed on heartbeat)
    
    // User-specific caches
    userActivity: 15 * 60, // 15 minutes
    userPoints: 5 * 60 // 5 minutes
  },

  // Cache key generators
  keys: {
    gamesConfig: () => 'games:config',
    rushNext: (userId, date) => `rush:next:${userId}:${date}`,
    rushQueue: (date) => `rush:queue:${date}`,
    wordleDaily: (date) => `wordle:daily:${date}`,
    tambolaRoom: (roomId) => `tambola:room:${roomId}`,
    leaderboardSnapshot: (type) => `leaderboard:snapshot:${type || 'global'}`,
    prompt: (name) => `prompts:${name}`,
    luckyActiveSet: () => 'lucky:active:set',
    userActivity: (userId) => `user:activity:${userId}`,
    userPoints: (userId) => `user:points:${userId}`
  },

  // Cache invalidation patterns
  invalidation: {
    // Clear all game-related caches
    clearGames: () => ['games:config'],
    
    // Clear rush-related caches
    clearRush: (userId, date) => [
      `rush:next:${userId}:${date}`,
      `rush:queue:${date}`
    ],
    
    // Clear tambola room cache
    clearTambolaRoom: (roomId) => [`tambola:room:${roomId}`],
    
    // Clear user caches
    clearUser: (userId) => [
      `user:activity:${userId}`,
      `user:points:${userId}`,
      `rush:next:${userId}:*`
    ],
    
    // Clear leaderboard
    clearLeaderboard: () => ['leaderboard:snapshot:*']
  }
};

