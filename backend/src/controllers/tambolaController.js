const {
  createTambolaRoom,
  registerUser,
  getUserTicket,
  getRegisteredUsers,
  startTambolaGame,
  callNextNumber,
  completeGame,
  getActiveRoom
} = require('../services/tambolaService');
const { User } = require('../models');

// Get or create active room
const getOrCreateRoom = async (req, res) => {
  try {
    let room = await getActiveRoom();
    
    if (!room) {
      room = await createTambolaRoom();
    }
    
    const registeredUsers = await getRegisteredUsers(room.room_id);
    
    res.json({
      success: true,
      room: {
        room_id: room.room_id,
        status: room.status,
        called_numbers: room.called_numbers || [],
        current_number: room.current_number,
        started_at: room.started_at,
        registered_users: registeredUsers
      }
    });
  } catch (error) {
    console.error('🎲 [TAMBOLA] Get room error:', error);
    res.status(500).json({ success: false, error: 'Room fetch nahi hua' });
  }
};

// Register user for tambola
const register = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { room_id } = req.body;
    
    const result = await registerUser(room_id, userId);
    
    if (result.success) {
      const registeredUsers = await getRegisteredUsers(room_id);
      res.json({
        success: true,
        ticket: result.ticket,
        registered_users: registeredUsers
      });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('🎲 [TAMBOLA] Register error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

// Get user's ticket
const getTicket = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { room_id } = req.params;
    
    const ticket = await getUserTicket(room_id, userId);
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket nahi mila' });
    }
    
    res.json({
      success: true,
      ticket: {
        ticket_id: ticket.ticket_id,
        ticket_numbers: ticket.ticket_numbers,
        marked_numbers: ticket.marked_numbers || [],
        completed_rows: ticket.completed_rows || [],
        has_won: ticket.has_won
      }
    });
  } catch (error) {
    console.error('🎲 [TAMBOLA] Get ticket error:', error);
    res.status(500).json({ success: false, error: 'Ticket fetch nahi hua' });
  }
};

// Get registered users
const getUsers = async (req, res) => {
  try {
    const { room_id } = req.params;
    const users = await getRegisteredUsers(room_id);
    res.json({ success: true, users });
  } catch (error) {
    console.error('🎲 [TAMBOLA] Get users error:', error);
    res.status(500).json({ success: false, error: 'Users fetch nahi huye' });
  }
};

module.exports = {
  getOrCreateRoom,
  register,
  getTicket,
  getUsers
};

