const { generateChatResponse } = require('./aiDecisionEngine');
const { ChatMessage, User } = require('../models');

// AI Bot user ID (virtual user)
const AI_BOT_ID = -1;
const AI_BOT_NAME = 'FaltuBot';
const AI_BOT_AVATAR = '🤖';

// Check if chat needs AI intervention
const shouldAIIntervene = (messages, lastMessageTime) => {
  // Intervene if:
  // 1. No messages in last 30 seconds
  // 2. More than 5 messages in room
  // 3. Random chance (20%)
  
  const timeSinceLastMessage = Date.now() - (lastMessageTime || 0);
  const isSilent = timeSinceLastMessage > 30000;
  const hasActivity = messages.length > 5;
  const randomChance = Math.random() < 0.2;

  return isSilent || (hasActivity && randomChance);
};

// Generate and return AI chat message
const generateAIChatMessage = async (roomId, roomName, recentMessages = []) => {
  console.log(`🤖 [CHAT BOT] Room: ${roomName}, Messages: ${recentMessages.length}`);
  try {
    // Get context from recent messages
    const chatContext = {
      roomName,
      messageCount: recentMessages.length
    };

    // Generate AI response
    console.log(`🤖 [CHAT BOT] AI ko call kar rahe hain...`);
    const aiResponse = await generateChatResponse(
      { name: AI_BOT_NAME },
      chatContext,
      recentMessages
    );

    if (aiResponse && aiResponse.shouldSend && aiResponse.message) {
      console.log(`🤖 [CHAT BOT] ✅ AI message generate hua: ${aiResponse.message.substring(0, 50)}...`);
      return {
        message_id: `ai_${Date.now()}`,
        room_id: roomId,
        user_id: AI_BOT_ID,
        message: aiResponse.message,
        user: {
          user_id: AI_BOT_ID,
          name: AI_BOT_NAME,
          profile_photo: null
        },
        created_at: new Date(),
        isAI: true
      };
    } else {
      console.log(`🤖 [CHAT BOT] ⚠️ AI response nahi mila ya shouldSend false hai`);
    }
  } catch (error) {
    console.error(`🤖 [CHAT BOT] ❌ Error aaya bhai:`, error.message);
  }

  return null;
};

// Process chat room for AI intervention
const processChatRoomForAI = async (roomId, roomName, io) => {
  try {
    // Get recent messages (last 10)
    const recentMessages = await ChatMessage.findAll({
      where: { room_id: roomId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['user_id', 'name']
      }],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    if (recentMessages.length === 0) return;

    const lastMessage = recentMessages[0];
    const lastMessageTime = new Date(lastMessage.created_at).getTime();

    // Check if AI should intervene
    if (shouldAIIntervene(recentMessages, lastMessageTime)) {
      console.log(`🤖 [CHAT BOT] ✅ Intervention zaroori hai - AI message generate kar rahe hain`);
      const aiMessage = await generateAIChatMessage(roomId, roomName, recentMessages.reverse());

      if (aiMessage) {
        console.log(`🤖 [CHAT BOT] ✅ Room ${roomId} mein message broadcast kar rahe hain`);
        // Broadcast AI message to room
        io.to(`room_${roomId}`).emit('new_message', {
          ...aiMessage,
          user: {
            user_id: AI_BOT_ID,
            name: AI_BOT_NAME,
            profile_photo: null
          }
        });
      } else {
        console.log(`🤖 [CHAT BOT] ⚠️ AI message generate nahi hua`);
      }
    } else {
      console.log(`🤖 [CHAT BOT] ℹ️ Intervention zaroori nahi hai`);
    }
  } catch (error) {
    console.error(`🤖 [CHAT BOT] ❌ Room processing error:`, error.message);
  }
};

module.exports = {
  AI_BOT_ID,
  AI_BOT_NAME,
  AI_BOT_AVATAR,
  generateAIChatMessage,
  processChatRoomForAI,
  shouldAIIntervene
};

