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
} = require('./gamesAIService');
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
const startDebate = async (userId) => {
  const topic = await generateDebateTopic();
  return { topic };
};

const submitDebate = async (userId, topic, userArgument) => {
  const user = await User.findByPk(userId);
  const { counterArgument, winner, explanation } = await generateDebateResponse(user, topic, userArgument);
  
  const debate = await Debate.create({
    user_id: userId,
    topic,
    user_argument: userArgument,
    ai_counter_argument: counterArgument,
    winner,
    ai_explanation: explanation
  });

  // Award points
  const points = winner === 'user' ? 100 : 50;
  await addPoints(userId, points, 'debate', user);

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

const submitMemeCaption = async (userId, caption) => {
  const imageUrl = getRandomMemeImage();
  const user = await User.findByPk(userId);
  const { humor, creativity, nonsense } = await scoreMemeCaption(user, imageUrl, caption);
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
  await addPoints(userId, Math.floor(totalScore / 10), 'meme_battle', user);

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

// Roast Me
const getRoast = async (userId) => {
  const user = await User.findByPk(userId);
  const roastText = await generateRoast(user);
  
  return await Roast.create({
    user_id: userId,
    roast_text: roastText
  });
};

module.exports = {
  getTodayChallenge,
  submitBakchodiChallenge,
  startDebate,
  submitDebate,
  getRandomMemeImage,
  submitMemeCaption,
  spinWheel,
  getFuturePrediction,
  submitTapScore,
  getTapLeaderboard,
  recordRunawayButtonWin,
  getDare,
  getRoast,
  getRandomMemeImage
};

