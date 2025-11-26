/**
 * Rush Activity Reset Cron Job
 * 
 * Handles daily reset of rush activities at midnight
 */

const cron = require('node-cron');
const { UserActivityTracking } = require('../models');
const { getRushActivityTypes, isDailyActivity } = require('../config/rushActivities');
const { Op } = require('sequelize');
const { withLock, LOCK_KEYS } = require('./locks');
const { cron: cronLogger } = require('../utils/logger');
const { delPattern } = require('../utils/redisClient');
const cacheConfig = require('../config/cache');

/**
 * Schedule daily rush activity reset at midnight
 */
const scheduleRushReset = () => {
  cron.schedule('0 0 * * *', async () => {
    await withLock(LOCK_KEYS.RUSH_RESET, async () => {
      try {
        cronLogger.info('Daily rush reset starting...');
        
        const today = new Date().toISOString().split('T')[0];
        const dailyActivityTypes = getRushActivityTypes().filter(type => isDailyActivity(type));
        
        // Reset all daily activities for all users
        const result = await UserActivityTracking.update(
          { 
            status: null,
            status_date: null
          },
          {
            where: {
              activity_type: {
                [Op.in]: dailyActivityTypes
              },
              status_date: {
                [Op.ne]: today
              }
            }
          }
        );
        
        // Invalidate rush caches
        await delPattern('rush:next:*');
        await delPattern('rush:queue:*');
        
        cronLogger.info('Daily rush reset complete', { recordsUpdated: result[0] });
      } catch (error) {
        cronLogger.error('Daily rush reset error', error);
        // Don't throw - allow app to continue
      }
    }, 600); // 10 minute lock
  });
};

module.exports = {
  scheduleRushReset
};

