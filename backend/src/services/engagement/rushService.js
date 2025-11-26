const { UserActivityTracking } = require('../../models');
const { getRushActivityTypes, getActivityConfig, isDailyActivity } = require('../../config/rushActivities');
const { getOrSet, del, get, set } = require('../../utils/redisClient');
const cacheConfig = require('../../config/cache');
const gamesConfig = require('../../config/games');

/**
 * Reset daily status for activities (called at midnight or when needed)
 */
const resetDailyStatus = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  
  await UserActivityTracking.update(
    { 
      status: null,
      status_date: null
    },
    {
      where: {
        user_id: userId,
        status_date: {
          [require('sequelize').Op.ne]: today
        }
      }
    }
  );
};

/**
 * Get or create activity tracking record for user
 */
const getOrCreateTracking = async (userId, activityType) => {
  let tracking = await UserActivityTracking.findOne({
    where: {
      user_id: userId,
      activity_type: activityType
    }
  });

  if (!tracking) {
    tracking = await UserActivityTracking.create({
      user_id: userId,
      activity_type: activityType,
      visit_count: 0
    });
  }

  return tracking;
};

/**
 * Mark activity as visited
 */
const markActivityVisited = async (userId, activityType) => {
  const tracking = await getOrCreateTracking(userId, activityType);
  
  await tracking.update({
    visit_count: tracking.visit_count + 1,
    last_visited_at: new Date()
  });

  return tracking;
};

/**
 * Mark activity as completed/skipped
 */
const markActivityStatus = async (userId, activityType, status) => {
  if (!['seen', 'completed', 'skipped'].includes(status)) {
    throw new Error('Invalid status');
  }

  const today = new Date().toISOString().split('T')[0];
  const tracking = await getOrCreateTracking(userId, activityType);

  const updateData = {
    status: status,
    status_date: today
  };

  if (status === 'completed') {
    updateData.last_completed_at = new Date();
  }

  await tracking.update(updateData);

  // Invalidate cache for this user
  const cacheKey = cacheConfig.keys.rushNext(userId, today);
  await del(cacheKey);

  return tracking;
};

/**
 * Games that should be excluded from rush assignments
 * - tambola: Scheduled game, doesn't fit rush flow
 * - chaosMode (Room Chaos): Multiplayer room-based, doesn't fit rush flow
 */
const RUSH_EXCLUDED_GAMES = ['tambola', 'chaosMode'];

/**
 * Assign 10 random games to user for rush (per day)
 * If games already assigned for today, return existing assignment
 */
const assignRushGames = async (userId, forceNew = false) => {
  const today = new Date().toISOString().split('T')[0];
  const assignedKey = `rush:assigned:${userId}:${today}`;
  
  // Check if already assigned (unless forcing new)
  if (!forceNew) {
    const existing = await get(assignedKey);
    if (existing && Array.isArray(existing) && existing.length > 0) {
      return existing;
    }
  }
  
  // Get all enabled games from games config, excluding rush-excluded games
  const allGames = Object.keys(gamesConfig.games).filter(gameKey => {
    const game = gamesConfig.games[gameKey];
    // Exclude if disabled or in exclusion list
    return game.enabled !== false && !RUSH_EXCLUDED_GAMES.includes(gameKey);
  });
  
  // Shuffle and pick 10 random games
  const shuffled = [...allGames].sort(() => Math.random() - 0.5);
  const assignedGames = shuffled.slice(0, 10);
  
  // Store in Redis with 26 hour TTL (covers day boundary)
  await set(assignedKey, assignedGames, 26 * 60 * 60);
  
  return assignedGames;
};

/**
 * Get assigned rush games for user
 */
const getAssignedRushGames = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  const assignedKey = `rush:assigned:${userId}:${today}`;
  const assigned = await get(assignedKey);
  
  if (!assigned || !Array.isArray(assigned) || assigned.length === 0) {
    // Auto-assign if not assigned
    return await assignRushGames(userId, false);
  }
  
  return assigned;
};

/**
 * Restart rush - assign new games
 */
const restartRush = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  const assignedKey = `rush:assigned:${userId}:${today}`;
  
  // Clear existing assignment
  await del(assignedKey);
  
  // Clear next activity cache
  const cacheKey = cacheConfig.keys.rushNext(userId, today);
  await del(cacheKey);
  
  // Assign new games
  return await assignRushGames(userId, true);
};

/**
 * Get next rush activity for user
 * Only from assigned games, prioritizing uncompleted ones
 */
const getNextRushActivity = async (userId) => {
  // Reset daily status if needed
  await resetDailyStatus(userId);

  const today = new Date().toISOString().split('T')[0];
  const cacheKey = cacheConfig.keys.rushNext(userId, today);
  
  // Try cache first
  return await getOrSet(
    cacheKey,
    async () => {
      return await _getNextRushActivityInternal(userId, today);
    },
    cacheConfig.ttl.rushNext
  );
};

/**
 * Internal function to compute next rush activity (uncached)
 * Only considers assigned games
 */
