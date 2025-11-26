const {
  BakchodiChallenge,
  Debate,
  MemeBattle,
  WheelSpin,
  FuturePrediction,
  TapGameScore,
  RunawayButtonWin,
  Dare,
  Roast,
  GameRoom,
  GameRoomUser,
  User
} = require('../models');
const {
  generateDailyChallenge,
  scoreBakchodiSubmission,
  generateDebateTopic,
  generateDebateResponse,
  scoreMemeCaption,
  generateFuturePrediction,
  generateDare,
  generateRoast
} = require('../ai/handlers/gamesAIService');
const { addPoints } = require('./pointsService');

// Daily Bakchodi Challenge
const getTodayChallenge = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existing = await BakchodiChallenge.findOne({
    where: {
      user_id: userId,
      created_at: {
        [require('sequelize').Op.gte]: today
      }
    }
  });

  if (existing) {
    return existing;
  }

  const user = await User.findByPk(userId);
  const challengeText = await generateDailyChallenge(user);
  
  return await BakchodiChallenge.create({
    user_id: userId,
    challenge_text: challengeText,
    submission: null,
    ai_score: null,
    ai_review: null
  });
};

const submitBakchodiChallenge = async (userId, submission) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const challenge = await BakchodiChallenge.findOne({
    where: {
      user_id: userId,
      created_at: {
        [require('sequelize').Op.gte]: today
      }
    }
  });

  if (!challenge) {
    throw new Error('Challenge nahi mila');
  }

  const user = await User.findByPk(userId);
  const { score, review } = await scoreBakchodiSubmission(user, challenge.challenge_text, submission);
  
  await challenge.update({
    submission,
    ai_score: score,
    ai_review: review
  });

  // Award points
  await addPoints(userId, Math.floor(score / 10), 'bakchodi_challenge', user);

  return challenge;
};

// Debate
// Start new debate
const startDebate = async (userId) => {
  const topic = await generateDebateTopic();
  
  // Create debate with initial state
  const debate = await Debate.create({
    user_id: userId,
    topic,
    messages: [],
    status: 'active',
    winner: null
  });
  
  return { debate_id: debate.debate_id, topic };
};

// Add message to debate (user or AI)
const addDebateMessage = async (debateId, sender, message) => {
  const debate = await Debate.findByPk(debateId);
  if (!debate) {
    throw new Error('Debate nahi mila');
  }
  
  if (debate.status !== 'active') {
    throw new Error('Debate already completed');
  }
  
  const messages = debate.messages || [];
  messages.push({
    sender,
    message,
    timestamp: new Date().toISOString()
  });
  
  await debate.update({
    messages,
    updated_at: new Date()
  });
  
  return debate;
};

// Get AI response in debate
const getAIResponse = async (debateId, userId) => {
  const debate = await Debate.findByPk(debateId);
  if (!debate) {
    throw new Error('Debate nahi mila');
  }
  
  const user = await User.findByPk(userId);
  const messages = debate.messages || [];
  
  // Get last few messages for context
  const recentMessages = messages.slice(-6);
  
  // Generate AI response
  const aiResponse = await generateDebateResponse(user, debate.topic, recentMessages);
  
  // Add AI message
  await addDebateMessage(debateId, 'ai', aiResponse.message);
  
  // Check if debate should end (AI decides winner after 10+ messages)
  const updatedDebate = await Debate.findByPk(debateId);
  const totalMessages = (updatedDebate.messages || []).length;
  
  if (totalMessages >= 10 && aiResponse.shouldEnd) {
    // AI decides winner
    await updatedDebate.update({
      status: aiResponse.winner === 'user' ? 'user_won' : 'ai_won',
      winner: aiResponse.winner,
      ai_explanation: aiResponse.explanation
    });
    
    // Award points
    const points = aiResponse.winner === 'user' ? 200 : 100;
    await addPoints(userId, points, 'debate', user);
  }
  
  return updatedDebate;
};

// User forfeits debate
const forfeitDebate = async (debateId, userId) => {
  const debate = await Debate.findByPk(debateId);
  if (!debate || debate.user_id !== userId) {
    throw new Error('Debate nahi mila');
  }
  
  await debate.update({
    status: 'user_forfeit',
    winner: 'ai',
    ai_explanation: 'User ne forfeit kar diya'
  });
  
  return debate;
};

// Submit user message in debate
const submitDebateMessage = async (debateId, userId, message) => {
  // Add user message
  await addDebateMessage(debateId, 'user', message);
  
  // Get AI response
  const debate = await getAIResponse(debateId, userId);
  
  return debate;
};

