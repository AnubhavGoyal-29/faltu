const { TambolaRoom, TambolaTicket, User } = require('../models');
const { addPoints } = require('./pointsService');

// Generate a random tambola ticket (3x3 grid with 9 numbers)
const generateTicket = () => {
  // Create 3x3 grid
  const ticket = Array(3).fill(null).map(() => Array(3).fill(null));
  const usedNumbers = new Set();
  
  // Generate 9 unique random numbers between 1-90
  const numbers = [];
  while (numbers.length < 9) {
    const num = Math.floor(Math.random() * 90) + 1;
    if (!usedNumbers.has(num)) {
      usedNumbers.add(num);
      numbers.push(num);
    }
  }
  
  // Shuffle numbers
  numbers.sort(() => Math.random() - 0.5);
  
  // Fill ticket with numbers
  let index = 0;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      ticket[row][col] = numbers[index++];
    }
  }
  
  return ticket;
};

// Check if a row is complete (3x3 grid)
const checkRowComplete = (ticket, markedNumbers, rowIndex) => {
  const row = ticket[rowIndex];
  return row.every(cell => cell !== null && markedNumbers.includes(cell));
};

// Check if a column is complete (3x3 grid)
const checkColumnComplete = (ticket, markedNumbers, colIndex) => {
  for (let row = 0; row < 3; row++) {
    if (ticket[row][colIndex] === null || !markedNumbers.includes(ticket[row][colIndex])) {
      return false;
    }
  }
  return true;
};

// Check if full house (all 9 numbers marked)
const checkFullHouse = (ticket, markedNumbers) => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (ticket[row][col] === null || !markedNumbers.includes(ticket[row][col])) {
        return false;
      }
    }
  }
  return true;
};

// Create a new tambola room
const createTambolaRoom = async () => {
  try {
    const now = new Date();
    const registrationEndTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
    
    const room = await TambolaRoom.create({
      status: 'waiting',
      called_numbers: [],
      current_number: null,
      registration_end_at: registrationEndTime
    });
    
    console.log(`🎲 [TAMBOLA] Room ${room.room_id} create ho gaya! Registration ends at: ${registrationEndTime.toISOString()}`);
    return room;
  } catch (error) {
    console.error('🎲 [TAMBOLA] Room create error:', error);
    throw error;
  }
};

// Register user for tambola room
const registerUser = async (roomId, userId) => {
  try {
    // Check if user already registered
    const existingTicket = await TambolaTicket.findOne({
      where: { room_id: roomId, user_id: userId }
    });
    
    if (existingTicket) {
      return { success: false, message: 'Pehle se registered ho!' };
    }
    
    // Check room status
    const room = await TambolaRoom.findByPk(roomId);
    if (!room) {
      return { success: false, message: 'Room nahi mila!' };
    }
    
    if (room.status !== 'waiting') {
      return { success: false, message: 'Game already start ho chuki hai!' };
    }
    
    // Generate ticket
    const ticketNumbers = generateTicket();
    
    // Create ticket
    const ticket = await TambolaTicket.create({
      room_id: roomId,
      user_id: userId,
      ticket_numbers: ticketNumbers,
      marked_numbers: [],
      completed_rows: []
    });
    
    console.log(`🎲 [TAMBOLA] User ${userId} registered in room ${roomId}`);
    return { success: true, ticket };
  } catch (error) {
    console.error('🎲 [TAMBOLA] Register error:', error);
    return { success: false, message: 'Registration failed' };
  }
};

// Get user's ticket
const getUserTicket = async (roomId, userId) => {
  try {
    const ticket = await TambolaTicket.findOne({
      where: { room_id: roomId, user_id: userId },
      include: [{ model: User, as: 'user' }]
    });
    
    return ticket;
  } catch (error) {
    console.error('🎲 [TAMBOLA] Get ticket error:', error);
    return null;
  }
};

// Get all registered users for a room
const getRegisteredUsers = async (roomId) => {
  try {
    const tickets = await TambolaTicket.findAll({
      where: { room_id: roomId },
      include: [{ model: User, as: 'user', attributes: ['user_id', 'name', 'profile_photo'] }]
    });
    
    return tickets.map(t => ({
      user_id: t.user_id,
      name: t.user.name,
      profile_photo: t.user.profile_photo
    }));
  } catch (error) {
    console.error('🎲 [TAMBOLA] Get users error:', error);
    return [];
  }
};

