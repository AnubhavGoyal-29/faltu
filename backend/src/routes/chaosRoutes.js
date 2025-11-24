const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { triggerChaos, getRecentChaos } = require('../controllers/chaosController');

router.post('/trigger', authenticateToken, triggerChaos);
router.get('/recent', authenticateToken, getRecentChaos);

module.exports = router;

