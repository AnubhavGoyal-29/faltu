const { triggerChaosEvent, getRecentChaosEvents } = require('../services/chaosService');
const { User } = require('../models');

// Trigger chaos event
const triggerChaos = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const event = await triggerChaosEvent(userId, req.user);

    // Broadcast chaos event to all connected clients
    const io = req.app.get('io');
    if (io) {
      io.emit('chaos_event', {
        event_type: event.event_type,
        event_data: event.event_data,
        triggered_by: {
          user_id: req.user.user_id,
          name: req.user.name
        }
      });
    }

    res.json({
      success: true,
      event: event
    });
  } catch (error) {
    console.error('Trigger chaos error:', error);
    res.status(500).json({ error: 'Failed to trigger chaos event' });
  }
};

// Get recent chaos events
const getRecentChaos = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const events = await getRecentChaosEvents(limit);

    res.json({
      events: events.map(event => ({
        event_id: event.event_id,
        event_type: event.event_type,
        event_data: event.event_data,
        triggered_by: {
          user_id: event.triggeredBy.user_id,
          name: event.triggeredBy.name,
          profile_photo: event.triggeredBy.profile_photo
        },
        created_at: event.created_at
      }))
    });
  } catch (error) {
    console.error('Get recent chaos error:', error);
    res.status(500).json({ error: 'Failed to get recent chaos events' });
  }
};

module.exports = {
  triggerChaos,
  getRecentChaos
};

