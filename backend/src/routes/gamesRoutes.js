const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getChallenge,
  submitChallenge,
  getChallengeHistory,
  getDebateTopic,
  submitDebateArgument,
  getMemeImage,
  submitMeme,
  spin,
  predictFuture,
  submitTap,
  getLeaderboard,
  recordWin,
  getDareForUser,
  getRoastForUser
} = require('../controllers/gamesController');

// Daily Bakchodi Challenge
router.get('/bakchodi/challenge', authenticateToken, getChallenge);
router.post('/bakchodi/submit', authenticateToken, submitChallenge);
router.get('/bakchodi/history', authenticateToken, getChallengeHistory);

// Debate
router.get('/debate/topic', authenticateToken, getDebateTopic);
router.post('/debate/submit', authenticateToken, submitDebateArgument);

// Meme Battle
router.get('/meme/image', authenticateToken, getMemeImage);
router.post('/meme/submit', authenticateToken, submitMeme);

// Wheel Spin
router.post('/wheel/spin', authenticateToken, spin);

// Future Prediction
router.post('/future/predict', authenticateToken, predictFuture);

// Tap Game
router.post('/tap/submit', authenticateToken, submitTap);
router.get('/tap/leaderboard', authenticateToken, getLeaderboard);

// Runaway Button
router.post('/runaway/win', authenticateToken, recordWin);

// Dare Machine
router.get('/dare', authenticateToken, getDareForUser);

// Roast Me
router.get('/roast', authenticateToken, getRoastForUser);

module.exports = router;

