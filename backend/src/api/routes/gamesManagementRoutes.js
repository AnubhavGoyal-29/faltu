/**
 * Games Management Routes
 * 
 * Routes for game registry, analytics, and management
 * 
 * @version 1.0
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { getGameRegistry } = require('../../services/games/GameRegistry');

const gameRegistry = getGameRegistry();

/**
 * GET /api/games-management/registry
 * Get all registered games
 */
router.get('/registry', authenticate, (req, res) => {
  const games = gameRegistry.getAllGamesInfo();
  
  res.json({
    status: 'success',
    data: {
      games,
      total: games.length,
      enabled: games.filter(g => g.enabled).length
    }
  });
});

/**
 * GET /api/games-management/registry/:gameName
 * Get specific game info
 */
router.get('/registry/:gameName', authenticate, (req, res) => {
  const { gameName } = req.params;
  
  try {
    const gameInfo = gameRegistry.getGameInfo(gameName);
    
    res.json({
      status: 'success',
      data: gameInfo
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * GET /api/games-management/enabled
 * Get enabled games only
 */
router.get('/enabled', authenticate, (req, res) => {
  const enabled = gameRegistry.getEnabledGames();
  
  res.json({
    status: 'success',
    data: {
      games: enabled,
      count: enabled.length
    }
  });
});

/**
 * POST /api/games-management/clear-cache
 * Clear game engine cache
 */
router.post('/clear-cache', authenticate, (req, res) => {
  const { gameName } = req.body;
  
  if (gameName) {
    gameRegistry.clearInstance(gameName);
    res.json({
      status: 'success',
      message: `Cache cleared for ${gameName}`
    });
  } else {
    gameRegistry.clearAll();
    res.json({
      status: 'success',
      message: 'All game caches cleared'
    });
  }
});

module.exports = router;

