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
    console.log(`🎰 [MINUTE DRAW] ⚠️ Koi user nahi hai abhi...`);
    return {
      shouldRun: false,
      message: "Koi user nahi hai abhi...",
      type: 'no_users'
    };
    }

    // 50% chance winner, 25% prank, 25% joke
    const random = Math.random();
    
    if (random < 0.5) {
      // 50% chance: Actual winner
      console.log(`🎰 [MINUTE DRAW] 🎲 Winner select kar rahe hain... (50% chance)`);
    } else if (random < 0.75) {
      // 25% chance: Prank (no winner)
      const prankMessages = [
        "Arre yaar! Koi winner nahi nikla! 😂",
        "Sabko pagal banaya! Koi jeeta nahi! 🎭",
        "Just kidding! Koi nahi jeeta! 😜",
        "Tum sab pagal ho! Koi winner nahi hai! 🤡",
        "Gotcha! Sabko fool banaya! 🎪",
        "Haha! Koi nahi jeeta! Next time pakka! 😄"
      ];
      const msg = prankMessages[Math.floor(Math.random() * prankMessages.length)];
      console.log(`🎰 [MINUTE DRAW] 🤡 PRANK! (25% chance): ${msg}`);
      return {
        shouldRun: false,
        message: msg,
        type: 'prank'
      };
    } else {
      // 25% chance: Joke
      const jokes = [
        "Ek ladki ne apne boyfriend se kaha: 'Tumhare paas kya hai?' Boyfriend: 'Mere paas iPhone hai, car hai, ghar hai...' Ladki: 'Toh phir tumhare paas kya nahi hai?' Boyfriend: 'Tumhare jaisi girlfriend nahi hai!' 😂",
        "Teacher: 'Beta, tumhare papa ka naam kya hai?' Student: 'Papa ka naam Papa hai!' Teacher: 'Tumhare dada ka naam?' Student: 'Dada ka naam Dada hai!' Teacher: 'Tum pagal ho?' Student: 'Nahi ma'am, meri mummy pagal hai!' 🤣",
        "Ek aadmi ne apni biwi se pucha: 'Tum mujhe kyun shaadi kiya?' Biwi: 'Tumhare paas paisa tha!' Aadmi: 'Ab kya?' Biwi: 'Ab tumhare paas paisa nahi hai!' 😅"
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      console.log(`🎰 [MINUTE DRAW] 😂 JOKE! (25% chance)`);
      return {
        shouldRun: false,
        message: joke,
        type: 'joke'
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

    console.log(`🎰 [MINUTE DRAW] ✅ ${winner.name} ko ${rewardPoints} points mil gaye!`);

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
    console.error('🎰 [MINUTE DRAW] ❌ Error aaya bhai:', error.message);
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
