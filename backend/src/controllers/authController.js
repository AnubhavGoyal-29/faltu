const { verifyGoogleToken, findOrCreateUser, updateLoginStreak, generateToken } = require('../services/authService');
const { addPoints } = require('../services/pointsService');
const { generateWelcomeMessage } = require('../services/aiDecisionEngine');
const { User, UserPoints } = require('../models');

// Admin login endpoint
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hardcoded admin credentials (for testing only)
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Find or create admin user
    let adminUser = await User.findOne({ where: { email: 'admin@faltuverse.com' } });

    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@faltuverse.com',
        profile_photo: null,
        google_id: null
      });

      // Initialize user points
      await UserPoints.create({
        user_id: adminUser.user_id,
        total_points: 1000,
        login_streak: 1
      });
    }

    // Update login streak
    const streak = await updateLoginStreak(adminUser.user_id);

    // Award points for login
    await addPoints(adminUser.user_id, 10, 'daily_login', {
      user_id: adminUser.user_id,
      name: adminUser.name,
      email: adminUser.email
    }, { login_streak: streak });

    // Generate JWT token
    const jwtToken = generateToken(adminUser.user_id);

    res.json({
      token: jwtToken,
      user: {
        user_id: adminUser.user_id,
        name: adminUser.name,
        email: adminUser.email,
        profile_photo: adminUser.profile_photo
      },
      login_streak: streak,
      welcome_message: 'Welcome Admin! 🎉'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: error.message || 'Admin login failed' });
  }
};

// Google login endpoint
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    console.log('🔐 [AUTH] Google login request received');

    if (!token) {
      console.error('🔐 [AUTH] ❌ No token provided');
      return res.status(400).json({ error: 'Google token is required' });
    }

    console.log('🔐 [AUTH] Verifying Google token...');
    // Verify Google token
    const googleUserData = await verifyGoogleToken(token);
    console.log('🔐 [AUTH] ✅ Token verified, user data:', googleUserData);

    // Find or create user
    console.log('🔐 [AUTH] Finding or creating user...');
    const user = await findOrCreateUser(googleUserData);
    console.log('🔐 [AUTH] ✅ User found/created:', user.user_id);

    // Update login streak
    const streak = await updateLoginStreak(user.user_id);
    console.log('🔐 [AUTH] Login streak:', streak);

    // Award points for login (10 points) - with AI suggestion
    await addPoints(user.user_id, 10, 'daily_login', {
      user_id: user.user_id,
      name: user.name,
      email: user.email
    }, { login_streak: streak });

    // Generate JWT token
    const jwtToken = generateToken(user.user_id);
    console.log('🔐 [AUTH] ✅ JWT token generated');

    // Generate AI welcome message (non-blocking)
    let welcomeMessage = null;
    try {
      welcomeMessage = await generateWelcomeMessage({
        user_id: user.user_id,
        name: user.name,
        email: user.email
      });
    } catch (error) {
      console.error('Welcome message generation error:', error);
    }

    console.log('🔐 [AUTH] ✅ Login successful for user:', user.name);
    res.json({
      token: jwtToken,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        profile_photo: user.profile_photo
      },
      login_streak: streak,
      welcome_message: welcomeMessage
    });
  } catch (error) {
    console.error('🔐 [AUTH] ❌ Google login error:', error);
    console.error('🔐 [AUTH] Error stack:', error.stack);
    res.status(401).json({ error: error.message || 'Authentication failed' });
  }
};

module.exports = {
  googleLogin,
  adminLogin
};

