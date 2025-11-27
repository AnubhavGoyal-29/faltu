/**
 * AdminJS Admin Panel Setup
 * 
 * Auto-generates admin dashboard from Sequelize models
 * Access at: /admin
 */

const AdminJS = require('adminjs');
const AdminJSSequelize = require('@adminjs/sequelize');
const AdminJSExpress = require('@adminjs/express');
const session = require('express-session');

// Import all models
const {
  User,
  ChatRoom,
  ChatMessage,
  LuckyDraw,
  UserPoints,
  ChaosEvent,
  TambolaRoom,
  TambolaTicket,
  BakchodiChallenge,
  Debate,
  MemeBattle,
  WheelSpin,
  FuturePrediction,
  TapGameScore,
  RunawayButtonWin,
  Dare,
  Roast,
  GameRoom,
  GameRoomUser,
  UserActivityTracking
} = require('../models');

// Register Sequelize adapter
AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

/**
 * Initialize Admin Panel
 * @param {Object} app - Express app instance
 * @param {Object} sequelize - Sequelize instance
 */
const initializeAdminPanel = (app, sequelize) => {
  // Configure AdminJS
  // Note: AdminJS v6 might have issues with custom rootPath, using /admin for compatibility
  const adminJs = new AdminJS({
    rootPath: '/admin',
    resources: [
      {
        resource: User,
        options: {
          listProperties: ['user_id', 'name', 'email', 'points', 'login_streak', 'created_at'],
          showProperties: ['user_id', 'name', 'email', 'google_id', 'profile_photo', 'points', 'login_streak', 'created_at', 'updated_at'],
          editProperties: ['name', 'email', 'points', 'login_streak'],
          filterProperties: ['name', 'email', 'points'],
          properties: {
            password: {
              isVisible: false, // Hide password field
            },
            google_id: {
              isVisible: { list: false, show: true, edit: false },
            },
          },
        },
      },
      {
        resource: ChatRoom,
        options: {
          listProperties: ['room_id', 'name', 'created_at', 'expires_at'],
        },
      },
      {
        resource: ChatMessage,
        options: {
          listProperties: ['message_id', 'room_id', 'user_id', 'message', 'created_at'],
        },
      },
      {
        resource: LuckyDraw,
        options: {
          listProperties: ['draw_id', 'winner_user_id', 'points_awarded', 'drawn_at'],
        },
      },
      {
        resource: UserPoints,
        options: {
          listProperties: ['points_id', 'user_id', 'points', 'reason', 'created_at'],
        },
      },
      {
        resource: ChaosEvent,
        options: {
          listProperties: ['event_id', 'triggered_by_user_id', 'event_type', 'created_at'],
        },
      },
      {
        resource: TambolaRoom,
        options: {
          listProperties: ['room_id', 'status', 'current_number', 'started_at', 'created_at'],
        },
      },
      {
        resource: TambolaTicket,
        options: {
          listProperties: ['ticket_id', 'room_id', 'user_id', 'has_won', 'created_at'],
        },
      },
      {
        resource: BakchodiChallenge,
        options: {
          listProperties: ['challenge_id', 'user_id', 'score', 'created_at'],
        },
      },
      {
        resource: Debate,
        options: {
          listProperties: ['debate_id', 'user_id', 'status', 'created_at'],
        },
      },
      {
        resource: MemeBattle,
        options: {
          listProperties: ['battle_id', 'user_id', 'score', 'created_at'],
        },
      },
      {
        resource: WheelSpin,
        options: {
          listProperties: ['spin_id', 'user_id', 'result', 'points_awarded', 'created_at'],
        },
      },
      {
        resource: FuturePrediction,
        options: {
          listProperties: ['prediction_id', 'user_id', 'prediction', 'created_at'],
        },
      },
      {
        resource: TapGameScore,
        options: {
          listProperties: ['score_id', 'user_id', 'score', 'created_at'],
        },
      },
      {
        resource: RunawayButtonWin,
        options: {
          listProperties: ['win_id', 'user_id', 'points_awarded', 'created_at'],
        },
      },
      {
        resource: Dare,
        options: {
          listProperties: ['dare_id', 'user_id', 'dare_text', 'created_at'],
        },
      },
      {
        resource: Roast,
        options: {
          listProperties: ['roast_id', 'user_id', 'roast_text', 'created_at'],
        },
      },
      {
        resource: GameRoom,
        options: {
          listProperties: ['game_room_id', 'game_type', 'status', 'created_at'],
        },
      },
      {
        resource: GameRoomUser,
        options: {
          listProperties: ['id', 'game_room_id', 'user_id', 'joined_at'],
        },
      },
      {
        resource: UserActivityTracking,
        options: {
          listProperties: ['activity_id', 'user_id', 'activity_type', 'created_at'],
        },
      },
    ],
    branding: {
      companyName: 'FaltuVerse Admin',
      logo: false,
      softwareBrothers: false,
      favicon: '🎲',
    },
    locale: {
      language: 'en',
      translations: {
        labels: {
          User: 'Users',
          ChatRoom: 'Chat Rooms',
          ChatMessage: 'Chat Messages',
          LuckyDraw: 'Lucky Draws',
          UserPoints: 'User Points',
          ChaosEvent: 'Chaos Events',
          TambolaRoom: 'Tambola Rooms',
          TambolaTicket: 'Tambola Tickets',
        },
      },
    },
  });

  // Create router WITHOUT authentication - simple query parameter check
  const adminRouter = AdminJSExpress.buildRouter(adminJs);

  // Add middleware to check for name query parameter
  // Only allow access if name=anubhav is in the URL
  app.use(adminJs.options.rootPath, (req, res, next) => {
    // Allow access if name=anubhav is in query params
    if (req.query.name === 'anubhav') {
      console.log(`✅ Admin access granted for: ${req.query.name}`);
      return next();
    }
    
    // Redirect to login page with error if name parameter is missing or wrong
    if (req.path === '/login' || req.path === '/') {
      // If accessing login page without correct name, show error
      if (!req.query.name || req.query.name !== 'anubhav') {
        return res.status(403).send(`
          <html>
            <head><title>Access Denied</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
              <h1>🔒 Access Denied</h1>
              <p>Please access admin panel with: <code>?name=anubhav</code></p>
              <p><a href="${adminJs.options.rootPath}?name=anubhav">Click here to access admin panel</a></p>
            </body>
          </html>
        `);
      }
    }
    
    // For all other routes, check the name parameter
    if (req.query.name !== 'anubhav') {
      return res.redirect(`${adminJs.options.rootPath}?name=anubhav`);
    }
    
    next();
  });

  // Mount admin panel router AFTER the middleware
  // IMPORTANT: Mount at rootPath - AdminJS router handles all sub-routes
  try {
    app.use(adminJs.options.rootPath, adminRouter);
    
    console.log(`🔗 Admin Panel mounted at: ${adminJs.options.rootPath}`);
    console.log(`✅ Admin Panel initialized (NO AUTH - Query param access only)`);
    console.log(`🔗 Access URL: https://faltuverse.cloud${adminJs.options.rootPath}?name=anubhav`);
  } catch (error) {
    console.error('❌ Admin Panel initialization error:', error);
    console.error('Error stack:', error.stack);
  }

  return adminJs;
};

module.exports = { initializeAdminPanel };

