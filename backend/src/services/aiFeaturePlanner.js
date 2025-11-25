const { isAIEnabled, callAI } = require('./aiDecisionEngine');

// AI Feature Planner - Uses OpenAI to suggest and plan features recursively
const getFeatureSuggestions = async (currentFeatures = [], iteration = 1, maxIterations = 5) => {
  if (!isAIEnabled()) {
    console.log(`🤖 [FEATURE PLANNER] AI disabled - default features use kar rahe hain`);
    return getDefaultFeatureSuggestions();
  }

  try {
    console.log(`🤖 [FEATURE PLANNER] Iteration ${iteration}/${maxIterations} - AI se feature suggestions maang rahe hain...`);
    
    const featureList = currentFeatures.map(f => f.name).join(', ');
    
    const aiResponse = await callAI({
      user: null,
      reason: 'feature_planning',
      appState: {
        currentFeatures: featureList,
        existingCount: currentFeatures.length,
        targetCount: 50,
        iteration: iteration,
        platformType: 'faltu_entertainment_platform',
        style: 'Hinglish, chaotic, fun, engaging, pointless but addictive',
        techStack: 'Node.js, Express, React, Socket.IO, MySQL, OpenAI'
      }
    });

    if (aiResponse && aiResponse.features && Array.isArray(aiResponse.features)) {
      console.log(`🤖 [FEATURE PLANNER] ✅ AI ne ${aiResponse.features.length} features suggest kiye!`);
      
      // Merge with existing features
      const allFeatures = [...currentFeatures, ...aiResponse.features];
      
      // If we have less than 50 features and haven't reached max iterations, continue
      if (allFeatures.length < 50 && iteration < maxIterations) {
        console.log(`🤖 [FEATURE PLANNER] Abhi ${allFeatures.length} features hain, aur ${50 - allFeatures.length} chahiye`);
        return await getFeatureSuggestions(allFeatures, iteration + 1, maxIterations);
      }
      
      return allFeatures.slice(0, 50); // Return max 50
    }
  } catch (error) {
    console.error(`🤖 [FEATURE PLANNER] ❌ Error:`, error.message);
  }

  // Fallback
  const allFeatures = [...currentFeatures, ...getDefaultFeatureSuggestions()];
  return allFeatures.slice(0, 50);
};

