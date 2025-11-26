/**
 * Lucky Draw Cron Jobs
 * 
 * Handles scheduled lucky draw events:
 * - Hourly lucky draw
 * - 5-minute lucky draw with timer
 */

const cron = require('node-cron');
const { runLuckyDraw } = require('../services/luckyDrawService');
const { runMinuteLuckyDraw } = require('../services/minuteLuckyDrawService');
const { withLock, LOCK_KEYS } = require('./locks');
const { cron: cronLogger } = require('../utils/logger');

// Backend-driven lucky draw timer state
let luckyDrawTimer = 300; // 5 minutes in seconds
let luckyDrawStartTime = Date.now();

/**
 * Initialize lucky draw timer broadcasting
 * @param {Object} io - Socket.IO instance
 */
const initializeLuckyDrawTimer = (io) => {
  // Update timer every second and broadcast
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - luckyDrawStartTime) / 1000);
    luckyDrawTimer = Math.max(0, 300 - elapsed);
    
    // Broadcast timer to all clients
    io.emit('lucky_draw_timer', {
      timeLeft: luckyDrawTimer,
      nextDrawTime: luckyDrawStartTime + 300000
    });
    
    // Reset timer when it reaches 0
    if (luckyDrawTimer <= 0) {
      luckyDrawStartTime = Date.now();
      luckyDrawTimer = 300;
    }
  }, 1000);
};

/**
 * Schedule hourly lucky draw
 * @param {Object} io - Socket.IO instance
 */
const scheduleHourlyLuckyDraw = (io) => {
  cron.schedule('0 * * * *', async () => {
    await withLock(LOCK_KEYS.LUCKY_DRAW_HOURLY, async () => {
      cronLogger.info('Hourly lucky draw starting...');
      try {
        const result = await runLuckyDraw();
        if (result) {
          cronLogger.info('Hourly lucky draw winner', { 
            winner: result.winner.name, 
            points: result.reward_points 
          });
          io.emit('lucky_draw_winner', {
            winner: result.winner,
            reward_points: result.reward_points,
            timestamp: result.draw.timestamp,
            type: 'hourly'
          });
        } else {
          cronLogger.info('No winner in hourly lucky draw');
        }
      } catch (error) {
        cronLogger.error('Hourly lucky draw error', error);
      }
    }, 300); // 5 minute lock
  });
};

/**
 * Schedule 5-minute lucky draw
 * @param {Object} io - Socket.IO instance
 */
const scheduleMinuteLuckyDraw = (io) => {
  cron.schedule('*/5 * * * *', async () => {
    await withLock(LOCK_KEYS.LUCKY_DRAW_MINUTE, async () => {
      cronLogger.info('5-minute lucky draw starting...');
      try {
        const result = await runMinuteLuckyDraw();
        
        if (result.shouldRun && result.winner) {
          cronLogger.info('5-minute lucky draw winner', { 
            winner: result.winner.name, 
            points: result.reward_points 
          });
          // Broadcast to all connected clients
          io.emit('lucky_draw_result', {
            winner: result.winner,
            reward_points: result.reward_points,
            message: result.message,
            timestamp: result.timestamp,
            type: 'winner'
          });
        } else if (result.message) {
          cronLogger.info('5-minute lucky draw message', { message: result.message });
          // Broadcast message
          io.emit('lucky_draw_result', {
            message: result.message,
            type: result.type || 'message'
          });
        }
        
        // Reset timer
        luckyDrawStartTime = Date.now();
        luckyDrawTimer = 300;
      } catch (error) {
        cronLogger.error('5-minute lucky draw error', error);
      }
    }, 300); // 5 minute lock
  });
};

/**
 * Initialize all lucky draw cron jobs
 * @param {Object} io - Socket.IO instance
 */
const initializeLuckyDrawCrons = (io) => {
  initializeLuckyDrawTimer(io);
  scheduleHourlyLuckyDraw(io);
  scheduleMinuteLuckyDraw(io);
};

module.exports = {
  initializeLuckyDrawCrons
};

