import express from 'express';
import { getDb } from '../db/mysql.js';
import { ACTIVITY_REGISTRY, TOTAL_ACTIVITIES } from '../data/activities.js';

const router = express.Router();

// POST /api/activities/track - Track activity completion or skip
router.post('/track', async (req, res) => {
  try {
    const { anonymous_user_id, activity_id, status } = req.body;

    // Validation
    if (!anonymous_user_id || !activity_id || !status) {
      return res.status(400).json({ 
        error: 'anonymous_user_id, activity_id, and status are required' 
      });
    }

    if (!['completed', 'skipped'].includes(status)) {
      return res.status(400).json({ 
        error: 'status must be either "completed" or "skipped"' 
      });
    }

    const db = getDb();
    
    // Insert or update (using ON DUPLICATE KEY UPDATE)
    const [result] = await db.query(
      `INSERT INTO user_activities (anonymous_user_id, activity_id, status, timestamp)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
         status = VALUES(status),
         timestamp = NOW()`,
      [anonymous_user_id, activity_id, status]
    );

    res.json({ 
      success: true, 
      id: result.insertId || 'updated'
    });
  } catch (error) {
    console.error('Activity tracking error:', error);
    res.status(500).json({ 
      error: 'Failed to track activity' 
    });
  }
});

// GET /api/activities/next - Get next activity for user (backend-controlled)
router.get('/next', async (req, res) => {
  try {
    const { anonymous_user_id } = req.query;

    if (!anonymous_user_id) {
      return res.status(400).json({ 
        error: 'anonymous_user_id is required' 
      });
    }

    const db = getDb();
    
    // Get all activities user has done (completed or skipped)
    const [doneActivities] = await db.query(
      `SELECT activity_id FROM user_activities 
       WHERE anonymous_user_id = ?`,
      [anonymous_user_id]
    );

    const doneActivityIds = new Set(doneActivities.map(a => a.activity_id));
    
    // Filter out done activities
    const availableActivities = ACTIVITY_REGISTRY.filter(
      activity => !doneActivityIds.has(activity.id)
    );

    // Get completed count separately
    const [completedActivities] = await db.query(
      `SELECT COUNT(*) as count FROM user_activities 
       WHERE anonymous_user_id = ? AND status = 'completed'`,
      [anonymous_user_id]
    );
    
    const completedCount = completedActivities[0]?.count || 0;

    // Check if all activities are done
    if (availableActivities.length === 0) {
      return res.json({
        completed: true,
        activity: null,
        progress: {
          completed: completedCount,
          total: TOTAL_ACTIVITIES,
          remaining: 0
        }
      });
    }

    // Pick a random activity from available ones
    const randomIndex = Math.floor(Math.random() * availableActivities.length);
    const nextActivity = availableActivities[randomIndex];

    res.json({
      completed: false,
      activity: nextActivity,
      progress: {
        completed: completedCount,
        total: TOTAL_ACTIVITIES,
        remaining: availableActivities.length
      }
    });
  } catch (error) {
    console.error('Get next activity error:', error);
    res.status(500).json({ 
      error: 'Failed to get next activity' 
    });
  }
});

// GET /api/activities/user/:userId - Get all activities for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDb();
    
    const [activities] = await db.query(
      `SELECT activity_id, status, timestamp 
       FROM user_activities 
       WHERE anonymous_user_id = ?
       ORDER BY timestamp DESC`,
      [userId]
    );

    res.json({ activities });
  } catch (error) {
    console.error('Get user activities error:', error);
    res.status(500).json({ 
      error: 'Failed to get user activities' 
    });
  }
});

// GET /api/activities/stats - Get statistics for admin
router.get('/stats', async (req, res) => {
  try {
    const db = getDb();
    
    // Total unique users
    const [userCount] = await db.query(
      `SELECT COUNT(DISTINCT anonymous_user_id) as total_users FROM user_activities`
    );

    // Activities completed count
    const [completedCount] = await db.query(
      `SELECT COUNT(*) as total_completed FROM user_activities WHERE status = 'completed'`
    );

    // Activities skipped count
    const [skippedCount] = await db.query(
      `SELECT COUNT(*) as total_skipped FROM user_activities WHERE status = 'skipped'`
    );

    // Most popular activities
    const [popularActivities] = await db.query(
      `SELECT activity_id, COUNT(*) as count, 
              SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count
       FROM user_activities 
       GROUP BY activity_id 
       ORDER BY count DESC 
       LIMIT 10`
    );

    res.json({
      total_users: userCount[0].total_users,
      total_completed: completedCount[0].total_completed,
      total_skipped: skippedCount[0].total_skipped,
      popular_activities: popularActivities
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: 'Failed to get statistics' 
    });
  }
});

// DELETE /api/activities/reset - Clear all activities for a user (restart)
router.delete('/reset', async (req, res) => {
  try {
    const { anonymous_user_id } = req.query;

    if (!anonymous_user_id) {
      return res.status(400).json({ 
        error: 'anonymous_user_id is required' 
      });
    }

    const db = getDb();
    
    // Delete all activities for this user
    await db.query(
      `DELETE FROM user_activities WHERE anonymous_user_id = ?`,
      [anonymous_user_id]
    );

    res.json({ 
      success: true,
      message: 'All activities cleared for user'
    });
  } catch (error) {
    console.error('Reset activities error:', error);
    res.status(500).json({ 
      error: 'Failed to reset activities' 
    });
  }
});

// GET /api/activities/users - Get all users with their activities (for admin)
router.get('/users', async (req, res) => {
  try {
    const db = getDb();
    
    const [users] = await db.query(
      `SELECT 
         anonymous_user_id,
         COUNT(*) as total_activities,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
         SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) as skipped_count,
         MIN(timestamp) as first_activity,
         MAX(timestamp) as last_activity
       FROM user_activities
       GROUP BY anonymous_user_id
       ORDER BY last_activity DESC
       LIMIT 100`
    );

    // Get detailed activities for each user
    const usersWithActivities = await Promise.all(
      users.map(async (user) => {
        const [activities] = await db.query(
          `SELECT activity_id, status, timestamp 
           FROM user_activities 
           WHERE anonymous_user_id = ?
           ORDER BY timestamp DESC`,
          [user.anonymous_user_id]
        );
        return {
          ...user,
          activities
        };
      })
    );

    res.json({ users: usersWithActivities });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      error: 'Failed to get users' 
    });
  }
});

export default router;

