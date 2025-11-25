const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { triggerChaos, returnChaosToCreator, getRecentChaos } = require('../controllers/chaosController');

router.post('/trigger', authenticateToken, triggerChaos);
router.post('/return', authenticateToken, returnChaosToCreator);
router.get('/recent', authenticateToken, getRecentChaos);

module.exports = router;

