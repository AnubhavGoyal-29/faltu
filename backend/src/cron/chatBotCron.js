/**
 * Chat Bot Cron Jobs
 * 
 * Handles periodic AI chat bot checks
 */

const cron = require('node-cron');
const { ChatRoom } = require('../models');
const { processChatRoomForAI } = require('../ai/handlers/aiChatBot');

/**
 * Schedule periodic AI chat room checks
 * @param {Object} io - Socket.IO instance
 */
const scheduleChatBotChecks = (io) => {
  cron.schedule('*/2 * * * *', async () => {
    try {
      console.log(`🤖 [CHAT BOT] Periodic check chala rahe hain...`);
      
      const activeRooms = await ChatRoom.findAll({
        limit: 10,
        order: [['created_at', 'DESC']]
      });

      console.log(`🤖 [CHAT BOT] ${activeRooms.length} active rooms mil gaye`);
      for (const room of activeRooms) {
        await processChatRoomForAI(room.room_id, room.name, io);
      }
    } catch (error) {
      console.error(`🤖 [CHAT BOT] ❌ Periodic check error:`, error.message);
    }
  });
};

module.exports = {
  scheduleChatBotChecks
};

