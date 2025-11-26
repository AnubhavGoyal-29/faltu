const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/auth');
const { getJoke } = require('../controllers/jokeController');

router.get('/random', authenticateToken, getJoke);

module.exports = router;

