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

// Get or create a random chat room
const getRandomRoom = async () => {
  // Get a random room or create a new one
  const roomCount = await ChatRoom.count();
  
  if (roomCount === 0) {
    // Create first room
    const randomName = funnyRoomNames[Math.floor(Math.random() * funnyRoomNames.length)];
    return await ChatRoom.create({ name: randomName });
  }

  // 30% chance to create a new room, 70% to join existing
  if (Math.random() < 0.3) {
    const randomName = funnyRoomNames[Math.floor(Math.random() * funnyRoomNames.length)];
    return await ChatRoom.create({ name: randomName });
  }

  // Get random existing room
  const randomOffset = Math.floor(Math.random() * roomCount);
  const room = await ChatRoom.findOne({
    offset: randomOffset,
    order: [['created_at', 'DESC']]
  });

  return room || await ChatRoom.create({ 
    name: funnyRoomNames[Math.floor(Math.random() * funnyRoomNames.length)] 
  });
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
  getRoomMessages
};

