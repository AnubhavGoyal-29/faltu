/**
 * AdminJS Admin Panel Setup
 * 
 * Auto-generates admin dashboard from Sequelize models
 * Access at: /admin
 */

const AdminJS = require('adminjs');
const AdminJSSequelize = require('@adminjs/sequelize');
const AdminJSExpress = require('@adminjs/express');

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

  // Create router with authentication
  // AdminJS v6: buildAuthenticatedRouter uses rootPath from adminJs instance
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: async (email, password) => {
        console.log(`🔐 Admin login attempt: email=${email}, password=${password ? '***' : 'missing'}`);
        // Check admin credentials
        if (email === 'admin' && password === 'admin123') {
          console.log('✅ Admin authentication successful');
          return { email: 'admin', role: 'admin' };
        }
        console.log(`❌ Admin authentication failed for email: ${email}`);
        return null;
      },
      cookieName: 'adminjs',
      cookiePassword: process.env.ADMINJS_SECRET || 'faltuverse-admin-secret-key-change-in-production',
    },
    null,
    {
      resave: true,
      saveUninitialized: true,
      secret: process.env.ADMINJS_SECRET || 'faltuverse-admin-secret-key-change-in-production',
      name: 'adminjs',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/', // Root path so cookie works for all admin routes
      },
    }
  );

  // Mount admin panel router
  // IMPORTANT: Mount at rootPath - AdminJS router handles all sub-routes including /login
  try {
    app.use(adminJs.options.rootPath, adminRouter);
    
    console.log(`🔗 Admin Panel mounted at: ${adminJs.options.rootPath}`);
    console.log(`🔗 Login URL: http://localhost:${process.env.PORT || 5000}${adminJs.options.rootPath}/login`);

    console.log(`✅ Admin Panel initialized at: http://localhost:${process.env.PORT || 5000}${adminJs.options.rootPath}`);
    console.log(`🔐 Login with: admin / admin123`);
  } catch (error) {
    console.error('❌ Admin Panel initialization error:', error);
    console.error('Error stack:', error.stack);
  }

  return adminJs;
};

module.exports = { initializeAdminPanel };

