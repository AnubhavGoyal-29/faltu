const { getUserPoints } = require('../services/pointsService');
const { User } = require('../models');

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    const userPoints = await getUserPoints(user.user_id);

    res.json({
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        profile_photo: user.profile_photo,
        created_at: user.created_at
      },
      points: {
        total_points: userPoints.total_points,
        login_streak: userPoints.login_streak
      }
    });
  } catch (error) {
    console.error('👤 [USER] Get profile error:', error);
    res.status(500).json({ error: 'Profile fetch nahi hua bhai! Try again.' });
  }
};

module.exports = {
  getProfile
};

