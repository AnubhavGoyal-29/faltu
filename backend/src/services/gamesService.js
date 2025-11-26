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

// NEW 30 GAMES SERVICE FUNCTIONS

// Bakwaas Battle - AI judges nonsense battles
const startBakwaasBattle = async (userId) => {
  const user = await User.findByPk(userId);
  return {
    battle_id: Date.now(),
    round: 1,
    total_rounds: 3,
    user_score: 0,
    ai_score: 0
  };
};

const submitBakwaas = async (userId, battleId, bakwaas) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'bakwaas_battle',
        action: 'judge_bakwaas',
        bakwaas_text: bakwaas
      }
    });
    
    const score = aiResponse?.score || Math.floor(Math.random() * 50) + 30;
    const points = Math.floor(score * 0.15);
    await addPoints(userId, points, 'bakwaas_battle', user);
    
    return {
      battle_id: battleId,
      user_bakwaas: bakwaas,
      score,
      ai_response: aiResponse?.response || 'Mast bakwaas hai bhai!',
      points_awarded: points
    };
  } catch (error) {
    console.error('🎮 [GAMES] Bakwaas Battle error:', error);
    const score = Math.floor(Math.random() * 50) + 30;
    const points = Math.floor(score * 0.15);
    await addPoints(userId, points, 'bakwaas_battle', user);
    return { battle_id: battleId, score, points_awarded: points };
  }
};

// Emoji Mashup - Create emoji combinations, AI rates creativity
const getEmojiMashup = async (userId) => {
  const emojiCount = Math.floor(Math.random() * 6) + 3; // 3-8 emojis
  return {
    mashup_id: Date.now(),
    emoji_count: emojiCount,
    challenge: `Create a story using ${emojiCount} emojis!`
  };
};

const submitEmojiMashup = async (userId, mashupId, emojiStory) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'emoji_mashup',
        action: 'rate_emoji_story',
        emoji_story: emojiStory
      }
    });
    
    const creativity = aiResponse?.creativity_score || Math.floor(Math.random() * 40) + 50;
    const points = Math.floor(creativity * 0.2);
    await addPoints(userId, points, 'emoji_mashup', user);
    
    return {
      mashup_id: mashupId,
      emoji_story: emojiStory,
      creativity_score: creativity,
      ai_review: aiResponse?.review || 'Mast emojis use kiye!',
      points_awarded: points
    };
  } catch (error) {
    console.error('🎮 [GAMES] Emoji Mashup error:', error);
    const creativity = Math.floor(Math.random() * 40) + 50;
    const points = Math.floor(creativity * 0.2);
    await addPoints(userId, points, 'emoji_mashup', user);
    return { mashup_id: mashupId, creativity_score: creativity, points_awarded: points };
  }
};

// Mood Swinger - Rapid mood switching challenge
const startMoodSwinger = async (userId) => {
  const moods = ['happy', 'sad', 'angry', 'confused', 'excited', 'chill'];
  const targetMoods = [];
  for (let i = 0; i < 5; i++) {
    targetMoods.push(moods[Math.floor(Math.random() * moods.length)]);
  }
  
  return {
    session_id: Date.now(),
    target_moods: targetMoods,
    current_round: 0,
    time_limit: 20000
  };
};

const submitMoodSwitch = async (userId, sessionId, mood) => {
  const user = await User.findByPk(userId);
  const points = 2;
  await addPoints(userId, points, 'mood_swinger', user);
  return { success: true, mood, points_awarded: points };
};

// Poetry Chaos - AI judges nonsense poetry
const getPoetryChallenge = async (userId) => {
  const styles = ['haiku', 'limerick', 'free', 'nonsense'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  return {
    poetry_id: Date.now(),
    style,
    challenge: `Write a ${style} style poem!`
  };
};

const submitPoetry = async (userId, poetryId, poem) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'poetry_chaos',
        action: 'judge_poetry',
        poem_text: poem
      }
    });
    
    const score = aiResponse?.score || Math.floor(Math.random() * 50) + 40;
    const points = Math.floor(score * 0.22);
    await addPoints(userId, points, 'poetry_chaos', user);
    
    return {
      poetry_id: poetryId,
      poem,
      score,
      ai_review: aiResponse?.review || 'Mast poetry hai!',
      points_awarded: points
    };
  } catch (error) {
    console.error('🎮 [GAMES] Poetry Chaos error:', error);
    const score = Math.floor(Math.random() * 50) + 40;
    const points = Math.floor(score * 0.22);
    await addPoints(userId, points, 'poetry_chaos', user);
    return { poetry_id: poetryId, score, points_awarded: points };
  }
};

// Jhand Meter - AI measures jhand level
const getJhandMeter = async (userId) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'jhand_meter',
        action: 'measure_jhand'
      }
    });
    
    const jhandScore = aiResponse?.jhand_score || Math.floor(Math.random() * 100);
    const points = Math.floor(jhandScore * 0.1);
    await addPoints(userId, points, 'jhand_meter', user);
    
    return {
      meter_id: Date.now(),
      jhand_score: jhandScore,
      jhand_level: jhandScore < 30 ? 'low' : jhandScore < 60 ? 'medium' : jhandScore < 85 ? 'high' : 'extreme',
      message: aiResponse?.message || 'Tumhara jhand level check ho gaya!',
      points_awarded: points
    };
  } catch (error) {
    console.error('🎮 [GAMES] Jhand Meter error:', error);
    const jhandScore = Math.floor(Math.random() * 100);
    const points = Math.floor(jhandScore * 0.1);
    await addPoints(userId, points, 'jhand_meter', user);
    return { meter_id: Date.now(), jhand_score: jhandScore, points_awarded: points };
  }
};

