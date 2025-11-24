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
  try {
    // Get context from recent messages
    const chatContext = {
      roomName,
      messageCount: recentMessages.length
    };

    // Generate AI response
    const aiResponse = await generateChatResponse(
      { name: AI_BOT_NAME },
      chatContext,
      recentMessages
    );

    if (aiResponse && aiResponse.shouldSend && aiResponse.message) {
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
    }
  } catch (error) {
    console.error('AI chat generation error:', error);
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
      const aiMessage = await generateAIChatMessage(roomId, roomName, recentMessages.reverse());

      if (aiMessage) {
        // Broadcast AI message to room
        io.to(`room_${roomId}`).emit('new_message', {
          ...aiMessage,
          user: {
            user_id: AI_BOT_ID,
            name: AI_BOT_NAME,
            profile_photo: null
          }
        });
      }
    }
  } catch (error) {
    console.error('AI chat room processing error:', error);
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