const _getNextRushActivityInternal = async (userId, today) => {
  // Get assigned games for this user
  const assignedGames = await getAssignedRushGames(userId);
  
  // Convert game keys to activity types (they should match)
  const allActivityTypes = assignedGames;

  // Get all tracking records for user
  const allTrackings = await UserActivityTracking.findAll({
    where: {
      user_id: userId,
      activity_type: {
        [require('sequelize').Op.in]: allActivityTypes
      }
    }
  });

  // Create a map of activity types to tracking records
  const trackingMap = new Map();
  allTrackings.forEach(t => {
    trackingMap.set(t.activity_type, t);
  });

  // Separate activities into categories
  const unvisitedActivities = [];
  const visitedTodayActivities = [];
  const availableActivities = [];

  // Helper to get activity config
  const getActivityConfigForGame = (activityType) => {
    // Try rush activities config first
    let config = getActivityConfig(activityType);
    if (config) return config;
    
    // Fallback to games config
    if (gamesConfig.games[activityType]) {
      const game = gamesConfig.games[activityType];
      // Convert camelCase to Title Case
      const name = activityType
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      
      return {
        type: activityType,
        name: name,
        route: `/games/${activityType}`,
        category: game.dailyLimit ? 'daily' : 'repeatable',
        description: `Play ${name}`
      };
    }
    
    return null;
  };

  for (const activityType of allActivityTypes) {
    const tracking = trackingMap.get(activityType);
    const config = getActivityConfigForGame(activityType);
    
    if (!config) continue; // Skip if no config found

    if (!tracking) {
      // Never visited
      unvisitedActivities.push({
        type: activityType,
        config: config,
        visit_count: 0
      });
    } else {
      const statusDate = tracking.status_date ? new Date(tracking.status_date).toISOString().split('T')[0] : null;
      
      if (statusDate === today && tracking.status) {
        // Already visited/completed/skipped today
        visitedTodayActivities.push({
          type: activityType,
          config: config,
          visit_count: tracking.visit_count
        });
      } else {
        // Available to show
        availableActivities.push({
          type: activityType,
          config: config,
          visit_count: tracking.visit_count || 0
        });
      }
    }
  }

  // Priority 1: Unvisited activities (daily first, then others)
  if (unvisitedActivities.length > 0) {
    const dailyUnvisited = unvisitedActivities.filter(a => isDailyActivity(a.type));
    const otherUnvisited = unvisitedActivities.filter(a => !isDailyActivity(a.type));
    
    // Return first daily unvisited, or first other unvisited
    const selected = dailyUnvisited.length > 0 ? dailyUnvisited[0] : otherUnvisited[0];
    return {
      activity: selected.config,
      isNew: true,
      visit_count: 0
    };
  }

  // Priority 2: Available activities (least frequency first, daily prioritized)
  if (availableActivities.length > 0) {
    // Sort by visit_count (ascending) - least visited first
    availableActivities.sort((a, b) => {
      // Daily activities get slight priority
      const aIsDaily = isDailyActivity(a.type);
      const bIsDaily = isDailyActivity(b.type);
      
      if (aIsDaily && !bIsDaily) return -1;
      if (!aIsDaily && bIsDaily) return 1;
      
      // Then by visit count
      return a.visit_count - b.visit_count;
    });

    const selected = availableActivities[0];
    return {
      activity: selected.config,
      isNew: false,
      visit_count: selected.visit_count
    };
  }

  // All activities done for today
  return null;
};

/**
 * Check if user has any available rush activities
 */
const hasAvailableRushActivities = async (userId) => {
  const nextActivity = await getNextRushActivity(userId);
  return nextActivity !== null;
};

/**
 * Get user's rush statistics
 */
const getUserRushStats = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Get assigned games
  const assignedGames = await getAssignedRushGames(userId);

  const trackings = await UserActivityTracking.findAll({
    where: {
      user_id: userId,
      activity_type: {
        [require('sequelize').Op.in]: assignedGames
      }
    }
  });

  const totalActivities = assignedGames.length;
  
  // Count completed activities (status is 'completed' for today)
  const completedToday = trackings.filter(t => {
    const statusDate = t.status_date ? new Date(t.status_date).toISOString().split('T')[0] : null;
    return statusDate === today && t.status === 'completed';
  }).length;
  
  // Count all activities with any status today (seen, completed, skipped)
  const visitedToday = trackings.filter(t => {
    const statusDate = t.status_date ? new Date(t.status_date).toISOString().split('T')[0] : null;
    return statusDate === today && t.status;
  }).length;

  return {
    total_activities: totalActivities,
    completed_count: completedToday,
    visited_today: visitedToday,
    remaining_today: totalActivities - visitedToday,
    progress: `${completedToday}/${totalActivities}`
  };
};

module.exports = {
  resetDailyStatus,
  getOrCreateTracking,
  markActivityVisited,
  markActivityStatus,
  getNextRushActivity,
  hasAvailableRushActivities,
  getUserRushStats,
  assignRushGames,
  getAssignedRushGames,
  restartRush
};