// Desi Speed Rush - Fast tapping with desi theme
const submitDesiSpeedRush = async (userId, taps) => {
  const user = await User.findByPk(userId);
  const basePoints = Math.floor(taps * 0.06);
  const bonus = taps >= 250 ? Math.floor(basePoints * 0.8) : 0;
  const totalPoints = basePoints + bonus;
  await addPoints(userId, totalPoints, 'desi_speed_rush', user);
  return { taps, points_awarded: totalPoints, bonus };
};

// Cringe Level - AI measures cringe level
const getCringeLevel = async (userId, cringeText) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'cringe_level',
        action: 'measure_cringe',
        cringe_text: cringeText
      }
    });
    
    const cringeScore = aiResponse?.cringe_score || Math.floor(Math.random() * 100);
    const basePoints = Math.floor(cringeScore * 0.13);
    const bonus = cringeScore >= 85 ? 12 : 0;
    const totalPoints = basePoints + bonus;
    await addPoints(userId, totalPoints, 'cringe_level', user);
    
    return {
      level_id: Date.now(),
      cringe_score: cringeScore,
      cringe_level: cringeScore < 50 ? 'low' : cringeScore < 70 ? 'medium' : cringeScore < 85 ? 'high' : 'extreme',
      message: aiResponse?.message || 'Tumhara cringe level check ho gaya!',
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Cringe Level error:', error);
    const cringeScore = Math.floor(Math.random() * 100);
    const points = Math.floor(cringeScore * 0.13);
    await addPoints(userId, points, 'cringe_level', user);
    return { level_id: Date.now(), cringe_score: cringeScore, points_awarded: points };
  }
};

// Vibe Detector - AI detects your vibe
const getVibeDetector = async (userId, vibeInput) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'vibe_detector',
        action: 'detect_vibe',
        vibe_input: vibeInput
      }
    });
    
    const detectedVibe = aiResponse?.vibe || aiResponse?.detected_vibe || 'chill';
    const accuracy = aiResponse?.accuracy || Math.random() * 0.3 + 0.7;
    const basePoints = 3;
    const bonus = accuracy >= 0.75 ? 6 : 0;
    const totalPoints = basePoints + bonus;
    await addPoints(userId, totalPoints, 'vibe_detector', user);
    
    return {
      detector_id: Date.now(),
      detected_vibe: detectedVibe,
      accuracy,
      message: aiResponse?.message || 'Tumhara vibe detect ho gaya!',
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Vibe Detector error:', error);
    const points = 3;
    await addPoints(userId, points, 'vibe_detector', user);
    return { detector_id: Date.now(), detected_vibe: 'chill', points_awarded: points };
  }
};

// Useless Fact - AI generates useless facts
const getUselessFact = async (userId) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'useless_fact',
        action: 'generate_fact'
      }
    });
    
    const fact = aiResponse?.fact || aiResponse?.useless_fact || 'Bananas are berries, but strawberries are not!';
    const points = 5;
    await addPoints(userId, points, 'useless_fact', user);
    
    return {
      fact_id: Date.now(),
      fact,
      uselessness_score: aiResponse?.uselessness_score || Math.floor(Math.random() * 100),
      points_awarded: points
    };
  } catch (error) {
    console.error('🎮 [GAMES] Useless Fact error:', error);
    const points = 5;
    await addPoints(userId, points, 'useless_fact', user);
    return { fact_id: Date.now(), fact: 'Bananas are berries, but strawberries are not!', points_awarded: points };
  }
};

// Bomb Timer - Pressure timing game
const startBombTimer = async (userId) => {
  const minTime = 3000;
  const maxTime = 25000;
  const bombTime = Math.floor(Math.random() * (maxTime - minTime)) + minTime;
  
  return {
    bomb_id: Date.now(),
    bomb_time: bombTime,
    started_at: Date.now()
  };
};

const defuseBomb = async (userId, bombId, defuseTime) => {
  const user = await User.findByPk(userId);
  // Calculate points based on timing accuracy
  const points = 2;
  await addPoints(userId, points, 'bomb_timer', user);
  return { success: true, defuse_time: defuseTime, points_awarded: points };
};

// Meme Master - Advanced meme scoring
const submitMemeMaster = async (userId, memeCaption) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'meme_master',
        action: 'score_meme',
        meme_caption: memeCaption
      }
    });
    
    const memeScore = aiResponse?.meme_score || Math.floor(Math.random() * 100);
    const basePoints = Math.floor(memeScore * 0.28);
    let bonus = 0;
    if (memeScore >= 95) bonus = 35;
    else if (memeScore >= 85) bonus = 25;
    const totalPoints = basePoints + bonus;
    await addPoints(userId, totalPoints, 'meme_master', user);
    
    return {
      meme_id: Date.now(),
      meme_caption: memeCaption,
      meme_score: memeScore,
      ai_review: aiResponse?.review || 'Mast meme hai!',
      points_awarded: totalPoints,
      viral: memeScore >= 85,
      legendary: memeScore >= 95
    };
  } catch (error) {
    console.error('🎮 [GAMES] Meme Master error:', error);
    const memeScore = Math.floor(Math.random() * 100);
    const points = Math.floor(memeScore * 0.28);
    await addPoints(userId, points, 'meme_master', user);
    return { meme_id: Date.now(), meme_score: memeScore, points_awarded: points };
  }
};

  const points = resultType === 'nothing' ? 0 : 
    Math.floor(Math.random() * (config.pointsRange[1] - config.pointsRange[0] + 1)) + config.pointsRange[0];
  
  if (points > 0) {
    const user = await User.findByPk(userId);
    await addPoints(userId, points, 'lucky_chaos', user);
  }
  
  return {
    spin_id: Date.now(),
    result_type: resultType,
    points_awarded: points
  };
};

// Reflex Master - Enhanced reaction test
const startReflexMaster = async (userId) => {
  return {
    session_id: Date.now(),
    rounds: 7,
    current_round: 0,
    reactions: []
  };
};

