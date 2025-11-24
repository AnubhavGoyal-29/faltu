const { UserPoints } = require('../models');
const { generateRewardSuggestion, isAIEnabled } = require('./aiDecisionEngine');

// Add points to user
const addPoints = async (userId, points, reason = '', user = null, context = {}) => {
  // Try AI reward suggestion if enabled and user provided
  if (isAIEnabled() && user && reason) {
    try {
      const aiReward = await generateRewardSuggestion(user, reason, context);
      if (aiReward && aiReward.points !== undefined) {
        points = aiReward.points;
        reason = aiReward.reason || reason;
      }
    } catch (error) {
      console.error('AI reward suggestion error:', error);
      // Continue with original points
    }
  }

  const userPoints = await UserPoints.findOne({ where: { user_id: userId } });
  
  if (!userPoints) {
    // Create if doesn't exist
    return await UserPoints.create({
      user_id: userId,
      total_points: points,
      login_streak: 0
    });
  }

  userPoints.total_points += points;
  await userPoints.save();
  
  return userPoints;
};

// Get user points
const getUserPoints = async (userId) => {
  let userPoints = await UserPoints.findOne({ where: { user_id: userId } });
  
  if (!userPoints) {
    userPoints = await UserPoints.create({
      user_id: userId,
      total_points: 0,
      login_streak: 0
    });
  }
  
  return userPoints;
};

module.exports = {
  addPoints,
  getUserPoints
};

