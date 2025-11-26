const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/auth');
const { submitGuess, getHint, getDailyInfo } = require('../controllers/wordleController');

router.post('/guess', authenticateToken, submitGuess);
router.get('/hint', authenticateToken, getHint);
router.get('/daily', authenticateToken, getDailyInfo);

module.exports = router;