const submitReflex = async (userId, sessionId, reactionTime) => {
  const user = await User.findByPk(userId);
  const points = reactionTime <= 150 ? 10 : 1;
  await addPoints(userId, points, 'reflex_master', user);
  return { reaction_time: reactionTime, points_awarded: points, perfect: reactionTime <= 150 };
};

// Nonsense Factory - Generate nonsense content
const getNonsensePrompt = async (userId) => {
  const types = ['word', 'sentence', 'story', 'poem', 'quote'];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    prompt_id: Date.now(),
    nonsense_type: type,
    challenge: `Create a ${type} that makes absolutely no sense!`
  };
};

const submitNonsense = async (userId, promptId, nonsense) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'nonsense_factory',
        action: 'judge_nonsense',
        nonsense_text: nonsense
      }
    });
    
    const creativity = aiResponse?.creativity_score || Math.floor(Math.random() * 50) + 30;
    const basePoints = 1;
    const bonus = Math.floor(creativity * 0.12);
    const totalPoints = basePoints + bonus;
    await addPoints(userId, totalPoints, 'nonsense_factory', user);
    
    return {
      prompt_id: promptId,
      nonsense,
      creativity_score: creativity,
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Nonsense Factory error:', error);
    const points = 1;
    await addPoints(userId, points, 'nonsense_factory', user);
    return { prompt_id: promptId, points_awarded: points };
  }
};

// Mood Reader - AI reads your mood
const getMoodReading = async (userId, moodInput) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'mood_reader',
        action: 'read_mood',
        mood_input: moodInput
      }
    });
    
    const reading = aiResponse?.reading || aiResponse?.mood_reading || 'Tumhara mood samajh aa gaya!';
    const accuracy = aiResponse?.accuracy || Math.random() * 0.2 + 0.8;
    const basePoints = 3;
    const bonus = accuracy >= 0.85 ? 6 : accuracy >= 0.9 ? 8 : 0;
    const totalPoints = basePoints + bonus;
    await addPoints(userId, totalPoints, 'mood_reader', user);
    
    return {
      reading_id: Date.now(),
      reading,
      accuracy,
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Mood Reader error:', error);
    const points = 3;
    await addPoints(userId, points, 'mood_reader', user);
    return { reading_id: Date.now(), reading: 'Tumhara mood samajh aa gaya!', points_awarded: points };
  }
};

// Bakchodi Level - Measure bakchodi level
const getBakchodiLevel = async (userId, bakchodiText) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'bakchodi_level',
        action: 'measure_bakchodi',
        bakchodi_text: bakchodiText
      }
    });
    
    const bakchodiScore = aiResponse?.bakchodi_score || Math.floor(Math.random() * 100);
    const basePoints = Math.floor(bakchodiScore * 0.16);
    let bonus = 0;
    if (bakchodiScore >= 100) bonus = 30;
    else if (bakchodiScore >= 98) bonus = 20;
    const totalPoints = basePoints + bonus;
    await addPoints(userId, totalPoints, 'bakchodi_level', user);
    
    return {
      level_id: Date.now(),
      bakchodi_score: bakchodiScore,
      level: bakchodiScore >= 100 ? 'god' : bakchodiScore >= 98 ? 'legendary' : bakchodiScore >= 80 ? 'high' : 'normal',
      message: aiResponse?.message || 'Tumhara bakchodi level check ho gaya!',
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Bakchodi Level error:', error);
    const bakchodiScore = Math.floor(Math.random() * 100);
    const points = Math.floor(bakchodiScore * 0.16);
    await addPoints(userId, points, 'bakchodi_level', user);
    return { level_id: Date.now(), bakchodi_score: bakchodiScore, points_awarded: points };
  }
};

// Typing Chaos - Speed typing game
const startTypingChaos = async (userId) => {
  const texts = [
    'FaltuVerse is the most pointless yet addictive platform ever created!',
    'Bakchodi level maximum hai yahan pe, sab kuch faltu hai!',
    'Desi vibes, meme energy, chaos everywhere - that\'s FaltuVerse!',
    'Kuch bhi karo, bas timepass karo aur points kamao!',
    'AI judges everything here, from memes to bakchodi levels!'
  ];
  
  return {
    session_id: Date.now(),
    text: texts[Math.floor(Math.random() * texts.length)],
    duration: 35000
  };
};

const submitTypingScore = async (userId, sessionId, wpm, accuracy) => {
  const user = await User.findByPk(userId);
  const basePoints = Math.floor(wpm * 0.09);
  const wpmBonus = Math.floor(wpm / 50) * 3;
  const accuracyBonus = accuracy >= 95 ? 4 : 0;
  const perfectBonus = wpm >= 80 && accuracy >= 95 ? 10 : 0;
  const totalPoints = basePoints + wpmBonus + accuracyBonus + perfectBonus;
  await addPoints(userId, totalPoints, 'typing_chaos', user);
  return { wpm, accuracy, points_awarded: totalPoints };
};

// Emoji Tale - Create emoji stories
const getEmojiTale = async (userId) => {
  const emojiCount = Math.floor(Math.random() * 9) + 4; // 4-12 emojis
  return {
    tale_id: Date.now(),
    emoji_count: emojiCount,
    challenge: `Tell a story using ${emojiCount} emojis!`
  };
};

const submitEmojiTale = async (userId, taleId, emojiStory) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'emoji_tale',
        action: 'judge_emoji_story',
        emoji_story: emojiStory
      }
    });
    
    const creativity = aiResponse?.creativity_score || Math.floor(Math.random() * 50) + 40;
    const basePoints = Math.floor(creativity * 0.23);
    const storytellingBonus = creativity >= 80 ? 8 : 0;
    const totalPoints = basePoints + storytellingBonus;
    await addPoints(userId, totalPoints, 'emoji_tale', user);
    
    return {
      tale_id: taleId,
      emoji_story: emojiStory,
      creativity_score: creativity,
      ai_review: aiResponse?.review || 'Mast storytelling hai!',
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Emoji Tale error:', error);
    const creativity = Math.floor(Math.random() * 50) + 40;
    const points = Math.floor(creativity * 0.23);
    await addPoints(userId, points, 'emoji_tale', user);
    return { tale_id: taleId, creativity_score: creativity, points_awarded: points };
  }
};

