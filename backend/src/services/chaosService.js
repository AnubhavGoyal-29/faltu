const { ChaosEvent, User } = require('../models');
const { addPoints } = require('./pointsService');
const { generateChaosAction, isAIEnabled } = require('../ai/handlers/aiDecisionEngine');
const { getRandomChaosAnimation, getChaosAnimationConfig, CHAOS_ANIMATION_TYPES } = require('./chaosAnimations');

// Chaos event types
const CHAOS_EVENT_TYPES = {
  BREAKING_NEWS: 'breaking_news',
  UPSIDE_DOWN: 'upside_down',
  CONFETTI: 'confetti',
  SOUND: 'sound',
  COLOR_INVERT: 'color_invert',
  SHAKE: 'shake',
  RAINBOW: 'rainbow'
};

// Random chaos event messages
const breakingNewsMessages = [
  "BREAKING NEWS: Kuch bhi!",
  "ALERT: Randomness detected!",
  "NEWS FLASH: Nothing important happened!",
  "BREAKING: The sky is still blue!",
  "ALERT: You're reading this!",
  "NEWS: Water is wet!",
  "BREAKING: This is pointless!",
  "ALERT: Chaos has been triggered!"
];

// Trigger a chaos event
const triggerChaosEvent = async (userId, user = null) => {
  // Try AI-generated chaos action first
  if (isAIEnabled() && user) {
    console.log(`🤖 [CHAOS] User ${userId} ne chaos trigger kiya - AI se event generate kar rahe hain`);
    try {
      const aiChaos = await generateChaosAction(user, { userId });
      if (aiChaos && aiChaos.type) {
        console.log(`🤖 [CHAOS] ✅ AI event generate hua: ${aiChaos.type}`);
        // Map AI type to our event types or use directly
        const eventType = CHAOS_EVENT_TYPES[aiChaos.type.toUpperCase()] || aiChaos.type;
        const eventData = {
          ...aiChaos.data,
          content: aiChaos.content,
          aiGenerated: true
        };

        const event = await ChaosEvent.create({
          triggered_by_user_id: userId,
          event_type: eventType,
          event_data: eventData
        });

        await addPoints(userId, 25, 'chaos_event');

        return {
          event_id: event.event_id,
          event_type: eventType,
          event_data: eventData,
          created_at: event.created_at
        };
      } else {
        console.log(`🤖 [CHAOS] ⚠️ AI response nahi mila - default chaos use kar rahe hain`);
      }
    } catch (error) {
      console.error(`🤖 [CHAOS] ❌ Error:`, error.message);
      // Fall through to default behavior
    }
  } else {
    console.log(`🤖 [CHAOS] ℹ️ AI disabled ya user nahi hai - random chaos use kar rahe hain`);
  }

  // Default behavior (existing logic)
  const eventTypes = Object.values(CHAOS_EVENT_TYPES);
  const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

  let eventData = {};

  switch (randomType) {
    case CHAOS_EVENT_TYPES.BREAKING_NEWS:
      eventData = {
        message: breakingNewsMessages[Math.floor(Math.random() * breakingNewsMessages.length)]
      };
      break;
    case CHAOS_EVENT_TYPES.SOUND:
      eventData = {
        sound: 'random',
        volume: 0.5
      };
      break;
    case CHAOS_EVENT_TYPES.CONFETTI:
      eventData = {
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
        duration: 3000
      };
      break;
    default:
      eventData = {
        duration: 2000
      };
  }

  // Save chaos event
  const event = await ChaosEvent.create({
    triggered_by_user_id: userId,
    event_type: randomType,
    event_data: eventData
  });

  // Award points for triggering chaos
  await addPoints(userId, 25, 'chaos_event');

  return {
    event_id: event.event_id,
    event_type: randomType,
    event_data: eventData,
    created_at: event.created_at
  };
};

// Return chaos (make the original creator suffer)
const returnChaos = async (returnerUserId, originalEventId, io = null) => {
  try {
    const { User: UserModel } = require('../models');
    const originalEvent = await ChaosEvent.findByPk(originalEventId);
    
    if (!originalEvent) {
      throw new Error('Original chaos event not found');
    }

    const returner = await UserModel.findByPk(returnerUserId);
    const originalCreator = await UserModel.findByPk(originalEvent.triggered_by_user_id);

    if (!returner || !originalCreator) {
      throw new Error('User not found');
    }

    // Create return chaos event
    const returnAnimationType = getRandomChaosAnimation();
    const returnAnimationConfig = getChaosAnimationConfig(returnAnimationType);

    const returnEvent = await ChaosEvent.create({
      triggered_by_user_id: returnerUserId,
      event_type: 'return_chaos',
      event_data: {
        original_event_id: originalEventId,
        animationType: returnAnimationType,
        animationConfig: returnAnimationConfig,
        message: `${returner.name} ne ${originalCreator.name} ko return chaos diya!`
      }
    });

    // Award returner points
    await addPoints(returnerUserId, 500, 'return_chaos');

    // Broadcast return chaos specifically to original creator
    if (io) {
      // Send to original creator
      io.to(`user_${originalCreator.user_id}`).emit('chaos_returned', {
        event_id: returnEvent.event_id,
        event_data: returnEvent.event_data,
        returned_by: {
          user_id: returner.user_id,
          name: returner.name,
          profile_photo: returner.profile_photo
        },
        message: `${returner.name} ne tumhe return chaos diya! Ab tum suffer karo! 😈`
      });

      // Broadcast to all about the return
      io.emit('chaos_return_announcement', {
        returner: returner.name,
        victim: originalCreator.name,
        message: `${returner.name} ne ${originalCreator.name} ko return chaos diya!`
      });
    }

    return {
      event_id: returnEvent.event_id,
      success: true
    };
  } catch (error) {
    console.error(`💥 [CHAOS] Return error:`, error.message);
    throw error;
  }
};

// Get recent chaos events
const getRecentChaosEvents = async (limit = 10) => {
  return await ChaosEvent.findAll({
    include: [{
      model: require('../models').User,
      as: 'triggeredBy',
      attributes: ['user_id', 'name', 'profile_photo']
    }],
    order: [['created_at', 'DESC']],
    limit: limit
  });
};

module.exports = {
  triggerChaosEvent,
  returnChaos,
  getRecentChaosEvents,
  CHAOS_EVENT_TYPES
};

