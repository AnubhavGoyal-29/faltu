const {
  getTodayChallenge,
  submitBakchodiChallenge,
  startDebate,
  submitDebateMessage: submitDebateMsg,
  forfeitDebate: forfeitDebateService,
  getRandomMemeImage,
  submitMemeCaption,
  spinWheel,
  getFuturePrediction,
  submitTapScore,
  getTapLeaderboard,
  recordRunawayButtonWin,
  getDare,
  getRoast
} = require('../../services/gamesService');
const { BakchodiChallenge, Debate, MemeBattle, FuturePrediction, Dare, Roast } = require('../../models');

// Daily Bakchodi Challenge
const getChallenge = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const challenge = await getTodayChallenge(userId);
    res.json({ success: true, challenge });
  } catch (error) {
    console.error('🎮 [GAMES] Get challenge error:', error);
    res.status(500).json({ success: false, error: 'Challenge fetch nahi hua' });
  }
};

const submitChallenge = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { submission } = req.body;
    const challenge = await submitBakchodiChallenge(userId, submission);
    res.json({ success: true, challenge });
  } catch (error) {
    console.error('🎮 [GAMES] Submit challenge error:', error);
    res.status(500).json({ success: false, error: error.message || 'Submission failed' });
  }
};

const getChallengeHistory = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const challenges = await BakchodiChallenge.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 10
    });
    res.json({ success: true, challenges });
  } catch (error) {
    console.error('🎮 [GAMES] Get history error:', error);
    res.status(500).json({ success: false, error: 'History fetch nahi hui' });
  }
};

// Debate - Start new debate
const getDebateTopic = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const result = await startDebate(userId);
    res.json({ success: true, debate_id: result.debate_id, topic: result.topic });
  } catch (error) {
    console.error('🎮 [GAMES] Get debate topic error:', error);
    res.status(500).json({ success: false, error: 'Topic fetch nahi hua' });
  }
};

// Debate - Get debate by ID
const getDebate = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { debate_id } = req.params;
    const debate = await Debate.findByPk(debate_id);
    
    if (!debate || debate.user_id !== userId) {
      return res.status(404).json({ success: false, error: 'Debate nahi mila' });
    }
    
    res.json({ success: true, debate });
  } catch (error) {
    console.error('🎮 [GAMES] Get debate error:', error);
    res.status(500).json({ success: false, error: 'Debate fetch nahi hua' });
  }
};

// Debate - Submit message
const submitDebateMessage = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { debate_id, message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message required' });
    }
    
    const debate = await submitDebateMsg(debate_id, userId, message.trim());
    res.json({ success: true, debate });
  } catch (error) {
    console.error('🎮 [GAMES] Submit debate message error:', error);
    res.status(500).json({ success: false, error: error.message || 'Message submit nahi hui' });
  }
};

// Debate - Forfeit
const forfeitDebate = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { debate_id } = req.body;
    const debate = await forfeitDebateService(debate_id, userId);
    res.json({ success: true, debate });
  } catch (error) {
    console.error('🎮 [GAMES] Forfeit debate error:', error);
    res.status(500).json({ success: false, error: error.message || 'Forfeit nahi hua' });
  }
};

// Meme Battle
const getMemeImage = async (req, res) => {
  try {
    const imageUrl = getRandomMemeImage();
    res.json({ success: true, image_url: imageUrl });
  } catch (error) {
    console.error('🎮 [GAMES] Get meme image error:', error);
    res.status(500).json({ success: false, error: 'Image fetch nahi hui' });
  }
};

const submitMeme = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { caption } = req.body;
    
    // Validate caption
    if (!caption || typeof caption !== 'string') {
      return res.status(400).json({ success: false, error: 'Caption required' });
    }
    
    const trimmedCaption = caption.trim();
    if (trimmedCaption.length === 0) {
      return res.status(400).json({ success: false, error: 'Caption cannot be empty' });
    }
    
    if (trimmedCaption.length > 500) {
      return res.status(400).json({ success: false, error: 'Caption too long (max 500 characters)' });
    }
    
    const battle = await submitMemeCaption(userId, trimmedCaption, req.user);
    res.json({ success: true, battle });
  } catch (error) {
    console.error('🎮 [GAMES] Submit meme error:', error);
    res.status(500).json({ success: false, error: error.message || 'Meme submit nahi hui' });
  }
};

// Wheel Spin
const spin = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const result = await spinWheel(userId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('🎮 [GAMES] Spin wheel error:', error);
    res.status(500).json({ success: false, error: 'Wheel spin nahi hui' });
  }
};

// Future Prediction
const predictFuture = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { name, mood, fav_snack } = req.body;
    const prediction = await getFuturePrediction(userId, name, mood, fav_snack);
    res.json({ success: true, prediction });
  } catch (error) {
    console.error('🎮 [GAMES] Predict future error:', error);
    res.status(500).json({ success: false, error: 'Prediction nahi hui' });
  }
};

// Tap Game
const submitTap = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { taps } = req.body;
    const score = await submitTapScore(userId, taps);
    res.json({ success: true, score });
  } catch (error) {
    console.error('🎮 [GAMES] Submit tap error:', error);
    res.status(500).json({ success: false, error: 'Score submit nahi hua' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await getTapLeaderboard(10);
    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('🎮 [GAMES] Get leaderboard error:', error);
    res.status(500).json({ success: false, error: 'Leaderboard fetch nahi hui' });
  }
};

// Runaway Button
const recordWin = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { attempts } = req.body;
    const win = await recordRunawayButtonWin(userId, attempts);
    res.json({ success: true, win });
  } catch (error) {
    console.error('🎮 [GAMES] Record win error:', error);
    res.status(500).json({ success: false, error: 'Win record nahi hui' });
  }
};

// Dare Machine
const getDareForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const dare = await getDare(userId);
    res.json({ success: true, dare });
  } catch (error) {
    console.error('🎮 [GAMES] Get dare error:', error);
    res.status(500).json({ success: false, error: 'Dare fetch nahi hui' });
  }
};

// Roast Me
const getRoastForUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const roast = await getRoast(userId);
    res.json({ success: true, roast });
  } catch (error) {
    console.error('🎮 [GAMES] Get roast error:', error);
    res.status(500).json({ success: false, error: 'Roast fetch nahi hui' });
  }
};

module.exports = {
  getChallenge,
  submitChallenge,
  getChallengeHistory,
  getDebateTopic,
  getDebate,
  submitDebateMessage,
  forfeitDebate,
  getMemeImage,
  submitMeme,
  spin,
  predictFuture,
  submitTap,
  getLeaderboard,
  recordWin,
  getDareForUser,
  getRoastForUser
};