// Vibe Scanner - Scan and rate vibes
const scanVibe = async (userId, vibeInput) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'vibe_scanner',
        action: 'scan_vibe',
        vibe_input: vibeInput
      }
    });
    
    const vibeScore = aiResponse?.vibe_score || Math.floor(Math.random() * 100);
    const basePoints = Math.floor(vibeScore * 0.11);
    const perfectBonus = vibeScore >= 95 ? 12 : vibeScore >= 85 ? 8 : 0;
    const totalPoints = basePoints + perfectBonus;
    await addPoints(userId, totalPoints, 'vibe_scanner', user);
    
    return {
      scan_id: Date.now(),
      vibe_score: vibeScore,
      vibe_reading: aiResponse?.reading || 'Tumhara vibe scan ho gaya!',
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Vibe Scanner error:', error);
    const vibeScore = Math.floor(Math.random() * 100);
    const points = Math.floor(vibeScore * 0.11);
    await addPoints(userId, points, 'vibe_scanner', user);
    return { scan_id: Date.now(), vibe_score: vibeScore, points_awarded: points };
  }
};

// Compliment Chaos - Random compliments
const getComplimentChaos = async (userId) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'compliment_chaos',
        action: 'generate_compliment',
        compliment_type: 'random'
      }
    });
    
    const compliment = aiResponse?.compliment || aiResponse?.compliment_text || 'Tum bahut achhe ho!';
    const points = 1;
    await addPoints(userId, points, 'compliment_chaos', user);
    
    return {
      compliment_id: Date.now(),
      compliment_text: compliment,
      points_awarded: points
    };
  } catch (error) {
    console.error('🎮 [GAMES] Compliment Chaos error:', error);
    const points = 1;
    await addPoints(userId, points, 'compliment_chaos', user);
    return { compliment_id: Date.now(), compliment_text: 'Tum bahut achhe ho!', points_awarded: points };
  }
};

// Pressure Test - Multi-round pressure game
const startPressureTest = async (userId) => {
  return {
    test_id: Date.now(),
    rounds: 4,
    current_round: 0,
    time_limit: 12000,
    scores: []
  };
};

const submitPressureRound = async (userId, testId, roundScore) => {
  const user = await User.findByPk(userId);
  const basePoints = 2;
  const perfectBonus = roundScore >= 90 ? 6 : 0;
  const totalPoints = basePoints + perfectBonus;
  await addPoints(userId, totalPoints, 'pressure_test', user);
  return { round_score: roundScore, points_awarded: totalPoints, perfect: roundScore >= 90 };
};

const completePressureTest = async (userId, testId, totalScore) => {
  const user = await User.findByPk(userId);
  const survivalBonus = 8;
  await addPoints(userId, survivalBonus, 'pressure_test_complete', user);
  return { total_score: totalScore, survival_bonus: survivalBonus };
};

// Quiz Chaos - Nonsense quiz
const getQuizChaos = async (userId) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'quiz_chaos',
        action: 'generate_quiz',
        questions_count: 6
      }
    });
    
    const questions = aiResponse?.questions || [
      { question: 'What is the meaning of life?', options: ['42', 'Bakchodi', 'FaltuVerse', 'Who knows?'], correct: 0 }
    ];
    
    return {
      quiz_id: Date.now(),
      questions,
      started_at: Date.now()
    };
  } catch (error) {
    console.error('🎮 [GAMES] Quiz Chaos error:', error);
    return {
      quiz_id: Date.now(),
      questions: [
        { question: 'What is the meaning of life?', options: ['42', 'Bakchodi', 'FaltuVerse', 'Who knows?'], correct: 0 }
      ],
      started_at: Date.now()
    };
  }
};

const submitQuizAnswers = async (userId, quizId, answers) => {
  const user = await User.findByPk(userId);
  // This would need the original quiz questions to check answers
  const correctCount = Math.floor(Math.random() * 6); // Placeholder
  const basePoints = 3;
  const correctBonus = correctCount * 3;
  const perfectBonus = correctCount === 6 ? 12 : 0;
  const totalPoints = basePoints + correctBonus + perfectBonus;
  await addPoints(userId, totalPoints, 'quiz_chaos', user);
  return { correct_count: correctCount, total_questions: 6, points_awarded: totalPoints };
};

// ============================================
// MISSING 29 GAMES IMPLEMENTATIONS
// ============================================

// 1. Gyaan Shot - Similar to Gyaan Guru but different style
const getGyaanShot = async (userId) => {
  const user = await User.findByPk(userId);
  const gyaanTypes = ['life', 'love', 'career', 'friendship', 'random'];
  const type = gyaanTypes[Math.floor(Math.random() * gyaanTypes.length)];
  
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'gyaan_shot',
        action: 'generate_gyaan_shot',
        gyaanType: type
      }
    });
    
  return {
      gyaan_id: Date.now(),
      gyaan_type: type,
      gyaan_text: aiResponse?.gyaan || aiResponse?.advice || 'Quick gyaan: Zindagi mein kuch bhi ho sakta hai!',
      wisdom_score: null
    };
  } catch (error) {
    console.error('🎮 [GAMES] Gyaan Shot error:', error);
    return {
      gyaan_id: Date.now(),
      gyaan_type: type,
      gyaan_text: 'Quick gyaan: Zindagi mein kuch bhi ho sakta hai!',
      wisdom_score: null
    };
  }
};

const submitGyaanShotRating = async (userId, gyaanId, rating) => {
  const user = await User.findByPk(userId);
  const points = Math.floor(rating * 0.15) + 3;
  await addPoints(userId, points, 'gyaan_shot', user);
  return { success: true, points_awarded: points, rating };
};

