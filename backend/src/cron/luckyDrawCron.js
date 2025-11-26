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
    console.log('🎰 [LUCKY DRAW] Hourly draw chala rahe hain...');
    try {
      const result = await runLuckyDraw();
      if (result) {
        console.log(`🎰 [LUCKY DRAW] ✅ Winner: ${result.winner.name} - ${result.reward_points} points mil gaye!`);
        io.emit('lucky_draw_winner', {
          winner: result.winner,
          reward_points: result.reward_points,
          timestamp: result.draw.timestamp,
          type: 'hourly'
        });
      } else {
        console.log(`🎰 [LUCKY DRAW] ⚠️ Koi winner nahi mila`);
      }
    } catch (error) {
      console.error('🎰 [LUCKY DRAW] ❌ Error aaya bhai:', error.message);
    }
  });
};

/**
 * Schedule 5-minute lucky draw
 * @param {Object} io - Socket.IO instance
 */
const scheduleMinuteLuckyDraw = (io) => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log(`🎰 [LUCKY DRAW] 5-minute draw chala rahe hain...`);
      const result = await runMinuteLuckyDraw();
      
      if (result.shouldRun && result.winner) {
        console.log(`🎰 [LUCKY DRAW] ✅ Winner: ${result.winner.name} - ${result.reward_points} points!`);
        // Broadcast to all connected clients
        io.emit('lucky_draw_result', {
          winner: result.winner,
          reward_points: result.reward_points,
          message: result.message,
          timestamp: result.timestamp,
          type: 'winner'
        });
      } else if (result.message) {
        console.log(`🎰 [LUCKY DRAW] 💬 Message: ${result.message}`);
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
      console.error('🎰 [LUCKY DRAW] ❌ Error:', error.message);
    }
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

