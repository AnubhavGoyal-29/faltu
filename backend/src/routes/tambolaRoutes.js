const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getOrCreateRoom,
  register,
  getTicket,
  getUsers
} = require('../controllers/tambolaController');

// Get or create active room
router.get('/room', authenticateToken, getOrCreateRoom);

// Register for tambola
router.post('/register', authenticateToken, register);

// Get user's ticket
router.get('/ticket/:room_id', authenticateToken, getTicket);

// Get registered users
router.get('/users/:room_id', authenticateToken, getUsers);

module.exports = router;

