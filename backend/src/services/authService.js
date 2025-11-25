const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { User, UserPoints } = require('../models');

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Verify Google token and get user info
// Can handle both access_token (OAuth2) and id_token (OpenID Connect)
const verifyGoogleToken = async (token) => {
  try {
    console.log('🔐 [AUTH SERVICE] Verifying token...');
    console.log('🔐 [AUTH SERVICE] GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set');
    
    // Try to verify as ID token first
    try {
      console.log('🔐 [AUTH SERVICE] Trying ID token verification...');
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      console.log('🔐 [AUTH SERVICE] ✅ ID token verified');
      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        profilePhoto: payload.picture
      };
    } catch (idTokenError) {
      console.log('🔐 [AUTH SERVICE] ID token failed, trying access token...');
      console.log('🔐 [AUTH SERVICE] ID token error:', idTokenError.message);
      
      // If ID token verification fails, try as access token
      // Fetch user info from Google API
      const axios = require('axios');
      const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const userInfo = userInfoResponse.data;
      console.log('🔐 [AUTH SERVICE] ✅ Access token verified, user:', userInfo.email);
      return {
        googleId: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        profilePhoto: userInfo.picture
      };
    }
  } catch (error) {
    console.error('🔐 [AUTH SERVICE] ❌ Token verification failed:', error.message);
    console.error('🔐 [AUTH SERVICE] Error details:', error);
    throw new Error(`Invalid Google token: ${error.message}`);
  }
};

// Create or find user
const findOrCreateUser = async (googleUserData) => {
  let user = await User.findOne({ where: { google_id: googleUserData.googleId } });

  if (!user) {
    // Check if user exists with email
    user = await User.findOne({ where: { email: googleUserData.email } });
    
    if (user) {
      // Update with Google ID
      user.google_id = googleUserData.googleId;
      user.profile_photo = googleUserData.profilePhoto;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name: googleUserData.name,
        email: googleUserData.email,
        profile_photo: googleUserData.profilePhoto,
        google_id: googleUserData.googleId
      });

      // Initialize user points
      await UserPoints.create({
        user_id: user.user_id,
        total_points: 0,
        login_streak: 0
      });
    }
  } else {
    // Update profile photo if changed
    if (user.profile_photo !== googleUserData.profilePhoto) {
      user.profile_photo = googleUserData.profilePhoto;
      await user.save();
    }
  }

  return user;
};

// Update login streak
const updateLoginStreak = async (userId) => {
  const userPoints = await UserPoints.findOne({ where: { user_id: userId } });
  
  if (!userPoints) {
    return;
  }

  const now = new Date();
  const lastLogin = userPoints.last_login ? new Date(userPoints.last_login) : null;
  
  if (!lastLogin) {
    // First login
    userPoints.login_streak = 1;
    userPoints.last_login = now;
    await userPoints.save();
    return 1;
  }

  const diffHours = (now - lastLogin) / (1000 * 60 * 60);
  
  if (diffHours < 24) {
    // Same day login, no streak change
    return userPoints.login_streak;
  } else if (diffHours < 48) {
    // Next day login, increment streak
    userPoints.login_streak += 1;
    userPoints.last_login = now;
    await userPoints.save();
    return userPoints.login_streak;
  } else {
    // Streak broken
    userPoints.login_streak = 1;
    userPoints.last_login = now;
    await userPoints.save();
    return 1;
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = {
  verifyGoogleToken,
  findOrCreateUser,
  updateLoginStreak,
  generateToken
};

