const { ChatRoom, ChatMessage, User } = require('../models');

// Generate random funny room names
const funnyRoomNames = [
  "The Nonsense Lounge",
  "Random Ramblings Room",
  "Chaos Central",
  "Pointless Paradise",
  "Faltu Fun Zone",
  "The Absurd Abode",
  "Random Rants Room",
  "Nonsense Nexus",
  "Chaos Chamber",
  "The Silly Sanctuary",
  "Random Reality Room",
  "Faltu Fantasy Land",
  "The Wacky Warehouse",
  "Pointless Party Place",
  "Random Rendezvous"
];

// Clean up expired rooms (older than 10 minutes)
const cleanupExpiredRooms = async () => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  
  const expiredRooms = await ChatRoom.findAll({
    where: {
      created_at: {
        [require('sequelize').Op.lt]: tenMinutesAgo
      }
    }
  });

  for (const room of expiredRooms) {
    // Delete all messages in the room first
    await require('../models').ChatMessage.destroy({
      where: { room_id: room.room_id }
    });
    // Then delete the room
    await room.destroy();
  }

  if (expiredRooms.length > 0) {
    console.log(`🗑️ [CHAT] ${expiredRooms.length} expired rooms cleanup ho gaye`);
  }
};

// Get or create a random active chat room (max 10 minutes old)
const getRandomRoom = async () => {
  // Clean up expired rooms first
  await cleanupExpiredRooms();

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  
  // Get active rooms (created in last 10 minutes)
  const activeRooms = await ChatRoom.findAll({
    where: {
      created_at: {
        [require('sequelize').Op.gte]: tenMinutesAgo
      }
    },
    order: [['created_at', 'DESC']]
  });

  // If no active rooms, create a new one
  if (activeRooms.length === 0) {
    const randomName = funnyRoomNames[Math.floor(Math.random() * funnyRoomNames.length)];
    console.log(`💬 [CHAT] Naya room create kiya: ${randomName}`);
    return await ChatRoom.create({ name: randomName });
  }

  // 20% chance to create new room, 80% to join random existing
  if (Math.random() < 0.2) {
    const randomName = funnyRoomNames[Math.floor(Math.random() * funnyRoomNames.length)];
    console.log(`💬 [CHAT] Naya room create kiya: ${randomName}`);
    return await ChatRoom.create({ name: randomName });
  }

  // Get random active room
  const randomRoom = activeRooms[Math.floor(Math.random() * activeRooms.length)];
  console.log(`💬 [CHAT] Random active room join kiya: ${randomRoom.name}`);
  return randomRoom;
};

// Save chat message
const saveMessage = async (roomId, userId, message) => {
  return await ChatMessage.create({
    room_id: roomId,
    user_id: userId,
    message: message
  });
};

// Get room messages
const getRoomMessages = async (roomId, limit = 50) => {
  return await ChatMessage.findAll({
    where: { room_id: roomId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['user_id', 'name', 'profile_photo']
    }],
    order: [['created_at', 'DESC']],
    limit: limit
  });
};

module.exports = {
  getRandomRoom,
  saveMessage,
  getRoomMessages,
  cleanupExpiredRooms
};