// Start tambola game
const startTambolaGame = async (roomId) => {
  try {
    const room = await TambolaRoom.findByPk(roomId);
    if (!room) {
      console.log(`🎲 [TAMBOLA] Room ${roomId} not found`);
      return { success: false, message: 'Room nahi mila' };
    }
    
    if (room.status !== 'waiting') {
      console.log(`🎲 [TAMBOLA] Room ${roomId} status is ${room.status}, cannot start`);
      return { success: false, message: `Room status is ${room.status}, cannot start` };
    }
    
    // Check if at least 1 player (system users are already added)
    const ticketCount = await TambolaTicket.count({ where: { room_id: roomId } });
    console.log(`🎲 [TAMBOLA] Room ${roomId} has ${ticketCount} tickets`);
    
    if (ticketCount < 1) {
      console.log(`🎲 [TAMBOLA] Not enough players (${ticketCount}), cannot start game`);
      return { success: false, message: 'Kam se kam 1 player chahiye!' };
    }
    
    // Update room status
    await room.update({
      status: 'active',
      started_at: new Date(),
      completed_win_types: [] // Reset win types for new game
    });
    
    console.log(`🎲 [TAMBOLA] Room ${roomId} start ho gaya! ${ticketCount} players registered.`);
    return { success: true, room };
  } catch (error) {
    console.error('🎲 [TAMBOLA] Start game error:', error);
    return { success: false, message: 'Game start nahi hui: ' + error.message };
  }
};

// Call next number
const callNextNumber = async (roomId) => {
  try {
    const room = await TambolaRoom.findByPk(roomId);
    if (!room || room.status !== 'active') {
      return { success: false, message: 'Game active nahi hai' };
    }
    
    const calledNumbers = room.called_numbers || [];
    const availableNumbers = [];
    
    // Generate available numbers (1-90)
    for (let i = 1; i <= 90; i++) {
      if (!calledNumbers.includes(i)) {
        availableNumbers.push(i);
      }
    }
    
    if (availableNumbers.length === 0) {
      return { success: false, message: 'Sab numbers call ho chuke hain!' };
    }
    
    // Pick random number
    const nextNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    const newCalledNumbers = [...calledNumbers, nextNumber];
    
    await room.update({
      called_numbers: newCalledNumbers,
      current_number: nextNumber
    });
    
    console.log(`🎲 [TAMBOLA] Number called: ${nextNumber}`);
    
    // Check for winners and update tickets
    const { winners, updatedTickets } = await checkWinners(roomId, newCalledNumbers);
    
    return { 
      success: true, 
      number: nextNumber, 
      calledNumbers: newCalledNumbers, 
      winners,
      updatedTickets
    };
  } catch (error) {
    console.error('🎲 [TAMBOLA] Call number error:', error);
    return { success: false, message: 'Number call nahi hua' };
  }
};

