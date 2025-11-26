const { UserActivityTracking } = require('../models');
const { getRushActivityTypes, getActivityConfig, isDailyActivity } = require('../config/rushActivities');

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

  return tracking;
};

/**
 * Get next rush activity for user
 * Priority: Unvisited > Least frequency > Daily activities first
 */
const getNextRushActivity = async (userId) => {
  // Reset daily status if needed
  await resetDailyStatus(userId);

  const today = new Date().toISOString().split('T')[0];
  const allActivityTypes = getRushActivityTypes();

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

  for (const activityType of allActivityTypes) {
    const tracking = trackingMap.get(activityType);
    const config = getActivityConfig(activityType);

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
  const allActivityTypes = getRushActivityTypes();
  const today = new Date().toISOString().split('T')[0];

  const trackings = await UserActivityTracking.findAll({
    where: {
      user_id: userId,
      activity_type: {
        [require('sequelize').Op.in]: allActivityTypes
      }
    }
  });

  const totalActivities = allActivityTypes.length;
  const visitedCount = trackings.length;
  const visitedToday = trackings.filter(t => {
    const statusDate = t.status_date ? new Date(t.status_date).toISOString().split('T')[0] : null;
    return statusDate === today && t.status;
  }).length;

  return {
    total_activities: totalActivities,
    visited_count: visitedCount,
    visited_today: visitedToday,
    remaining_today: totalActivities - visitedToday
  };
};

module.exports = {
  resetDailyStatus,
  getOrCreateTracking,
  markActivityVisited,
  markActivityStatus,
  getNextRushActivity,
  hasAvailableRushActivities,
  getUserRushStats
};

