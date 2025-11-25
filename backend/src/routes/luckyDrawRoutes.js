const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getLastDraw, getRecentDraws } = require('../controllers/luckyDrawController');

router.get('/last', authenticateToken, getLastDraw);
router.get('/recent', authenticateToken, getRecentDraws);

module.exports = router;
