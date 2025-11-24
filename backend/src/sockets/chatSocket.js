const { getRandomRoom, saveMessage, getRoomMessages } = require('../services/chatService');
const { addPoints } = require('../services/pointsService');
const { User, ChatRoom } = require('../models');
const jwt = require('jsonwebtoken');
const { processChatRoomForAI } = require('../services/aiChatBot');

// Authenticate socket connection
const authenticateSocket = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};

// Initialize chat socket
const initializeChatSocket = (io) => {
  // Authentication middleware
  io.use(authenticateSocket);

  io.on('connection', async (socket) => {
    console.log(`User ${socket.userId} connected to chat`);

    let currentRoom = null;

    // Join a random room
    socket.on('join_random_room', async () => {
      try {
        const room = await getRandomRoom();
        currentRoom = room;

        // Leave previous room if any
        if (socket.roomId) {
          socket.leave(`room_${socket.roomId}`);
        }

        // Join new room
        socket.roomId = room.room_id;
        socket.join(`room_${room.room_id}`);

        // Get room messages
        const messages = await getRoomMessages(room.room_id);
        
        // Get user info
        const user = await User.findByPk(socket.userId);

        socket.emit('room_joined', {
          room: {
            room_id: room.room_id,
            name: room.name
          },
          messages: messages.reverse().map(msg => ({
            message_id: msg.message_id,
            message: msg.message,
            user: {
              user_id: msg.user.user_id,
              name: msg.user.name,
              profile_photo: msg.user.profile_photo
            },
            created_at: msg.created_at
          }))
        });

        // Notify others in room
        socket.to(`room_${room.room_id}`).emit('user_joined', {
          user: {
            user_id: user.user_id,
            name: user.name
          }
        });
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        if (!socket.roomId || !data.message) {
          return socket.emit('error', { message: 'Invalid message or not in a room' });
        }

        // Save message
        const savedMessage = await saveMessage(socket.roomId, socket.userId, data.message);

        // Get user info
        const user = await User.findByPk(socket.userId);

        // Award points for sending message (5 points per message) - with AI suggestion
        await addPoints(socket.userId, 5, 'chat_message', user, { room_id: socket.roomId });

        // Broadcast message to room
        const messageData = {
          message_id: savedMessage.message_id,
          message: savedMessage.message,
          user: {
            user_id: user.user_id,
            name: user.name,
            profile_photo: user.profile_photo
          },
          created_at: savedMessage.created_at
        };

        io.to(`room_${socket.roomId}`).emit('new_message', messageData);

        // Trigger AI chat bot processing (non-blocking, delayed)
        setTimeout(async () => {
          try {
            // Get current room name
            const currentRoomData = await ChatRoom.findByPk(socket.roomId);
            await processChatRoomForAI(socket.roomId, currentRoomData?.name || 'Unknown Room', io);
          } catch (error) {
            console.error('AI chat processing error:', error);
          }
        }, 2000);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected from chat`);
      if (socket.roomId) {
        socket.leave(`room_${socket.roomId}`);
      }
    });
  });
};

module.exports = { initializeChatSocket };