// 2. Bakwaas Meter - AI measures nonsense level
const getBakwaasMeter = async (userId, bakwaasText) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'bakwaas_meter',
        action: 'measure_bakwaas',
        bakwaas_text: bakwaasText
      }
    });
    
    const bakwaasScore = aiResponse?.bakwaas_score || Math.floor(Math.random() * 100);
    const basePoints = Math.floor(bakwaasScore * 0.1);
    const bonus = bakwaasScore >= 80 ? Math.floor(basePoints * 0.5) : 0;
    const totalPoints = basePoints + bonus + 1;
    await addPoints(userId, totalPoints, 'bakwaas_meter', user);
    
    return {
      meter_id: Date.now(),
      bakwaas_score: bakwaasScore,
      bakwaas_level: bakwaasScore < 30 ? 'low' : bakwaasScore < 60 ? 'medium' : bakwaasScore < 80 ? 'high' : 'extreme',
      message: aiResponse?.message || 'Tumhara bakwaas level check ho gaya!',
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Bakwaas Meter error:', error);
    const bakwaasScore = Math.floor(Math.random() * 100);
    const points = Math.floor(bakwaasScore * 0.1) + 1;
    await addPoints(userId, points, 'bakwaas_meter', user);
    return { meter_id: Date.now(), bakwaas_score: bakwaasScore, points_awarded: points };
  }
};

// 3. Emoji Fight - Emoji battle game
const startEmojiFight = async (userId) => {
  const emojis = ['😀', '😎', '🤖', '👻', '🤡', '👽', '🦄', '🐉', '🔥', '💥', '⚡', '🌟', '🎯', '💀', '👑'];
  const userEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  const aiEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
    return {
    fight_id: Date.now(),
    round: 1,
    total_rounds: 3,
    user_emoji: userEmoji,
    ai_emoji: aiEmoji,
    user_wins: 0,
    ai_wins: 0
  };
};

const submitEmojiFight = async (userId, fightId, userChoice) => {
  const user = await User.findByPk(userId);
  const winProbability = 0.5;
  const userWon = Math.random() < winProbability;
  const points = userWon ? 12 : 2;
  await addPoints(userId, points, 'emoji_fight', user);
  
  return {
    fight_id: fightId,
    user_won: userWon,
    points_awarded: points,
    message: userWon ? 'Tum jeet gaye! 🎉' : 'AI jeet gaya! 😅'
  };
};

// 4. Mood Switch - Fast mood switching challenge (different from moodSwinger)
const startMoodSwitchGame = async (userId) => {
  const moods = ['happy', 'sad', 'angry', 'confused', 'excited', 'chill'];
  const targetMood = moods[Math.floor(Math.random() * moods.length)];
  
  return {
    challenge_id: Date.now(),
    target_mood: targetMood,
    duration: 30000,
    switches: 0
  };
};

const submitMoodSwitchGame = async (userId, challengeId, switches) => {
  const user = await User.findByPk(userId);
  const basePoints = 5;
  const winPoints = switches >= 5 ? 20 : 0;
  const totalPoints = basePoints + winPoints;
  await addPoints(userId, totalPoints, 'mood_switch', user);
  
  return {
    challenge_id: challengeId,
    switches,
    points_awarded: totalPoints,
    won: switches >= 5
  };
};

// 5. Nonsense Poetry - Write nonsense poetry
const getNonsensePoetryChallenge = async (userId) => {
  const styles = ['haiku', 'limerick', 'free', 'nonsense'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  const minLines = 2;
  const maxLines = 6;
  
  return {
    poetry_id: Date.now(),
    style,
    min_lines: minLines,
    max_lines: maxLines,
    challenge: `Write a ${style} style nonsense poem (${minLines}-${maxLines} lines)!`
  };
};

const submitNonsensePoetry = async (userId, poetryId, poem) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'nonsense_poetry',
        action: 'judge_poetry',
        poem_text: poem
      }
    });
    
    const score = aiResponse?.score || Math.floor(Math.random() * 50) + 40;
    const points = Math.floor(score * 0.2) + 4;
    await addPoints(userId, points, 'nonsense_poetry', user);
    
    return {
      poetry_id: poetryId,
      poem,
      score,
      ai_review: aiResponse?.review || 'Mast nonsense poetry hai!',
      points_awarded: points
    };
  } catch (error) {
    console.error('🎮 [GAMES] Nonsense Poetry error:', error);
    const score = Math.floor(Math.random() * 50) + 40;
    const points = Math.floor(score * 0.2) + 4;
    await addPoints(userId, points, 'nonsense_poetry', user);
    return { poetry_id: poetryId, score, points_awarded: points };
  }
};

// 8. Desi Speed Tap - Fast tapping with desi theme
const submitDesiSpeedTap = async (userId, taps) => {
  const user = await User.findByPk(userId);
  const basePoints = Math.floor(taps * 0.05);
  const bonus = taps >= 200 ? Math.floor(basePoints * 0.5) : 0;
  const totalPoints = basePoints + bonus + 1;
  await addPoints(userId, totalPoints, 'desi_speed_tap', user);
  return { taps, points_awarded: totalPoints, bonus };
};

// 9. Cringe Meter - AI measures cringe (similar to implemented cringeLevel but different)
const getCringeMeter = async (userId, cringeText) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'cringe_meter',
        action: 'measure_cringe',
        cringe_text: cringeText
      }
    });
    
    const cringeScore = aiResponse?.cringe_score || Math.floor(Math.random() * 100);
    const basePoints = Math.floor(cringeScore * 0.12);
    const bonus = cringeScore >= 70 ? Math.floor(basePoints * 0.3) : 0;
    const totalPoints = basePoints + bonus + 2;
    await addPoints(userId, totalPoints, 'cringe_meter', user);
    
    return {
      meter_id: Date.now(),
      cringe_score: cringeScore,
      cringe_level: cringeScore < 50 ? 'low' : cringeScore < 70 ? 'medium' : 'high',
      message: aiResponse?.message || 'Tumhara cringe level check ho gaya!',
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Cringe Meter error:', error);
    const cringeScore = Math.floor(Math.random() * 100);
    const points = Math.floor(cringeScore * 0.12) + 2;
    await addPoints(userId, points, 'cringe_meter', user);
    return { meter_id: Date.now(), cringe_score: cringeScore, points_awarded: points };
  }
};