// Check for winners - only FIRST person to complete each win type wins
const checkWinners = async (roomId, calledNumbers) => {
  try {
    // Get room to check completed win types
    const room = await TambolaRoom.findByPk(roomId);
    if (!room) {
      return { winners: [], updatedTickets: [] };
    }
    
    const completedWinTypes = room.completed_win_types || [];
    const newCompletedWinTypes = [...completedWinTypes];
    const winners = [];
    const updatedTickets = [];
    
    // Get all tickets
    const tickets = await TambolaTicket.findAll({
      where: { room_id: roomId },
      include: [{ model: User, as: 'user' }],
      order: [['ticket_id', 'ASC']] // Process in order to determine first winner
    });
    
    for (const ticket of tickets) {
      const ticketNumbers = ticket.ticket_numbers;
      const markedNumbers = ticket.marked_numbers || [];
      const completedRows = ticket.completed_rows || [];
      const completedColumns = ticket.completed_columns || [];
      
      // Update marked numbers (3x3 grid)
      const newMarkedNumbers = [...markedNumbers];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const num = ticketNumbers[row][col];
          if (num !== null && calledNumbers.includes(num) && !newMarkedNumbers.includes(num)) {
            newMarkedNumbers.push(num);
          }
        }
      }
      
      // Check for row, column, and full house completion
      const newCompletedRows = [...completedRows];
      const newCompletedColumns = [...completedColumns];
      
      // Check rows (row 1, row 2, row 3) - only if not already won
      for (let row = 0; row < 3; row++) {
        const winTypeKey = `row_${row + 1}`;
        if (!completedWinTypes.includes(winTypeKey) && 
            !completedRows.includes(`row_${row}`) && 
            checkRowComplete(ticketNumbers, newMarkedNumbers, row)) {
          // First person to complete this row wins
          newCompletedRows.push(`row_${row}`);
          newCompletedWinTypes.push(winTypeKey);
          
          winners.push({
            user_id: ticket.user_id,
            name: ticket.user.name,
            win_type: `Row ${row + 1}`,
            ticket_id: ticket.ticket_id
          });
          
          // Award points
          await addPoints(ticket.user_id, 200, 'tambola_win', ticket.user, {
            room_id: roomId,
            win_type: `Row ${row + 1}`
          });
        }
      }
      
      // Check columns (col 1, col 2, col 3) - only if not already won
      for (let col = 0; col < 3; col++) {
        const winTypeKey = `col_${col + 1}`;
        if (!completedWinTypes.includes(winTypeKey) && 
            !completedColumns.includes(`col_${col}`) && 
            checkColumnComplete(ticketNumbers, newMarkedNumbers, col)) {
          // First person to complete this column wins
          newCompletedColumns.push(`col_${col}`);
          newCompletedWinTypes.push(winTypeKey);
          
          winners.push({
            user_id: ticket.user_id,
            name: ticket.user.name,
            win_type: `Column ${col + 1}`,
            ticket_id: ticket.ticket_id
          });
          
          // Award points
          await addPoints(ticket.user_id, 200, 'tambola_win', ticket.user, {
            room_id: roomId,
            win_type: `Column ${col + 1}`
          });
        }
      }
      
      // Check full house - only if not already won
      if (!completedWinTypes.includes('full_house') && 
          !completedRows.includes('full_house') && 
          checkFullHouse(ticketNumbers, newMarkedNumbers)) {
        // First person to complete full house wins
        newCompletedRows.push('full_house');
        newCompletedWinTypes.push('full_house');
        
        winners.push({
          user_id: ticket.user_id,
          name: ticket.user.name,
          win_type: 'Full House',
          ticket_id: ticket.ticket_id
        });
        
        // Award points
        await addPoints(ticket.user_id, 500, 'tambola_win', ticket.user, {
          room_id: roomId,
          win_type: 'Full House'
        });
      }
      
      // Update ticket with new marked numbers and completions
      await ticket.update({
        marked_numbers: newMarkedNumbers,
        completed_rows: newCompletedRows,
        completed_columns: newCompletedColumns,
        has_won: (newCompletedRows.length > 0) || (newCompletedColumns.length > 0)
      });
      
      // Add to updated tickets for socket broadcast
      updatedTickets.push({
        user_id: ticket.user_id,
        ticket_id: ticket.ticket_id,
        ticket_numbers: ticketNumbers,
        marked_numbers: newMarkedNumbers,
        completed_rows: newCompletedRows,
        completed_columns: newCompletedColumns,
        has_won: (newCompletedRows.length > 0) || (newCompletedColumns.length > 0)
      });
    }
    
    // Update room with completed win types
    if (newCompletedWinTypes.length > completedWinTypes.length) {
      await room.update({
        completed_win_types: newCompletedWinTypes
      });
    }
    
    return { winners, updatedTickets };
  } catch (error) {
    console.error('🎲 [TAMBOLA] Check winners error:', error);
    return { winners: [], updatedTickets: [] };
  }
};

// Complete game and declare winner
const completeGame = async (roomId, winnerUserId) => {
  try {
    const room = await TambolaRoom.findByPk(roomId);
    if (!room) {
      return { success: false, message: 'Room nahi mila' };
    }
    
    await room.update({
      status: 'completed',
      winner_user_id: winnerUserId,
      completed_at: new Date()
    });
    
    console.log(`🎲 [TAMBOLA] Room ${roomId} complete! Winner: ${winnerUserId}`);
    return { success: true };
  } catch (error) {
    console.error('🎲 [TAMBOLA] Complete game error:', error);
    return { success: false };
  }
};

// Get active room (waiting or active) - only one should exist
const getActiveRoom = async () => {
  try {
    // First check for waiting room
    let room = await TambolaRoom.findOne({
      where: { status: 'waiting' },
      order: [['created_at', 'DESC']]
    });
    
    // If no waiting room, check for active room
    if (!room) {
      room = await TambolaRoom.findOne({
        where: { status: 'active' },
        order: [['created_at', 'DESC']]
      });
    }
    
    return room;
  } catch (error) {
    console.error('🎲 [TAMBOLA] Get active room error:', error);
    return null;
  }
};

