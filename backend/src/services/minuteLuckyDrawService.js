const { LuckyDraw, User } = require('../models');
const { addPoints } = require('./pointsService');

// Bakchod messages for lucky draw
const bakchodMessages = [
  "Kya baat hai! Koi jeet gaya!",
  "OMG! Kisi ko mil gaya!",
  "Breaking: Koi lucky nikla!",
  "Dekho dekho! Winner aaya!",
  "Chaos! Koi jeet gaya!",
  "Faltu winner mil gaya!",
  "Random winner selected!",
  "Kisi ko tag karo - wo jeet gaya!",
  "Lucky draw winner announced!",
  "Koi bakchod jeet gaya!"
];

// Get random active users (simplified - get all users)
const getRandomActiveUsers = async () => {
  // Get all users (simpler approach)
  const allUsers = await User.findAll({
    attributes: ['user_id', 'name', 'email', 'profile_photo'],
    limit: 100
  });

  return allUsers.filter(user => 
    user.name && 
    user.name !== 'Admin User' && 
    user.email !== 'admin@faltuverse.com'
  );
};

// Run minute lucky draw
const runMinuteLuckyDraw = async () => {
  try {
    const activeUsers = await getRandomActiveUsers();

    if (activeUsers.length === 0) {
      return {
        shouldRun: false,
        message: "Koi user nahi hai abhi...",
        type: 'no_users'
      };
    }

    // 70% chance to run lucky draw
    if (Math.random() > 0.7) {
      return {
        shouldRun: false,
        message: bakchodMessages[Math.floor(Math.random() * bakchodMessages.length)],
        type: 'skip'
      };
    }

    // Randomly pick a winner
    const randomIndex = Math.floor(Math.random() * activeUsers.length);
    const winner = activeUsers[randomIndex];

    // Reward points (random between 10-100 for minute draws)
    const rewardPoints = Math.floor(Math.random() * 91) + 10;

    // Create lucky draw record
    const draw = await LuckyDraw.create({
      winner_user_id: winner.user_id,
      reward_points: rewardPoints
    });

    // Add points to winner
    await addPoints(winner.user_id, rewardPoints, 'minute_lucky_draw', winner, {
      draw_id: draw.draw_id
    });

    // Random bakchod message
    const messages = [
      `${winner.name} jeet gaya! ${rewardPoints} points mil gaye! 🎉`,
      `OMG! ${winner.name} ko ${rewardPoints} points! 🔥`,
      `Breaking: ${winner.name} winner hai! ${rewardPoints} points!`,
      `${winner.name} lucky nikla! ${rewardPoints} points! 🎊`,
      `Chaos! ${winner.name} jeet gaya ${rewardPoints} points! 💥`
    ];

    return {
      shouldRun: true,
      winner: {
        user_id: winner.user_id,
        name: winner.name,
        email: winner.email,
        profile_photo: winner.profile_photo
      },
      reward_points: rewardPoints,
      message: messages[Math.floor(Math.random() * messages.length)],
      draw_id: draw.draw_id,
      timestamp: draw.timestamp
    };
  } catch (error) {
    console.error('Minute lucky draw error:', error);
    return {
      shouldRun: false,
      message: "Lucky draw error ho gaya...",
      type: 'error'
    };
  }
};

// Get recent minute draws
const getRecentMinuteDraws = async (limit = 5) => {
  return await LuckyDraw.findAll({
    include: [{
      model: User,
      as: 'winner',
      attributes: ['user_id', 'name', 'email', 'profile_photo']
    }],
    order: [['timestamp', 'DESC']],
    limit: limit
  });
};

module.exports = {
  runMinuteLuckyDraw,
  getRecentMinuteDraws
};
