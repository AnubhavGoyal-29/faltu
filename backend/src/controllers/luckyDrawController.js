const { getLastLuckyDraw } = require('../services/luckyDrawService');
const { getRecentMinuteDraws } = require('../services/minuteLuckyDrawService');

// Get last lucky draw winner
const getLastDraw = async (req, res) => {
  try {
    const draw = await getLastLuckyDraw();
    
    if (!draw) {
      return res.json({ 
        message: 'No lucky draw has been conducted yet',
        draw: null 
      });
    }

    res.json({
      draw_id: draw.draw_id,
      winner: {
        user_id: draw.winner.user_id,
        name: draw.winner.name,
        email: draw.winner.email,
        profile_photo: draw.winner.profile_photo
      },
      reward_points: draw.reward_points,
      timestamp: draw.timestamp
    });
  } catch (error) {
    console.error('Get last draw error:', error);
    res.status(500).json({ error: 'Failed to get last draw' });
  }
};

// Get recent minute draws
const getRecentDraws = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const draws = await getRecentMinuteDraws(limit);
    
    res.json({
      draws: draws.map(draw => ({
        draw_id: draw.draw_id,
        winner: {
          user_id: draw.winner.user_id,
          name: draw.winner.name,
          email: draw.winner.email,
          profile_photo: draw.winner.profile_photo
        },
        reward_points: draw.reward_points,
        timestamp: draw.timestamp
      }))
    });
  } catch (error) {
    console.error('Get recent draws error:', error);
    res.status(500).json({ error: 'Failed to get recent draws' });
  }
};

module.exports = {
  getLastDraw,
  getRecentDraws
};

