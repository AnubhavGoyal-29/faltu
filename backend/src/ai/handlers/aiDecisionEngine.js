const OpenAI = require('openai');
const { getFormattedPrompt } = require('../prompt-loaders/promptLoader');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Map reason types to prompt files
const REASON_TO_PROMPT = {
  'login': 'engagement.welcome',
  'idle': 'engagement.idle',
  'chat': 'chat.conversation',
  'chaos': 'ui.chaos',
  'cron': 'system.cron',
  'rewards': 'rewards.points',
  'joke': 'games.joke',
  'roast': 'games.roast',
  'feature_planning': 'system.core', // TODO: Create specific prompt
  'feature_implementation': 'system.core', // TODO: Create specific prompt
  'games': 'games.bakchodi' // Default for game-related
};

// Check if AI is enabled
const isAIEnabled = () => {
  const enabled = !!process.env.OPENAI_API_KEY;
  console.log(`🤖 [AI CHECK] AI Enabled: ${enabled ? 'Haan bhai! ✅' : 'Nahi bhai, key nahi hai ❌'}`);
  if (enabled) {
    console.log(`🤖 [AI CHECK] API Key length: ${process.env.OPENAI_API_KEY?.length || 0} characters`);
  }
  return enabled;
};

// Call AI with structured context
const callAI = async (context) => {
  console.log(`🤖 [AI CALL] Reason: ${context.reason}, User: ${context.user?.name || 'N/A'}`);
  
  if (!isAIEnabled()) {
    console.log(`🤖 [AI CALL] ❌ AI disabled - fallback use hoga`);
    return null;
  }

  console.log(`🤖 [AI CALL] ✅ AI enabled - OpenAI ko call kar rahe hain...`);
  
  try {
    // Determine which prompt to use
    const promptPath = REASON_TO_PROMPT[context.reason] || 'system.core';
    
    // Load system prompt (core)
    const systemPromptData = getFormattedPrompt('system.core', {
      user: context.user?.name || 'Unknown',
      reason: context.reason,
      appState: JSON.stringify(context.appState || {}),
      chatContext: context.chatContext || 'N/A'
    });

    // Load specific prompt for this reason
    const specificPromptData = getFormattedPrompt(promptPath, {
      user: context.user?.name || 'Unknown',
      userName: context.user?.name || 'Unknown',
      userEmail: context.user?.email || '',
      userPoints: context.user?.points || 0,
      loginStreak: context.appState?.login_streak || 0,
      currentTime: new Date().toISOString(),
      reason: context.reason,
      appState: JSON.stringify(context.appState || {}),
      chatContext: context.chatContext || '',
      roomName: context.appState?.roomName || '',
      recentMessages: context.appState?.recentMessages || '',
      messageCount: context.appState?.messageCount || context.appState?.message_count || 0,
      activityLevel: context.appState?.activityLevel || 'medium',
      idleDuration: context.appState?.idleDuration || 0,
      currentPage: context.appState?.currentPage || '',
      lastActivity: context.appState?.lastActivity || '',
      action: context.appState?.action || '',
      currentPoints: context.user?.points || 0,
      challenge: context.appState?.challenge || '',
      submission: context.appState?.submission || '',
      caption: context.appState?.caption || '',
      topic: context.appState?.topic || '',
      userArgument: context.appState?.user_argument || '',
      user_argument: context.appState?.user_argument || '',
      recent_messages: context.appState?.recent_messages || '',
      should_end: context.appState?.should_end || false,
      name: context.appState?.name || '',
      mood: context.appState?.mood || '',
      favSnack: context.appState?.fav_snack || '',
      mode: context.appState?.mode || context.appState?.action || 'default',
      date: new Date().toISOString().split('T')[0],
      recentJokes: context.appState?.recentJokes || 'none',
      preference: context.appState?.preference || '',
      eventType: context.appState?.eventType || '',
      userActivity: context.appState?.userActivity || '',
      recentEvents: context.appState?.recentEvents || '',
      imageUrl: context.appState?.imageUrl || '',
      currentState: JSON.stringify(context.appState || {}),
      originalRequest: context.reason,
      errorType: '',
      fallbackReason: ''
    }, {
      temperature: context.temperature,
      maxTokens: context.maxTokens
    });

    // Check if prompts loaded successfully
    if (!systemPromptData) {
      console.error(`🤖 [AI CALL] ❌ System prompt (system.core) not found!`);
      return null;
    }

    // Use specific prompt if available, otherwise use system prompt
    const userPrompt = specificPromptData ? specificPromptData.prompt : systemPromptData.prompt;
    const systemPrompt = systemPromptData.prompt;
    const params = specificPromptData?.params || systemPromptData?.params || {};

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: params.temperature || 0.9,
      max_tokens: params.maxTokens || 300,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    console.log(`🤖 [AI CALL] ✅ Response mil gaya! Length: ${response.length} chars`);
    const parsed = JSON.parse(response);
    console.log(`🤖 [AI CALL] ✅ Parsed JSON:`, JSON.stringify(parsed).substring(0, 100));
    return parsed;
  } catch (error) {
    console.error(`🤖 [AI CALL] ❌ Error aaya bhai:`, error.message);
    console.error(`🤖 [AI CALL] Full error:`, error);
    return null;
  }
};

// Generate welcome message for login
const generateWelcomeMessage = async (user) => {
  console.log(`🤖 [WELCOME] User login: ${user.name}`);
  const aiResponse = await callAI({
    user,
    reason: 'login',
    appState: { action: 'login' }
  });

  if (aiResponse && aiResponse.message) {
    console.log(`🤖 [WELCOME] ✅ AI message mil gaya: ${aiResponse.message.substring(0, 50)}...`);
    return aiResponse.message;
  }

  console.log(`🤖 [WELCOME] ⚠️ AI response nahi mila - fallback use kar rahe hain`);
  return `Arre ${user.name}! FaltuVerse mein welcome bhai! Kuch faltu karte hain? 🎉`;
};

// Generate idle engagement
const generateIdleEngagement = async (user, appState = {}) => {
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

  console.log(`🤖 [IDLE] ⚠️ AI response nahi mila - fallback use kar rahe hain`);
  return {
    type: 'popup',
    content: 'Bhai kidhar so gaya? Chal kuch faltu karte hain!'
  };
};

// Generate chaos action
const generateChaosAction = async (user, currentState = {}) => {
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

// Generate chat response
const generateChatResponse = async (user, chatContext, recentMessages = []) => {
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
    appState: { action: 'chat' }
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

// Generate reward suggestion
const generateRewardSuggestion = async (user, action, context = {}) => {
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

// Generate cron event suggestion
const generateCronEventSuggestion = async (appState = {}) => {
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

// Generate feature suggestions (for recursive feature planning)
const generateFeatureSuggestions = async (currentFeatures = [], targetCount = 50) => {
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

module.exports = {
  isAIEnabled,
  callAI,
  generateWelcomeMessage,
  generateIdleEngagement,
  generateChaosAction,
  generateChatResponse,
  generateRewardSuggestion,
  generateCronEventSuggestion,
  generateFeatureSuggestions
};

