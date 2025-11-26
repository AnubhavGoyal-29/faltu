const { LuckyDraw, User, UserPoints } = require('../models');
const { addPoints } = require('./pointsService');

// Get active users (users who have logged in within last 24 hours)
const getActiveUsers = async () => {
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  const activeUserPoints = await UserPoints.findAll({
    where: {
      last_login: {
        [require('sequelize').Op.gte]: oneDayAgo
      }
    },
    include: [{
      model: User,
      as: 'user',
      attributes: ['user_id', 'name', 'email']
    }]
  });

  return activeUserPoints.map(up => up.user).filter(Boolean);
};

// Run hourly lucky draw
const runLuckyDraw = async () => {
  const activeUsers = await getActiveUsers();

  if (activeUsers.length === 0) {
    console.log('No active users for lucky draw');
    return null;
  }

  // Randomly pick a winner
  const randomIndex = Math.floor(Math.random() * activeUsers.length);
  const winner = activeUsers[randomIndex];

  // Reward points (random between 50-500)
  const rewardPoints = Math.floor(Math.random() * 451) + 50;

  // Create lucky draw record
  const draw = await LuckyDraw.create({
    winner_user_id: winner.user_id,
    reward_points: rewardPoints
  });

  // Add points to winner
  await addPoints(winner.user_id, rewardPoints, 'lucky_draw');

  return {
    draw,
    winner: {
      user_id: winner.user_id,
      name: winner.name,
      email: winner.email
    },
    reward_points: rewardPoints
  };
};

// Get last lucky draw
const getLastLuckyDraw = async () => {
  const draw = await LuckyDraw.findOne({
    include: [{
      model: User,
      as: 'winner',
      attributes: ['user_id', 'name', 'email', 'profile_photo']
    }],
    order: [['timestamp', 'DESC']]
  });

  return draw;
};

module.exports = {
  runLuckyDraw,
  getLastLuckyDraw,
  getActiveUsers
};

