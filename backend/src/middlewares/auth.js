const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token chahiye bhai! Login karo pehle.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User nahi mila! Kuch galat hai.' });
    }

    // Attach user_id for compatibility
    req.user = {
      ...user.toJSON(),
      user_id: user.user_id,
      userId: user.user_id // For backward compatibility
    };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Galat token hai bhai! Phir se login karo.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expire ho gaya! Phir se login karo.' });
    }
    console.error('🔐 [AUTH] Authentication error:', error);
    return res.status(500).json({ error: 'Authentication mein problem aayi. Try again!' });
  }
};

module.exports = { authenticateToken };

