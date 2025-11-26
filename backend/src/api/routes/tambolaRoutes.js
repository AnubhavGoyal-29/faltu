const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/auth');
const {
  getOrCreateRoom,
  register,
  getTicket,
  getUsers,
  getLeaderboardData,
  getLastWinners
} = require('../controllers/tambolaController');

// Get or create active room
router.get('/room', authenticateToken, getOrCreateRoom);

// Register for tambola
router.post('/register', authenticateToken, register);

// Get user's ticket
router.get('/ticket/:room_id', authenticateToken, getTicket);

// Get registered users
router.get('/users/:room_id', authenticateToken, getUsers);
router.get('/leaderboard/:room_id', authenticateToken, getLeaderboardData);
router.get('/last-winners', authenticateToken, getLastWinners);

module.exports = router;

