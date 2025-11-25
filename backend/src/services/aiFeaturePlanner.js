const { isAIEnabled, callAI } = require('./aiDecisionEngine');

// AI Feature Planner - Uses OpenAI to suggest and plan features
const getFeatureSuggestions = async (currentFeatures = []) => {
  if (!isAIEnabled()) {
    return getDefaultFeatureSuggestions();
  }

  try {
    console.log(`🤖 [FEATURE PLANNER] AI se feature suggestions maang rahe hain...`);
    
    const aiResponse = await callAI({
      user: null,
      reason: 'feature_planning',
      appState: {
        currentFeatures: currentFeatures,
        platformType: 'faltu_entertainment',
        targetFeatures: 50,
        existingFeatures: currentFeatures.length
      }
    });

    if (aiResponse && aiResponse.features) {
      console.log(`🤖 [FEATURE PLANNER] ✅ AI ne ${aiResponse.features.length} features suggest kiye!`);
      return aiResponse.features;
    }
  } catch (error) {
    console.error(`🤖 [FEATURE PLANNER] ❌ Error:`, error.message);
  }

  return getDefaultFeatureSuggestions();
};

// Get implementation plan for a feature
const getFeatureImplementationPlan = async (featureName, featureDescription) => {
  if (!isAIEnabled()) {
    return getDefaultImplementationPlan(featureName);
  }

  try {
    console.log(`🤖 [FEATURE PLANNER] Feature implementation plan maang rahe hain: ${featureName}`);
    
    const aiResponse = await callAI({
      user: null,
      reason: 'feature_implementation',
      appState: {
        featureName,
        featureDescription,
        techStack: 'Node.js, Express, React, Socket.IO, MySQL',
        style: 'Hinglish, chaotic, fun, engaging'
      }
    });

    if (aiResponse && aiResponse.plan) {
      console.log(`🤖 [FEATURE PLANNER] ✅ Implementation plan mil gaya!`);
      return aiResponse.plan;
    }
  } catch (error) {
    console.error(`🤖 [FEATURE PLANNER] ❌ Error:`, error.message);
  }

  return getDefaultImplementationPlan(featureName);
};

// Default feature suggestions (fallback)
const getDefaultFeatureSuggestions = () => {
  return [
    {
      name: 'Wordle Game',
      description: 'Daily Hinglish wordle game with points',
      priority: 'high',
      category: 'game'
    },
    {
      name: 'Antakshri',
      description: 'Music-based antakshri game with multiple players',
      priority: 'high',
      category: 'game'
    },
    {
      name: 'Daily Challenges',
      description: 'AI-generated daily challenges for users',
      priority: 'high',
      category: 'engagement'
    },
    {
      name: 'User Battles',
      description: '1v1 battles between users (jokes, trivia, etc.)',
      priority: 'medium',
      category: 'social'
    },
    {
      name: 'Streak Rewards',
      description: 'Rewards for consecutive days of activity',
      priority: 'medium',
      category: 'rewards'
    },
    {
      name: 'Random Quizzes',
      description: 'AI-generated random quizzes on various topics',
      priority: 'medium',
      category: 'game'
    },
    {
      name: 'Voice Messages',
      description: 'Send voice messages in chat rooms',
      priority: 'low',
      category: 'chat'
    },
    {
      name: 'Emoji Reactions',
      description: 'React to messages with emojis',
      priority: 'low',
      category: 'chat'
    },
    {
      name: 'User Profiles',
      description: 'Detailed user profiles with achievements',
      priority: 'medium',
      category: 'social'
    },
    {
      name: 'Leaderboards',
      description: 'Multiple leaderboards (points, streaks, games)',
      priority: 'medium',
      category: 'social'
    }
  ];
};

const getDefaultImplementationPlan = (featureName) => {
  return {
    backend: ['Create service file', 'Add routes', 'Add database models'],
    frontend: ['Create component', 'Add to navigation', 'Add styling'],
    database: ['Create migration', 'Add indexes'],
    socket: ['Add socket events if needed']
  };
};

module.exports = {
  getFeatureSuggestions,
  getFeatureImplementationPlan
};