// Get leaderboard (users who completed rows, columns, or full house)
const getLeaderboard = async (roomId) => {
  try {
    const tickets = await TambolaTicket.findAll({
      where: { room_id: roomId },
      include: [{ model: User, as: 'user', attributes: ['user_id', 'name', 'profile_photo'] }]
    });
    
    const leaderboard = {
      rows: [],
      columns: [],
      fullHouse: []
    };
    
    for (const ticket of tickets) {
      const completedRows = ticket.completed_rows || [];
      const completedColumns = ticket.completed_columns || [];
      
      // Add row completions
      completedRows.forEach(row => {
        if (row !== 'full_house') {
          leaderboard.rows.push({
            user_id: ticket.user_id,
            name: ticket.user.name,
            profile_photo: ticket.user.profile_photo,
            completion: row
          });
        }
      });
      
      // Add column completions
      completedColumns.forEach(col => {
        leaderboard.columns.push({
          user_id: ticket.user_id,
          name: ticket.user.name,
          profile_photo: ticket.user.profile_photo,
          completion: col
        });
      });
      
      // Add full house
      if (completedRows.includes('full_house')) {
        leaderboard.fullHouse.push({
          user_id: ticket.user_id,
          name: ticket.user.name,
          profile_photo: ticket.user.profile_photo
        });
      }
    }
    
    return leaderboard;
  } catch (error) {
    console.error('🎲 [TAMBOLA] Get leaderboard error:', error);
    return { rows: [], columns: [], fullHouse: [] };
  }
};

// Get last round winners (from most recent completed game) - only unique winners per win type
const getLastRoundWinners = async () => {
  try {
    const lastCompletedRoom = await TambolaRoom.findOne({
      where: { status: 'completed' },
      order: [['completed_at', 'DESC']]
    });
    
    if (!lastCompletedRoom) {
      return null;
    }
    
    const completedWinTypes = lastCompletedRoom.completed_win_types || [];
    
    if (completedWinTypes.length === 0) {
      return {
        rows: [],
        columns: [],
        fullHouse: [],
        room_id: lastCompletedRoom.room_id
      };
    }
    
    // Get all tickets that won
    const tickets = await TambolaTicket.findAll({
      where: { 
        room_id: lastCompletedRoom.room_id,
        has_won: true
      },
      include: [{ model: User, as: 'user', attributes: ['user_id', 'name', 'profile_photo'] }],
      order: [['ticket_id', 'ASC']] // Process in order to find first winner
    });
    
    const winners = {
      rows: [],
      columns: [],
      fullHouse: [],
      room_id: lastCompletedRoom.room_id
    };
    
    // Map to track which win type we've already found a winner for
    const foundWinTypes = new Set();
    
    // Process tickets in order to find first winner of each type
    for (const ticket of tickets) {
      const completedRows = ticket.completed_rows || [];
      const completedColumns = ticket.completed_columns || [];
      
      // Check rows (row_1, row_2, row_3)
      for (let row = 0; row < 3; row++) {
        const winTypeKey = `row_${row + 1}`;
        if (completedWinTypes.includes(winTypeKey) && 
            !foundWinTypes.has(winTypeKey) && 
            completedRows.includes(`row_${row}`)) {
          winners.rows.push({
            user_id: ticket.user_id,
            name: ticket.user.name,
            profile_photo: ticket.user.profile_photo,
            completion: `row_${row}`
          });
          foundWinTypes.add(winTypeKey);
        }
      }
      
      // Check columns (col_1, col_2, col_3)
      for (let col = 0; col < 3; col++) {
        const winTypeKey = `col_${col + 1}`;
        if (completedWinTypes.includes(winTypeKey) && 
            !foundWinTypes.has(winTypeKey) && 
            completedColumns.includes(`col_${col}`)) {
          winners.columns.push({
            user_id: ticket.user_id,
            name: ticket.user.name,
            profile_photo: ticket.user.profile_photo,
            completion: `col_${col}`
          });
          foundWinTypes.add(winTypeKey);
        }
      }
      
      // Check full house
      if (completedWinTypes.includes('full_house') && 
          !foundWinTypes.has('full_house') && 
          completedRows.includes('full_house')) {
        winners.fullHouse.push({
          user_id: ticket.user_id,
          name: ticket.user.name,
          profile_photo: ticket.user.profile_photo
        });
        foundWinTypes.add('full_house');
      }
    }
    
    return winners;
  } catch (error) {
    console.error('🎲 [TAMBOLA] Get last round winners error:', error);
    return null;
  }
};

module.exports = {
  createTambolaRoom,
  registerUser,
  getUserTicket,
  getRegisteredUsers,
  startTambolaGame,
  callNextNumber,
  completeGame,
  getActiveRoom,
  getLeaderboard,
  getLastRoundWinners,
  generateTicket
};