// Meme Battle
const getRandomMemeImage = () => {
  const images = [
    'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Meme+1',
    'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Meme+2',
    'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Meme+3',
    'https://via.placeholder.com/400x300/FFA07A/FFFFFF?text=Meme+4',
    'https://via.placeholder.com/400x300/98D8C8/FFFFFF?text=Meme+5'
  ];
  return images[Math.floor(Math.random() * images.length)];
};

const submitMemeCaption = async (userId, caption, user = null) => {
  const imageUrl = getRandomMemeImage();
  // Only fetch user if not provided (for backward compatibility)
  const userData = user || await User.findByPk(userId);
  const { humor, creativity, nonsense } = await scoreMemeCaption(userData, imageUrl, caption);
  const totalScore = humor + creativity + nonsense;
  
  const battle = await MemeBattle.create({
    user_id: userId,
    image_url: imageUrl,
    caption,
    humor_score: humor,
    creativity_score: creativity,
    nonsense_score: nonsense,
    total_score: totalScore
  });

  // Award points
  await addPoints(userId, Math.floor(totalScore / 10), 'meme_battle', userData);

  return battle;
};

// Wheel Spin
const spinWheel = async (userId) => {
  const results = [
    { type: 'roast', content: null },
    { type: 'compliment', content: null },
    { type: 'dare', content: null },
    { type: 'mini_game', content: 'tap_game' },
    { type: 'mystery_reward', content: '50 points' }
  ];

  const result = results[Math.floor(Math.random() * results.length)];
  
  // Generate content if needed
  if (result.type === 'roast' || result.type === 'compliment' || result.type === 'dare') {
    const user = await User.findByPk(userId);
    if (result.type === 'roast') {
      result.content = await generateRoast(user);
    } else if (result.type === 'compliment') {
      result.content = 'Tum bahut achhe ho! Keep it up!';
    } else if (result.type === 'dare') {
      result.content = await generateDare(user);
    }
  }

  await WheelSpin.create({
    user_id: userId,
    result_type: result.type,
    result_content: result.content
  });

  // Award points for mystery reward
  if (result.type === 'mystery_reward') {
    const user = await User.findByPk(userId);
    await addPoints(userId, 50, 'wheel_spin', user);
  }

  return result;
};

// Future Prediction
const getFuturePrediction = async (userId, name, mood, favSnack) => {
  const user = await User.findByPk(userId);
  const prediction = await generateFuturePrediction(user, name, mood, favSnack);
  
  return await FuturePrediction.create({
    user_id: userId,
    user_name: name,
    mood,
    fav_snack: favSnack,
    prediction
  });
};

// Tap Game
const submitTapScore = async (userId, taps) => {
  const user = await User.findByPk(userId);
  const score = await TapGameScore.create({
    user_id: userId,
    taps
  });

  // Award points
  await addPoints(userId, Math.floor(taps / 10), 'tap_game', user);

  return score;
};

const getTapLeaderboard = async (limit = 10) => {
  return await TapGameScore.findAll({
    include: [{ model: User, as: 'user', attributes: ['user_id', 'name'] }],
    order: [['taps', 'DESC']],
    limit
  });
};

// Runaway Button
const recordRunawayButtonWin = async (userId, attempts) => {
  const user = await User.findByPk(userId);
  const win = await RunawayButtonWin.create({
    user_id: userId,
    attempts,
    points_earned: 50
  });

  await addPoints(userId, 50, 'runaway_button', user);

  return win;
};

// Dare Machine
const getDare = async (userId) => {
  const user = await User.findByPk(userId);
  const dareText = await generateDare(user);
  
  return await Dare.create({
    user_id: userId,
    dare_text: dareText
  });
};

// Roast Me - Always use AI
const getRoast = async (userId) => {
  const user = await User.findByPk(userId);
  
  // Always use AI for roasts
  const roastText = await generateRoast(user);
  
  if (!roastText) {
    throw new Error('Roast generate nahi hui');
  }
  
  return await Roast.create({
    user_id: userId,
    roast_text: roastText
  });
};

module.exports = {
  getTodayChallenge,
  submitBakchodiChallenge,
  startDebate,
  submitDebateMessage,
  addDebateMessage,
  getAIResponse,
  forfeitDebate,
  getRandomMemeImage,
  submitMemeCaption,
  spinWheel,
  getFuturePrediction,
  submitTapScore,
  getTapLeaderboard,
  recordRunawayButtonWin,
  getDare,
  getRoast
};

