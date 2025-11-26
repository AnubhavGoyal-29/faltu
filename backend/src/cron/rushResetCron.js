/**
 * Rush Activity Reset Cron Job
 * 
 * Handles daily reset of rush activities at midnight
 */

const cron = require('node-cron');
const { UserActivityTracking } = require('../models');
const { getRushActivityTypes, isDailyActivity } = require('../config/rushActivities');
const { Op } = require('sequelize');

/**
 * Schedule daily rush activity reset at midnight
 */
const scheduleRushReset = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('🎯 [RUSH] Daily reset chala rahe hain...');
      
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
      
      console.log(`🎯 [RUSH] ✅ Daily reset complete. ${result[0]} records updated.`);
    } catch (error) {
      console.error('🎯 [RUSH] ❌ Daily reset error:', error);
      // Don't throw - allow app to continue
    }
  });
};

module.exports = {
  scheduleRushReset
};

