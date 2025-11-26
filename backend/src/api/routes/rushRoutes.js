const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middlewares/auth');
const {
  getNextRushActivity,
  markActivityVisited,
  markActivityStatus,
  hasAvailableRushActivities,
  getUserRushStats,
  restartRush
} = require('../../services/engagement/rushService');

/**
 * GET /api/rush/next
 * Get next rush activity for the user
 */
router.get('/next', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const nextActivity = await getNextRushActivity(userId);

    if (!nextActivity) {
      return res.json({
        success: true,
        has_activity: false,
        message: 'Sab activities complete ho gaye hain aaj ke liye!'
      });
    }

    // Mark as visited
    await markActivityVisited(userId, nextActivity.activity.type);

    res.json({
      success: true,
      has_activity: true,
      activity: nextActivity.activity,
      is_new: nextActivity.isNew,
      visit_count: nextActivity.visit_count
    });
  } catch (error) {
    console.error('🎯 [RUSH] Get next activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Next activity fetch nahi hua'
    });
  }
});

/**
 * POST /api/rush/complete
 * Mark activity as completed/skipped
 */
router.post('/complete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { activity_type, status } = req.body;

    if (!activity_type) {
      return res.status(400).json({
        success: false,
        error: 'Activity type required'
      });
    }

    const validStatus = status || 'seen'; // Default to 'seen' if not provided
    if (!['seen', 'completed', 'skipped'].includes(validStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: seen, completed, or skipped'
      });
    }

    await markActivityStatus(userId, activity_type, validStatus);

    res.json({
      success: true,
      message: `Activity ${validStatus} mark ho gayi`
    });
  } catch (error) {
    console.error('🎯 [RUSH] Complete activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Activity complete mark nahi hui'
    });
  }
});

/**
 * GET /api/rush/available
 * Check if user has available rush activities
 */
router.get('/available', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const hasAvailable = await hasAvailableRushActivities(userId);

    res.json({
      success: true,
      has_available: hasAvailable
    });
  } catch (error) {
    console.error('🎯 [RUSH] Check available error:', error);
    res.status(500).json({
      success: false,
      error: 'Check nahi kar paye'
    });
  }
});

/**
 * GET /api/rush/stats
 * Get user's rush statistics
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const stats = await getUserRushStats(userId);

    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('🎯 [RUSH] Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Stats fetch nahi huye'
    });
  }
});

/**
 * POST /api/rush/restart
 * Restart rush - assign new games
 */
router.post('/restart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const assignedGames = await restartRush(userId);

    res.json({
      success: true,
      message: 'Rush restart ho gaya! Naye games assign ho gaye',
      assigned_games: assignedGames.length
    });
  } catch (error) {
    console.error('🎯 [RUSH] Restart error:', error);
    res.status(500).json({
      success: false,
      error: 'Rush restart nahi hua'
    });
  }
});

module.exports = router;

