/**
 * AI Decision Engine V2
 * 
 * Enhanced AI decision engine that uses the new AI Engine architecture
 * while maintaining backward compatibility with the existing interface.
 * 
 * @version 2.0
 */

const { getAIEngine } = require('../engine/AIEngine');
const { getAnalyticsTracker } = require('../improvement/AnalyticsTracker');

const aiEngine = getAIEngine();
const analytics = getAnalyticsTracker();

/**
 * Check if AI is enabled
 */
const isAIEnabled = () => {
  return aiEngine.isEnabled();
};

/**
 * Call AI with structured context (backward compatible)
 */
const callAI = async (context) => {
  const startTime = Date.now();
  
  try {
    // Use new AI engine
    const response = await aiEngine.process(context);
    
    // Track analytics
    const responseTime = Date.now() - startTime;
    analytics.trackAICall(
      context.promptId || context.reason,
      context.reason,
      context,
      response !== null,
      responseTime
    );
    
    return response;
  } catch (error) {
    const responseTime = Date.now() - startTime;
    analytics.trackAICall(
      context.promptId || context.reason,
      context.reason,
      context,
      false,
      responseTime,
      error
    );
    
    return null;
  }
};

/**
 * Generate welcome message for login
 */
const generateWelcomeMessage = async (user) => {
  console.log(`🤖 [WELCOME] User login: ${user.name}`);
  
  const aiResponse = await callAI({
    user,
    reason: 'login',
    appState: { action: 'login' }
  });

  if (aiResponse && aiResponse.message) {
    console.log(`🤖 [WELCOME] ✅ AI message generated`);
    return aiResponse.message;
  }

  console.log(`🤖 [WELCOME] ⚠️ Using fallback`);
  return `Arre ${user.name}! FaltuVerse mein welcome bhai! Kuch faltu karte hain? 🎉`;
};

/**
 * Generate idle engagement
 */
const generateIdleEngagement = async (user, appState = {}) {
  const aiResponse = await callAI({
    user,
    reason: 'idle',
    appState: { ...appState, idle: true }
  });

  if (aiResponse) {
    return {
      type: aiResponse.type || 'popup',
      content: aiResponse.content || aiResponse.message || 'Chal kuch faltu karte hain!',
      action: aiResponse.action || null
    };
  }

  return {
    type: 'popup',
    content: 'Bhai kidhar so gaya? Chal kuch faltu karte hain!'
  };
};

/**
 * Generate chaos action
 */
const generateChaosAction = async (user, currentState = {}) {
  const aiResponse = await callAI({
    user,
    reason: 'chaos',
    appState: currentState
  });

  if (aiResponse && aiResponse.type) {
    return {
      type: aiResponse.type,
      content: aiResponse.content || aiResponse.message,
      data: aiResponse.data || {}
    };
  }

  return null;
};

/**
 * Generate chat response
 */
const generateChatResponse = async (user, chatContext, recentMessages = []) {
  const aiResponse = await callAI({
    user,
    reason: 'chat',
    chatContext: JSON.stringify({
      room: chatContext.roomName,
      recentMessages: recentMessages.slice(-5).map(m => ({
        user: m.user?.name,
        message: m.message
      }))
    }),
    appState: { 
      action: 'chat',
      roomName: chatContext.roomName,
      recentMessages: recentMessages.slice(-5).map(m => `${m.user?.name}: ${m.message}`).join('\n'),
      messageCount: recentMessages.length
    }
  });

  if (aiResponse && aiResponse.message) {
    return {
      message: aiResponse.message,
      type: aiResponse.type || 'message',
      shouldSend: aiResponse.shouldSend !== false
    };
  }

  return null;
};

/**
 * Generate reward suggestion
 */
const generateRewardSuggestion = async (user, action, context = {}) {
  const aiResponse = await callAI({
    user,
    reason: 'rewards',
    appState: { action, ...context }
  });

  if (aiResponse && aiResponse.points !== undefined) {
    return {
      points: aiResponse.points,
      reason: aiResponse.reason || action,
      message: aiResponse.message || null
    };
  }

  return null;
};

/**
 * Generate cron event suggestion
 */
const generateCronEventSuggestion = async (appState = {}) {
  const aiResponse = await callAI({
    user: null,
    reason: 'cron',
    appState: { ...appState, time: new Date().toISOString() }
  });

  if (aiResponse && aiResponse.shouldHappen) {
    return {
      shouldHappen: true,
      eventType: aiResponse.eventType,
      content: aiResponse.content || aiResponse.message,
      data: aiResponse.data || {}
    };
  }

  return { shouldHappen: false };
};

/**
 * Generate feature suggestions
 */
const generateFeatureSuggestions = async (currentFeatures = [], targetCount = 50) {
  const aiResponse = await callAI({
    user: null,
    reason: 'feature_planning',
    appState: {
      currentFeatures: currentFeatures.map(f => f.name).join(', '),
      existingCount: currentFeatures.length,
      targetCount: targetCount,
      platformType: 'faltu_entertainment',
      style: 'Hinglish, chaotic, fun, engaging'
    }
  });

  if (aiResponse && aiResponse.features && Array.isArray(aiResponse.features)) {
    return aiResponse.features;
  }

  return [];
};

/**
 * Get AI Engine analytics
 */
const getAIAnalytics = () => {
  return {
    engine: aiEngine.getAnalytics(),
    tracker: analytics.getMetrics()
  };
};

module.exports = {
  isAIEnabled,
  callAI,
  generateWelcomeMessage,
  generateIdleEngagement,
  generateChaosAction,
  generateChatResponse,
  generateRewardSuggestion,
  generateCronEventSuggestion,
  generateFeatureSuggestions,
  getAIAnalytics
};

