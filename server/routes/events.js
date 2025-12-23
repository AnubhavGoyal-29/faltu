import express from 'express';
import { getDb } from '../db/mysql.js';

const router = express.Router();

// POST /api/event - Track analytics events
router.post('/', async (req, res) => {
  try {
    const { anonymous_user_id, event_name, activity_id, metadata } = req.body;

    // Validation
    if (!anonymous_user_id || !event_name) {
      return res.status(400).json({ 
        error: 'anonymous_user_id and event_name are required' 
      });
    }

    const db = getDb();
    const [result] = await db.query(
      `INSERT INTO events (anonymous_user_id, event_name, activity_id, metadata, timestamp)
       VALUES (?, ?, ?, ?, NOW())`,
      [
        anonymous_user_id,
        event_name,
        activity_id || null,
        metadata ? JSON.stringify(metadata) : null
      ]
    );

    res.json({ 
      success: true, 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Event tracking error:', error);
    res.status(500).json({ 
      error: 'Failed to track event' 
    });
  }
});

export default router;