// Get implementation plan for a feature
const getFeatureImplementationPlan = async (featureName, featureDescription) => {
  if (!isAIEnabled()) {
    return getDefaultImplementationPlan(featureName);
  }

  try {
    console.log(`🤖 [FEATURE PLANNER] Implementation plan maang rahe hain: ${featureName}`);
    
    const aiResponse = await callAI({
      user: null,
      reason: 'feature_implementation',
      appState: {
        featureName,
        featureDescription,
        techStack: 'Node.js, Express, React, Socket.IO, MySQL',
        style: 'Hinglish, chaotic, fun, engaging',
        language: 'Hinglish (Hindi + English mix)'
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

// Default feature suggestions (fallback - 50 features)
const getDefaultFeatureSuggestions = () => {
  return [
    { name: 'Wordle Game', description: 'Daily Hinglish wordle game with points', priority: 'high', category: 'game' },
    { name: 'Antakshri', description: 'Music-based antakshri game with multiple players', priority: 'high', category: 'game' },
    { name: 'Daily Challenges', description: 'AI-generated daily challenges for users', priority: 'high', category: 'engagement' },
    { name: 'User Battles', description: '1v1 battles between users (jokes, trivia, etc.)', priority: 'medium', category: 'social' },
    { name: 'Streak Rewards', description: 'Rewards for consecutive days of activity', priority: 'medium', category: 'rewards' },
    { name: 'Random Quizzes', description: 'AI-generated random quizzes on various topics', priority: 'medium', category: 'game' },
    { name: 'Voice Messages', description: 'Send voice messages in chat rooms', priority: 'low', category: 'chat' },
    { name: 'Emoji Reactions', description: 'React to messages with emojis', priority: 'low', category: 'chat' },
    { name: 'User Profiles', description: 'Detailed user profiles with achievements', priority: 'medium', category: 'social' },
    { name: 'Leaderboards', description: 'Multiple leaderboards (points, streaks, games)', priority: 'medium', category: 'social' },
    { name: 'Spin the Wheel', description: 'Spin wheel for random rewards', priority: 'medium', category: 'game' },
    { name: 'Rock Paper Scissors', description: 'Play RPS with other users', priority: 'medium', category: 'game' },
    { name: 'Trivia Battles', description: 'Real-time trivia battles', priority: 'high', category: 'game' },
    { name: 'Memory Game', description: 'Card matching memory game', priority: 'low', category: 'game' },
    { name: 'Tic Tac Toe', description: 'Play Tic Tac Toe with friends', priority: 'low', category: 'game' },
    { name: 'Guess the Number', description: 'AI generates number, users guess', priority: 'low', category: 'game' },
    { name: 'Would You Rather', description: 'AI-generated would you rather questions', priority: 'medium', category: 'social' },
    { name: 'Truth or Dare', description: 'AI-generated truth or dare challenges', priority: 'medium', category: 'social' },
    { name: 'Story Building', description: 'Collaborative story building in chat', priority: 'medium', category: 'chat' },
    { name: 'Roast Battles', description: 'AI-moderated roast battles', priority: 'medium', category: 'social' },
    { name: 'Compliment Chain', description: 'Chain of compliments between users', priority: 'low', category: 'social' },
    { name: 'Random Acts of Kindness', description: 'Suggest random acts of kindness', priority: 'low', category: 'social' },
    { name: 'Meme Generator', description: 'AI-generated memes based on user input', priority: 'medium', category: 'fun' },
    { name: 'Fortune Teller', description: 'AI fortune teller for fun predictions', priority: 'low', category: 'fun' },
    { name: 'Compatibility Test', description: 'Test compatibility between users', priority: 'low', category: 'social' },
    { name: 'Pet Simulator', description: 'Virtual pet that grows with activity', priority: 'medium', category: 'game' },
    { name: 'Virtual Garden', description: 'Grow virtual plants with points', priority: 'low', category: 'game' },
    { name: 'Achievement System', description: 'Unlock achievements for various activities', priority: 'high', category: 'rewards' },
    { name: 'Badge Collection', description: 'Collect badges for different activities', priority: 'medium', category: 'rewards' },
    { name: 'Daily Login Bonus', description: 'Increasing bonus for consecutive logins', priority: 'high', category: 'rewards' },
    { name: 'Referral System', description: 'Refer friends and get rewards', priority: 'medium', category: 'social' },
    { name: 'Gift System', description: 'Send gifts to other users', priority: 'medium', category: 'social' },
    { name: 'Friend System', description: 'Add friends and see their activity', priority: 'medium', category: 'social' },
    { name: 'Activity Feed', description: 'See what friends are doing', priority: 'medium', category: 'social' },
    { name: 'Notifications', description: 'Real-time notifications for events', priority: 'high', category: 'engagement' },
    { name: 'Push Notifications', description: 'Browser push notifications', priority: 'low', category: 'engagement' },
    { name: 'Dark Mode', description: 'Dark theme option', priority: 'low', category: 'ui' },
    { name: 'Custom Themes', description: 'User-customizable themes', priority: 'low', category: 'ui' },
    { name: 'Sound Effects', description: 'Sound effects for actions', priority: 'low', category: 'ui' },
    { name: 'Music Player', description: 'Background music player', priority: 'low', category: 'ui' },
    { name: 'Screen Recording', description: 'Record and share screen moments', priority: 'low', category: 'social' },
    { name: 'Screenshot Sharing', description: 'Share screenshots of achievements', priority: 'low', category: 'social' },
    { name: 'Profile Customization', description: 'Customize profile with colors, themes', priority: 'medium', category: 'social' },
    { name: 'Status Messages', description: 'Set custom status messages', priority: 'low', category: 'social' },
    { name: 'Online Status', description: 'Show online/offline status', priority: 'medium', category: 'social' },
    { name: 'Last Seen', description: 'Show when user was last active', priority: 'low', category: 'social' },
    { name: 'Message Search', description: 'Search messages in chat rooms', priority: 'low', category: 'chat' },
    { name: 'Message History', description: 'View message history', priority: 'medium', category: 'chat' },
    { name: 'Private Messages', description: 'Send private messages to users', priority: 'medium', category: 'chat' },
    { name: 'Group Chats', description: 'Create group chats with friends', priority: 'medium', category: 'chat' },
    { name: 'Chat Moderation', description: 'AI-powered chat moderation', priority: 'low', category: 'chat' }
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
