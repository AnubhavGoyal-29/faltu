const { triggerChaosEvent, returnChaos, getRecentChaosEvents } = require('../services/chaosService');
const { User } = require('../models');

// Trigger chaos event
const triggerChaos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId);
    
    // Get io instance from app
    const io = req.app.get('io');
    
    const result = await triggerChaosEvent(userId, user, io);
    
    res.json({
      success: true,
      event: result,
      message: 'Chaos triggered successfully! All users will see it.'
    });
  } catch (error) {
    console.error('💥 [CHAOS] Trigger chaos error:', error);
    res.status(500).json({ error: error.message || 'Chaos trigger nahi hua bhai! Try again.' });
  }
};

// Return chaos to original creator
const returnChaosToCreator = async (req, res) => {
  try {
    const returnerUserId = req.user.userId;
    const { originalEventId } = req.body;
    
    if (!originalEventId) {
      return res.status(400).json({ error: 'originalEventId required' });
    }
    
    // Get io instance from app
    const io = req.app.get('io');
    
    const result = await returnChaos(returnerUserId, originalEventId, io);
    
    res.json({
      success: true,
      event: result,
      message: 'Chaos returned successfully!'
    });
  } catch (error) {
    console.error('Return chaos error:', error);
    res.status(500).json({ error: error.message || 'Failed to return chaos' });
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
  returnChaosToCreator,
  getRecentChaos
};
