const { User, ChatRoom, TambolaRoom, TambolaTicket } = require('../models');
const { registerUser } = require('./tambolaService');
const { getRandomRoom } = require('./chatService');

// System user names (fun Hinglish names)
const SYSTEM_USER_NAMES = [
  'Bakchod Bot', 'Faltu Master', 'Chaos King', 'Masti Machine',
  'Random Rascal', 'Funny Fellow', 'Crazy Comrade', 'Silly Sam',
  'Joker Junior', 'Laugh Lord', 'Giggles Guru', 'Chuckle Champ'
];

// Create system users if they don't exist
const createSystemUsers = async () => {
  try {
    const systemUsers = [];
    
    for (const name of SYSTEM_USER_NAMES) {
      const email = `${name.toLowerCase().replace(/\s+/g, '')}@system.faltuverse.com`;
      
      let user = await User.findOne({ where: { email } });
      
      if (!user) {
        user = await User.create({
          name,
          email,
          google_id: `system_${Date.now()}_${Math.random()}`
        });
        console.log(`🤖 [SYSTEM] User created: ${name}`);
      }
      
      systemUsers.push(user);
    }
    
    console.log(`🤖 [SYSTEM] Total ${systemUsers.length} system users ready!`);
    return systemUsers;
  } catch (error) {
    console.error('🤖 [SYSTEM] Create users error:', error);
    return [];
  }
};

// Auto-join system users to chat rooms
const joinSystemUsersToChatRooms = async () => {
  try {
    const systemUsers = await User.findAll({
      where: {
        email: {
          [require('sequelize').Op.like]: '%@system.faltuverse.com'
        }
      },
      limit: 5
    });
    
    // Get or create random rooms for system users
    for (const user of systemUsers) {
      try {
        await getRandomRoom(); // This ensures rooms exist
      } catch (err) {
        // Ignore errors
      }
    }
    
    console.log(`🤖 [SYSTEM] System users ready for chat rooms`);
  } catch (error) {
    console.error('🤖 [SYSTEM] Join chat rooms error:', error);
  }
};

// Auto-join system users to tambola room
const joinSystemUsersToTambola = async (roomId) => {
  try {
    const systemUsers = await User.findAll({
      where: {
        email: {
          [require('sequelize').Op.like]: '%@system.faltuverse.com'
        }
      },
      limit: 5 // Join max 5 system users
    });
    
    for (const user of systemUsers) {
      try {
        await registerUser(roomId, user.user_id);
        console.log(`🤖 [SYSTEM] ${user.name} joined tambola room ${roomId}`);
      } catch (err) {
        // Ignore if already registered
      }
    }
    
    console.log(`🤖 [SYSTEM] ${systemUsers.length} system users joined tambola room ${roomId}`);
  } catch (error) {
    console.error('🤖 [SYSTEM] Join tambola error:', error);
  }
};

module.exports = {
  createSystemUsers,
  joinSystemUsersToChatRooms,
  joinSystemUsersToTambola
};

