const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getLastDraw } = require('../controllers/luckyDrawController');

router.get('/last', authenticateToken, getLastDraw);

module.exports = router;