// 10. Vibe Check - AI checks your vibe
const getVibeCheck = async (userId, vibeInput) => {
  const user = await User.findByPk(userId);
  const vibeCategories = ['chill', 'hype', 'moody', 'wild', 'zen'];
  
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'vibe_check',
        action: 'check_vibe',
        vibe_input: vibeInput
      }
    });
    
    const detectedVibe = aiResponse?.vibe || vibeCategories[Math.floor(Math.random() * vibeCategories.length)];
    const accuracy = aiResponse?.accuracy || Math.random() * 0.3 + 0.7;
    const basePoints = 3;
    const bonus = accuracy >= 0.75 ? 5 : 0;
    const totalPoints = basePoints + bonus;
    await addPoints(userId, totalPoints, 'vibe_check', user);
    
    return {
      check_id: Date.now(),
      detected_vibe: detectedVibe,
      accuracy,
      message: aiResponse?.message || 'Tumhara vibe check ho gaya!',
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Vibe Check error:', error);
    const points = 3;
    await addPoints(userId, points, 'vibe_check', user);
    return { check_id: Date.now(), detected_vibe: 'chill', points_awarded: points };
  }
};

// 12. Time Bomb - Pressure timing game
const startTimeBomb = async (userId) => {
  const minTime = 5000;
  const maxTime = 20000;
  const bombTime = Math.floor(Math.random() * (maxTime - minTime)) + minTime;
  
  return {
    bomb_id: Date.now(),
    bomb_time: bombTime,
    started_at: Date.now()
  };
};

const defuseTimeBomb = async (userId, bombId, defuseTime) => {
  const user = await User.findByPk(userId);
  // Calculate points based on timing accuracy
  const basePoints = 2;
  const winPoints = defuseTime > 0 ? 15 : 0;
  const totalPoints = Math.floor((basePoints + winPoints) * 1.2);
  await addPoints(userId, totalPoints, 'time_bomb', user);
  
  return {
    bomb_id: bombId,
    defused: defuseTime > 0,
    points_awarded: totalPoints
  };
};

// 14. Meme Generator - Generate memes (different from meme battle)
const submitMemeGenerator = async (userId, memeText) => {
  const user = await User.findByPk(userId);
  const imageUrl = getRandomMemeImage();
  
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'meme_generator',
        action: 'score_meme',
        meme_text: memeText,
        image_url: imageUrl
      }
    });
    
    const score = aiResponse?.score || Math.floor(Math.random() * 50) + 40;
    const points = Math.floor(score * 0.25);
    const viralBonus = score >= 80 ? 20 : 0;
    const totalPoints = points + viralBonus;
    await addPoints(userId, totalPoints, 'meme_generator', user);
    
    return {
      meme_id: Date.now(),
      image_url: imageUrl,
      meme_text: memeText,
      score,
      viral: score >= 80,
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Meme Generator error:', error);
    const score = Math.floor(Math.random() * 50) + 40;
    const points = Math.floor(score * 0.25);
    await addPoints(userId, points, 'meme_generator', user);
    return { meme_id: Date.now(), score, points_awarded: points };
  }
};

// 16. Reaction Test - Test reaction time
const startReactionTest = async (userId) => {
  const user = await User.findByPk(userId);
  const outcomes = {
    jackpot: { weight: 5, pointsRange: [50, 100] },
    win: { weight: 20, pointsRange: [10, 30] },
    smallWin: { weight: 40, pointsRange: [1, 9] },
    nothing: { weight: 35, pointsRange: [0, 0] }
  };
  
  const totalWeight = 100;
  let random = Math.random() * totalWeight;
  
  let outcome = 'nothing';
  let cumulative = 0;
  for (const [key, value] of Object.entries(outcomes)) {
    cumulative += value.weight;
    if (random <= cumulative) {
      outcome = key;
      break;
    }
  }
  
  const pointsRange = outcomes[outcome].pointsRange;
  const points = outcome === 'nothing' ? 0 : Math.floor(Math.random() * (pointsRange[1] - pointsRange[0] + 1)) + pointsRange[0];
  
  if (points > 0) {
    await addPoints(userId, points, 'luck_draw', user);
  }
  
  return {
    draw_id: Date.now(),
    outcome,
    points_awarded: points
  };
};

// 17. Reaction Test - Test reaction time
const startReactionTest = async (userId) => {
  return {
    test_id: Date.now(),
    rounds: 5,
    current_round: 1,
    reactions: []
  };
};

const submitReaction = async (userId, testId, reactionTime) => {
  const user = await User.findByPk(userId);
  const basePoints = 1;
  const winPoints = reactionTime < 200 ? 8 : 0;
  const perfectBonus = reactionTime < 200 ? 5 : 0;
  const totalPoints = basePoints + winPoints + perfectBonus;
  await addPoints(userId, totalPoints, 'reaction_test', user);
  
  return {
    test_id: testId,
    reaction_time: reactionTime,
    points_awarded: totalPoints,
    perfect: reactionTime < 200
  };
};

// 18. Nonsense Generator - Generate nonsense content
const getNonsenseGeneratorPrompt = async (userId) => {
  const nonsenseTypes = ['word', 'sentence', 'story'];
  const type = nonsenseTypes[Math.floor(Math.random() * nonsenseTypes.length)];
  
  return {
    prompt_id: Date.now(),
    nonsense_type: type,
    prompt: `Generate a ${type} of nonsense!`
  };
};

