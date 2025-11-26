const { UserPoints } = require('../models');
const { generateRewardSuggestion, isAIEnabled } = require('../ai/handlers/aiDecisionEngine');

// Add points to user
const addPoints = async (userId, points, reason = '', user = null, context = {}) => {
  // Try AI reward suggestion if enabled and user provided
  if (isAIEnabled() && user && reason) {
    console.log(`🤖 [REWARDS] User: ${user.name}, Reason: ${reason}, Original Points: ${points}`);
    try {
      const aiReward = await generateRewardSuggestion(user, reason, context);
      if (aiReward && aiReward.points !== undefined) {
        console.log(`🤖 [REWARDS] ✅ AI suggested: ${aiReward.points} points (was ${points})`);
        points = aiReward.points;
        reason = aiReward.reason || reason;
      } else {
        console.log(`🤖 [REWARDS] ⚠️ AI suggestion nahi mila - original points use kar rahe hain`);
      }
    } catch (error) {
      console.error(`🤖 [REWARDS] ❌ Error:`, error.message);
      // Continue with original points
    }
  } else {
    console.log(`🤖 [REWARDS] ℹ️ AI disabled ya user/reason nahi hai - original points: ${points}`);
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

