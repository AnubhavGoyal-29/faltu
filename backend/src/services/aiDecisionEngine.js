const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Check if AI is enabled
const isAIEnabled = () => {
  return !!process.env.OPENAI_API_KEY;
};

// Call AI with structured context
const callAI = async (context) => {
  if (!isAIEnabled()) {
    return null;
  }

  try {
    const systemPrompt = `You are a chaotic, fun, and entertaining AI assistant for FaltuVerse - a "pure entertainment for no reason" app. 
Your role is to generate funny, pointless, but engaging content. Always respond in valid JSON format.

Context:
- User: ${context.user?.name || 'Unknown'}
- Reason: ${context.reason}
- App State: ${JSON.stringify(context.appState || {})}
- Chat Context: ${context.chatContext || 'N/A'}

Generate appropriate responses based on the reason:
- login: Welcome message or popup
- idle: Popup, joke, challenge, roast, or chaos event suggestion
- chat: Funny reply, joke, or conversation starter
- chaos: Structured chaos action (type, content)
- cron: Event suggestion (should happen? what?)
- rewards: Point suggestion (amount, reason)

Always respond with valid JSON only.`;

    const userPrompt = `Generate a response for reason: ${context.reason}. 
User context: ${JSON.stringify(context.user || {})}
${context.chatContext ? `Chat context: ${context.chatContext}` : ''}
${context.appState ? `App state: ${JSON.stringify(context.appState)}` : ''}

Respond ONLY with valid JSON, no markdown, no explanations.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.9,
      max_tokens: 300,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('AI call error:', error);
    return null;
  }
};

// Generate welcome message for login
const generateWelcomeMessage = async (user) => {
  const aiResponse = await callAI({
    user,
    reason: 'login',
    appState: { action: 'login' }
  });

  if (aiResponse && aiResponse.message) {
    return aiResponse.message;
  }

  // Fallback
  return `Welcome to FaltuVerse, ${user.name}! Ready for some pointless fun? 🎉`;
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

  // Fallback
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

module.exports = {
  isAIEnabled,
  callAI,
  generateWelcomeMessage,
  generateIdleEngagement,
  generateChaosAction,
  generateChatResponse,
  generateRewardSuggestion,
  generateCronEventSuggestion
};