const submitNonsenseGenerator = async (userId, promptId, nonsense) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'nonsense_generator',
        action: 'judge_nonsense',
        nonsense_text: nonsense
      }
    });
    
    const creativity = aiResponse?.creativity || Math.floor(Math.random() * 50) + 40;
    const basePoints = 1;
    const winPoints = creativity > 50 ? 6 : 0;
    const creativityBonus = 3;
    const totalPoints = basePoints + winPoints + creativityBonus;
    await addPoints(userId, totalPoints, 'nonsense_generator', user);
    
    return {
      prompt_id: promptId,
      nonsense,
      creativity_score: creativity,
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Nonsense Generator error:', error);
    const points = 1 + 6 + 3;
    await addPoints(userId, points, 'nonsense_generator', user);
    return { prompt_id: promptId, creativity_score: 50, points_awarded: points };
  }
};

// 19. Mood Ring - AI reads your mood
const getMoodRing = async (userId, moodInput) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'mood_ring',
        action: 'read_mood',
        mood_input: moodInput
      }
    });
    
    const detectedMood = aiResponse?.mood || aiResponse?.detected_mood || 'happy';
    const accuracy = aiResponse?.accuracy || 0.8;
    const basePoints = 3;
    const winPoints = accuracy >= 0.8 ? 12 : 0;
    const moodBonus = 5;
    const totalPoints = basePoints + winPoints + moodBonus;
    await addPoints(userId, totalPoints, 'mood_ring', user);
    
    return {
      ring_id: Date.now(),
      detected_mood: detectedMood,
      accuracy,
      message: aiResponse?.message || 'Tumhara mood detect ho gaya!',
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Mood Ring error:', error);
    const points = 3 + 12 + 5;
    await addPoints(userId, points, 'mood_ring', user);
    return { ring_id: Date.now(), detected_mood: 'happy', points_awarded: points };
  }
};

// 20. Bakchodi Meter - Measure bakchodi level
const getBakchodiMeter = async (userId, bakchodiText) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'bakchodi_meter',
        action: 'measure_bakchodi',
        bakchodi_text: bakchodiText
      }
    });
    
    const bakchodiScore = aiResponse?.bakchodi_score || Math.floor(Math.random() * 100);
    const basePoints = Math.floor(bakchodiScore * 0.15);
    const legendaryBonus = bakchodiScore >= 95 ? 15 : 0;
    const totalPoints = basePoints + legendaryBonus + 2;
    await addPoints(userId, totalPoints, 'bakchodi_meter', user);
    
    return {
      meter_id: Date.now(),
      bakchodi_score: bakchodiScore,
      bakchodi_level: bakchodiScore < 50 ? 'low' : bakchodiScore < 80 ? 'medium' : bakchodiScore < 95 ? 'high' : 'legendary',
      message: aiResponse?.message || 'Tumhara bakchodi level check ho gaya!',
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Bakchodi Meter error:', error);
    const bakchodiScore = Math.floor(Math.random() * 100);
    const points = Math.floor(bakchodiScore * 0.15) + 2;
    await addPoints(userId, points, 'bakchodi_meter', user);
    return { meter_id: Date.now(), bakchodi_score: bakchodiScore, points_awarded: points };
  }
};

// 22. Speed Typing - Typing speed challenge
const startSpeedTyping = async (userId) => {
  const texts = [
    'The quick brown fox jumps over the lazy dog',
    'FaltuVerse is the best app ever',
    'Type as fast as you can!',
    'Speed typing challenge begins now',
    'Show your typing skills here'
  ];
  const text = texts[Math.floor(Math.random() * texts.length)];
  
  return {
    typing_id: Date.now(),
    text_to_type: text,
    duration: 30000
  };
};

const submitSpeedTyping = async (userId, typingId, wpm, accuracy) => {
  const user = await User.findByPk(userId);
  const basePoints = 1;
  const wpmBonus = Math.floor(wpm / 10) * 2;
  const accuracyBonus = accuracy > 90 ? 3 : 0;
  const totalPoints = basePoints + wpmBonus + accuracyBonus;
  await addPoints(userId, totalPoints, 'speed_typing', user);
  
  return {
    typing_id: typingId,
    wpm,
    accuracy,
    points_awarded: totalPoints
  };
};

// 23. Emoji Story - Create emoji stories
const getEmojiStory = async (userId) => {
  const minEmojis = 3;
  const maxEmojis = 10;
  const emojiCount = Math.floor(Math.random() * (maxEmojis - minEmojis + 1)) + minEmojis;
  
  return {
    story_id: Date.now(),
    min_emojis: minEmojis,
    max_emojis: maxEmojis,
    required_emojis: emojiCount,
    challenge: `Create a story using ${emojiCount} emojis!`
  };
};

const submitEmojiStory = async (userId, storyId, emojiStory) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'emoji_story',
        action: 'judge_story',
        emoji_story: emojiStory
      }
    });
    
    const creativity = aiResponse?.creativity || Math.floor(Math.random() * 50) + 40;
    const basePoints = 4;
    const winPoints = creativity > 50 ? 16 : 0;
    const totalPoints = Math.floor((basePoints + winPoints) * 0.2);
    await addPoints(userId, totalPoints, 'emoji_story', user);
    
    return {
      story_id: storyId,
      emoji_story: emojiStory,
      creativity_score: creativity,
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Emoji Story error:', error);
    const points = 4;
    await addPoints(userId, points, 'emoji_story', user);
    return { story_id: storyId, creativity_score: 50, points_awarded: points };
  }
};

