const { TambolaRoom, TambolaTicket, User } = require('../models');
const { addPoints } = require('./pointsService');

// Generate a random tambola ticket (3 rows x 9 columns)
const generateTicket = () => {
  const ticket = Array(3).fill(null).map(() => Array(9).fill(null));
  const usedNumbers = new Set();
  
  // Each row should have exactly 5 numbers
  for (let row = 0; row < 3; row++) {
    const rowNumbers = [];
    const columnRanges = [
      [1, 9], [10, 19], [20, 29], [30, 39], [40, 49],
      [50, 59], [60, 69], [70, 79], [80, 90]
    ];
    
    // Shuffle column ranges
    const shuffledColumns = [...columnRanges].sort(() => Math.random() - 0.5);
    
    // Pick 5 columns for this row
    const selectedColumns = shuffledColumns.slice(0, 5);
    
    for (const [min, max] of selectedColumns) {
      let num;
      let attempts = 0;
      do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
        attempts++;
      } while (usedNumbers.has(num) && attempts < 50);
      
      if (!usedNumbers.has(num)) {
        rowNumbers.push({ col: columnRanges.findIndex(([m, M]) => m <= num && num <= M), num });
        usedNumbers.add(num);
      }
    }
    
    // Place numbers in ticket
    rowNumbers.forEach(({ col, num }) => {
      ticket[row][col] = num;
    });
  }
  
  return ticket;
};

// Check if a row is complete
const checkRowComplete = (ticket, markedNumbers, rowIndex) => {
  const row = ticket[rowIndex];
  return row.every(cell => cell === null || markedNumbers.includes(cell));
};

// Check if a column is complete
const checkColumnComplete = (ticket, markedNumbers, colIndex) => {
  for (let row = 0; row < 3; row++) {
    if (ticket[row][colIndex] !== null && !markedNumbers.includes(ticket[row][colIndex])) {
      return false;
    }
  }
  return true;
};

// Check if full house (all numbers marked)
const checkFullHouse = (ticket, markedNumbers) => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 9; col++) {
      if (ticket[row][col] !== null && !markedNumbers.includes(ticket[row][col])) {
        return false;
      }
    }
  }
  return true;
};

// Create a new tambola room
const createTambolaRoom = async () => {
  try {
    const room = await TambolaRoom.create({
      status: 'waiting',
      called_numbers: [],
      current_number: null
    });
    
    console.log(`🎲 [TAMBOLA] Room ${room.room_id} create ho gaya!`);
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
    if (!room || room.status !== 'waiting') {
      return { success: false, message: 'Room start nahi kar sakta' };
    }
    
    // Check if at least 2 players
    const ticketCount = await TambolaTicket.count({ where: { room_id: roomId } });
    if (ticketCount < 2) {
      return { success: false, message: 'Kam se kam 2 players chahiye!' };
    }
    
    // Update room status
    await room.update({
      status: 'active',
      started_at: new Date()
    });
    
    console.log(`🎲 [TAMBOLA] Room ${roomId} start ho gaya!`);
    return { success: true, room };
  } catch (error) {
    console.error('🎲 [TAMBOLA] Start game error:', error);
    return { success: false, message: 'Game start nahi hui' };
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
    
    // Check for winners
    const winners = await checkWinners(roomId, newCalledNumbers);
    
    return { success: true, number: nextNumber, calledNumbers: newCalledNumbers, winners };
  } catch (error) {
    console.error('🎲 [TAMBOLA] Call number error:', error);
    return { success: false, message: 'Number call nahi hua' };
  }
};

// Check for winners
const checkWinners = async (roomId, calledNumbers) => {
  try {
    const tickets = await TambolaTicket.findAll({
      where: { room_id: roomId, has_won: false },
      include: [{ model: User, as: 'user' }]
    });
    
    const winners = [];
    
    for (const ticket of tickets) {
      const ticketNumbers = ticket.ticket_numbers;
      const markedNumbers = ticket.marked_numbers || [];
      const completedRows = ticket.completed_rows || [];
      
      // Update marked numbers
      const newMarkedNumbers = [...markedNumbers];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 9; col++) {
          const num = ticketNumbers[row][col];
          if (num !== null && calledNumbers.includes(num) && !newMarkedNumbers.includes(num)) {
            newMarkedNumbers.push(num);
          }
        }
      }
      
      // Check for row completion
      const newCompletedRows = [...completedRows];
      let hasNewWin = false;
      let winType = null;
      
      // Check rows
      for (let row = 0; row < 3; row++) {
        if (!completedRows.includes(`row_${row}`) && checkRowComplete(ticketNumbers, newMarkedNumbers, row)) {
          newCompletedRows.push(`row_${row}`);
          hasNewWin = true;
          winType = `Row ${row + 1}`;
        }
      }
      
      // Check full house
      if (!completedRows.includes('full_house') && checkFullHouse(ticketNumbers, newMarkedNumbers)) {
        newCompletedRows.push('full_house');
        hasNewWin = true;
        winType = 'Full House';
      }
      
      // Update ticket
      await ticket.update({
        marked_numbers: newMarkedNumbers,
        completed_rows: newCompletedRows,
        has_won: hasNewWin
      });
      
      if (hasNewWin) {
        winners.push({
          user_id: ticket.user_id,
          name: ticket.user.name,
          win_type: winType,
          ticket_id: ticket.ticket_id
        });
        
        // Award points
        const points = winType === 'Full House' ? 500 : 200;
        await addPoints(ticket.user_id, points, 'tambola_win', ticket.user, {
          room_id: roomId,
          win_type: winType
        });
      }
    }
    
    return winners;
  } catch (error) {
    console.error('🎲 [TAMBOLA] Check winners error:', error);
    return [];
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

// Get active room
const getActiveRoom = async () => {
  try {
    const room = await TambolaRoom.findOne({
      where: { status: 'waiting' },
      order: [['created_at', 'DESC']]
    });
    
    return room;
  } catch (error) {
    console.error('🎲 [TAMBOLA] Get active room error:', error);
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
  generateTicket
};

