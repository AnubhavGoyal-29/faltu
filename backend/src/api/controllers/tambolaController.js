const {
  createTambolaRoom,
  registerUser,
  getUserTicket,
  getRegisteredUsers,
  startTambolaGame,
  callNextNumber,
  completeGame,
  getActiveRoom,
  getLeaderboard,
  getLastRoundWinners
} = require('../../services/tambolaService');
const { User } = require('../../models');

// Get or create active room - DO NOT CREATE NEW ROOM, only return existing
const getOrCreateRoom = async (req, res) => {
  try {
    // Only get existing room, don't create new one (cron handles creation)
    let room = await getActiveRoom();
    
    if (!room) {
      // No room exists, return waiting state
      return res.json({
        success: true,
        room: null,
        message: 'No active tambola game. Please wait for registration to start.'
      });
    }
    
    const registeredUsers = await getRegisteredUsers(room.room_id);
    
    // Calculate registration time remaining
    let registrationTimeRemaining = 0;
    if (room.status === 'waiting' && room.registration_end_at) {
      const now = new Date();
      const endTime = new Date(room.registration_end_at);
      registrationTimeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
    }
    
    // Calculate next number call time if game is active
    let nextNumberCallTime = null;
    let secondsUntilNext = 0;
    
    if (room.status === 'active') {
      // Get next call time from cron module
      const tambolaCron = require('../../cron/tambolaCron');
      const cronNextCallTime = tambolaCron.getNextNumberCallTime();
      
      if (cronNextCallTime) {
        const now = new Date();
        const nextCall = new Date(cronNextCallTime);
        secondsUntilNext = Math.max(0, Math.floor((nextCall - now) / 1000));
        nextNumberCallTime = cronNextCallTime;
      } else {
        // Fallback: calculate from last number call (5 seconds interval)
        // If we have a current_number, assume next call is in 5 seconds
        if (room.current_number) {
          secondsUntilNext = 5;
          nextNumberCallTime = new Date(Date.now() + 5000).toISOString();
        }
      }
    }
    
    res.json({
      success: true,
      room: {
        room_id: room.room_id,
        status: room.status,
        called_numbers: room.called_numbers || [],
        current_number: room.current_number,
        started_at: room.started_at,
        created_at: room.created_at,
        registration_end_at: room.registration_end_at,
        registration_time_remaining: registrationTimeRemaining, // seconds
        registered_users: registeredUsers,
        next_number_call_at: nextNumberCallTime,
        seconds_until_next_number: secondsUntilNext
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

// Get leaderboard
const getLeaderboardData = async (req, res) => {
  try {
    const { room_id } = req.params;
    const leaderboard = await getLeaderboard(room_id);
    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('🎲 [TAMBOLA] Get leaderboard error:', error);
    res.status(500).json({ success: false, error: 'Leaderboard fetch nahi hua' });
  }
};

// Get last round winners
const getLastWinners = async (req, res) => {
  try {
    const winners = await getLastRoundWinners();
    res.json({ success: true, winners });
  } catch (error) {
    console.error('🎲 [TAMBOLA] Get last winners error:', error);
    res.status(500).json({ success: false, error: 'Winners fetch nahi huye' });
  }
};

module.exports = {
  getOrCreateRoom,
  register,
  getTicket,
  getUsers,
  getLeaderboardData,
  getLastWinners
};