// 24. Vibe Meter - Measure vibe level
const getVibeMeter = async (userId, vibeInput) => {
  const user = await User.findByPk(userId);
  try {
    const aiResponse = await callAI({
      user,
      reason: 'games',
      appState: {
        game: 'vibe_meter',
        action: 'measure_vibe',
        vibe_input: vibeInput
      }
    });
    
    const vibeScore = aiResponse?.vibe_score || Math.floor(Math.random() * 100);
    const basePoints = Math.floor(vibeScore * 0.1);
    const perfectBonus = vibeScore >= 90 ? 10 : 0;
    const totalPoints = basePoints + perfectBonus + 2;
    await addPoints(userId, totalPoints, 'vibe_meter', user);
    
    return {
      meter_id: Date.now(),
      vibe_score: vibeScore,
      vibe_level: vibeScore < 50 ? 'low' : vibeScore < 80 ? 'medium' : 'high',
      message: aiResponse?.message || 'Tumhara vibe level check ho gaya!',
      points_awarded: totalPoints
    };
  } catch (error) {
    console.error('🎮 [GAMES] Vibe Meter error:', error);
    const vibeScore = Math.floor(Math.random() * 100);
    const points = Math.floor(vibeScore * 0.1) + 2;
    await addPoints(userId, points, 'vibe_meter', user);
    return { meter_id: Date.now(), vibe_score: vibeScore, points_awarded: points };
  }
};

// 26. Pressure Cooker - Pressure-based challenge (different from pressureTest)
const startPressureCooker = async (userId) => {
  return {
    cooker_id: Date.now(),
    rounds: 3,
    current_round: 1,
    time_limit: 15000
  };
};

const submitPressureCookerRound = async (userId, cookerId, round, completed) => {
  const user = await User.findByPk(userId);
  const basePoints = 2;
  const winPoints = completed ? 12 : 0;
  const perfectBonus = completed ? 5 : 0;
  const totalPoints = Math.floor((basePoints + winPoints + perfectBonus) * 1.3);
  await addPoints(userId, totalPoints, 'pressure_cooker', user);
  
  return {
    cooker_id: cookerId,
    round,
    completed,
    points_awarded: totalPoints
  };
};

const completePressureCooker = async (userId, cookerId, totalRounds) => {
  const user = await User.findByPk(userId);
  const bonus = totalRounds >= 3 ? 10 : 0;
  await addPoints(userId, bonus, 'pressure_cooker_complete', user);
  return { success: true, bonus_points: bonus };
};

// 27. Nonsense Quiz - Nonsense quiz game
const getNonsenseQuiz = async (userId) => {
  const questions = [
    { q: 'What color is a blue elephant?', a: 'Blue', options: ['Blue', 'Red', 'Green', 'Yellow'] },
    { q: 'How many legs does a snake have?', a: 'Zero', options: ['Zero', 'Two', 'Four', 'Eight'] },
    { q: 'What is 2 + 2 in nonsense math?', a: 'Banana', options: ['Banana', '4', 'Fish', 'Maybe'] },
    { q: 'What sound does a silent alarm make?', a: 'Nothing', options: ['Nothing', 'Beep', 'Boom', 'Meow'] },
    { q: 'What is the capital of Nonsense Land?', a: 'Chaos City', options: ['Chaos City', 'Delhi', 'Mumbai', 'Nowhere'] }
  ];
  
  const selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 5);
  
  return {
    quiz_id: Date.now(),
    questions: selectedQuestions
  };
};

const submitNonsenseQuiz = async (userId, quizId, answers) => {
  const user = await User.findByPk(userId);
  // For nonsense quiz, all answers are "correct" in a nonsense way
  const correctCount = answers.length; // All are correct in nonsense world
  const basePoints = 3;
  const correctBonus = correctCount * 2;
  const perfectBonus = correctCount === 5 ? 10 : 0;
  const totalPoints = basePoints + correctBonus + perfectBonus;
  await addPoints(userId, totalPoints, 'nonsense_quiz', user);
  
  return {
    quiz_id: quizId,
    correct_answers: correctCount,
    total_questions: 5,
    points_awarded: totalPoints
  };
};

// Helper function for AI calls
const callAI = async (options) => {
  try {
    const { callAI: callAIFunction } = require('../ai/handlers/aiDecisionEngine');
    return await callAIFunction(options);
  } catch (error) {
    console.error('🎮 [GAMES] AI call error:', error);
    return null;
  }
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
  getRoast,
  // NEW 30 GAMES
  startBakwaasBattle,
  submitBakwaas,
  getEmojiMashup,
  submitEmojiMashup,
  startMoodSwinger,
  submitMoodSwitch,
  getPoetryChallenge,
  submitPoetry,
  submitDesiSpeedRush,
  getCringeLevel,
  getVibeDetector,
  getUselessFact,
  startBombTimer,
  defuseBomb,
  submitMemeMaster,
  startReflexMaster,
  submitReflex,
  getNonsensePrompt,
  submitNonsense,
  getMoodReading,
  getBakchodiLevel,
  startTypingChaos,
  submitTypingScore,
  getEmojiTale,
  submitEmojiTale,
  scanVibe,
  getComplimentChaos,
  startPressureTest,
  submitPressureRound,
  completePressureTest,
  getQuizChaos,
  submitQuizAnswers,
  // MISSING 29 GAMES
  getGyaanShot,
  submitGyaanShotRating,
  getBakwaasMeter,
  startEmojiFight,
  submitEmojiFight,
  startMoodSwitchGame,
  submitMoodSwitchGame,
  getNonsensePoetryChallenge,
  submitNonsensePoetry,
  submitDesiSpeedTap,
  getCringeMeter,
  getVibeCheck,
  getJhandMeter,
  startTimeBomb,
  defuseTimeBomb,
  submitMemeGenerator,
  startReactionTest,
  submitReaction,
  getNonsenseGeneratorPrompt,
  submitNonsenseGenerator,
  getMoodRing,
  getBakchodiMeter,
  startSpeedTyping,
  submitSpeedTyping,
  getEmojiStory,
  submitEmojiStory,
  getVibeMeter,
  startPressureCooker,
  submitPressureCookerRound,
  completePressureCooker,
  getNonsenseQuiz,
  submitNonsenseQuiz,
};

