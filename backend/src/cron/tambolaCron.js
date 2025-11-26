/**
 * Tambola Game Cron Jobs - CLEAN VERSION
 * 
 * Simple flow:
 * 1. Server starts → Create room in 'waiting' status
 * 2. After 5 minutes → Start game (status = 'active')
 * 3. Call numbers every 5 seconds
 * 4. When full house → End game → Create new room immediately
 */

const {
  createTambolaRoom,
  startTambolaGame,
  callNextNumber,
  completeGame
} = require('../services/tambolaService');
const { joinSystemUsersToTambola } = require('../services/systemUsersService');

// Game state
let currentRoomId = null;
let numberCallInterval = null;
let registrationTimer = null;
let nextNumberCallTime = null; // When next number will be called
let countdownInterval = null; // Interval for broadcasting countdown

/**
 * Create new room and start registration phase
 */
const createNewRoom = async (io) => {
  try {
    console.log('🎲 [TAMBOLA] Creating new room for registration...');
    
    // Create room
    const room = await createTambolaRoom();
    currentRoomId = room.room_id;
    
    // Join system users
    await joinSystemUsersToTambola(room.room_id);
    
    // Get last round winners
    const { getLastRoundWinners } = require('../services/tambolaService');
    const lastWinners = await getLastRoundWinners();
    
    // Calculate time remaining
    const now = new Date();
    const endTime = new Date(room.registration_end_at);
    const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
    
    // Broadcast room created
    io.emit('tambola_room_created', {
      room_id: room.room_id,
      status: 'waiting',
      registration_end_at: room.registration_end_at,
      registration_time_remaining: timeRemaining,
      last_winners: lastWinners
    });
    
    console.log(`🎲 [TAMBOLA] Room ${room.room_id} created! Registration ends in ${timeRemaining} seconds`);
    
    // Setup timer to start game after 5 minutes
    const waitTime = Math.max(0, endTime - now);
    
    registrationTimer = setTimeout(async () => {
      await startGame(room.room_id, io);
    }, waitTime);
    
    // Broadcast timer updates every second
    const timerInterval = setInterval(() => {
      const now = new Date();
      const endTime = new Date(room.registration_end_at);
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      
      io.emit('tambola_registration_timer', {
        room_id: room.room_id,
        time_remaining: remaining
      });
      
      if (remaining === 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
    
  } catch (error) {
    console.error('🎲 [TAMBOLA] Create room error:', error);
  }
};

/**
 * Start the game (after registration period)
 */
const startGame = async (roomId, io) => {
  try {
    console.log(`🎲 [TAMBOLA] Starting game for room ${roomId}...`);
    
    // Clear registration timer
    if (registrationTimer) {
      clearTimeout(registrationTimer);
      registrationTimer = null;
    }
    
    // Start game in database
    const result = await startTambolaGame(roomId);
    
    if (!result.success) {
      console.error(`🎲 [TAMBOLA] Failed to start game: ${result.message}`);
      // Retry after 2 seconds
      setTimeout(() => createNewRoom(io), 2000);
      return;
    }
    
    // Broadcast game started
    io.emit('tambola_game_started', {
      room_id: roomId,
      message: 'Tambola game start ho gayi!'
    });
    
    console.log(`🎲 [TAMBOLA] Game started! Room ${roomId} is now active.`);
    
    // Call first number after 2 seconds
    const firstCallDelay = 2000;
    nextNumberCallTime = new Date(Date.now() + firstCallDelay);
    
    setTimeout(async () => {
      await callAndCheckNumber(roomId, io);
    }, firstCallDelay);
    
    // Then call numbers every 5 seconds
    numberCallInterval = setInterval(async () => {
      await callAndCheckNumber(roomId, io);
    }, 5000);
    
    // Broadcast next number countdown every second
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    countdownInterval = setInterval(() => {
      if (nextNumberCallTime) {
        const now = new Date();
        const remaining = Math.max(0, Math.floor((nextNumberCallTime - now) / 1000));
        
        io.emit('tambola_next_number_countdown', {
          room_id: roomId,
          seconds_remaining: remaining,
          next_call_at: nextNumberCallTime.toISOString()
        });
      }
    }, 1000);
    
  } catch (error) {
    console.error('🎲 [TAMBOLA] Start game error:', error);
  }
};

/**
 * Call next number and check for winners
 */
const callAndCheckNumber = async (roomId, io) => {
  try {
    const result = await callNextNumber(roomId);
    
    if (!result.success) {
      console.log(`🎲 [TAMBOLA] ${result.message}`);
      // All numbers called or game ended
      if (numberCallInterval) {
        clearInterval(numberCallInterval);
        numberCallInterval = null;
      }
      nextNumberCallTime = null;
      await endGame(roomId, null, io);
      return;
    }
    
    // Set next number call time (5 seconds from now)
    nextNumberCallTime = new Date(Date.now() + 5000);
    
    // Broadcast number called with next call time
    io.emit('tambola_number_called', {
      room_id: roomId,
      number: result.number,
      called_numbers: result.calledNumbers,
      next_call_at: nextNumberCallTime.toISOString(),
      seconds_until_next: 5
    });
    
    // Send updated tickets to each user
    if (result.updatedTickets) {
      for (const ticketUpdate of result.updatedTickets) {
        io.to(`user_${ticketUpdate.user_id}`).emit('tambola_ticket_update', {
          room_id: roomId,
          ticket: ticketUpdate
        });
      }
    }
    
    // Check for winners
    if (result.winners && result.winners.length > 0) {
      let hasFullHouse = false;
      
      for (const winner of result.winners) {
        // Broadcast winner
        io.emit('tambola_winner', {
          room_id: roomId,
          winner: winner,
          message: `${winner.name} ne ${winner.win_type} complete kar liya! 🎉`,
          show_popper: true
        });
        
        if (winner.win_type === 'Full House') {
          hasFullHouse = true;
        }
      }
      
      // If full house, end game immediately
      if (hasFullHouse) {
        if (numberCallInterval) {
          clearInterval(numberCallInterval);
          numberCallInterval = null;
        }
        const fullHouseWinner = result.winners.find(w => w.win_type === 'Full House');
        await endGame(roomId, fullHouseWinner.user_id, io);
      }
    }
    
  } catch (error) {
    console.error('🎲 [TAMBOLA] Call number error:', error);
  }
};

/**
 * End game and start new registration
 */
const endGame = async (roomId, winnerId, io) => {
  try {
    console.log(`🎲 [TAMBOLA] Ending game for room ${roomId}...`);
    
    // Clear intervals
    if (numberCallInterval) {
      clearInterval(numberCallInterval);
      numberCallInterval = null;
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    nextNumberCallTime = null;
    
    // Complete game in database
    await completeGame(roomId, winnerId);
    
    // Broadcast game completed
    io.emit('tambola_game_completed', {
      room_id: roomId,
      winner_user_id: winnerId,
      message: 'Game complete ho gayi!'
    });
    
    currentRoomId = null;
    
    console.log('🎲 [TAMBOLA] Game ended! Starting new registration in 2 seconds...');
    
    // Start new room after 2 seconds
    setTimeout(() => {
      createNewRoom(io);
    }, 2000);
    
  } catch (error) {
    console.error('🎲 [TAMBOLA] End game error:', error);
  }
};

/**
 * Initialize Tambola game on server start
 */
const initializeTambolaGame = async (io) => {
  try {
    console.log('🎲 [TAMBOLA] Initializing Tambola game...');
    
    // Check if there's an existing room
    const { getActiveRoom } = require('../services/tambolaService');
    const existingRoom = await getActiveRoom();
    
    if (existingRoom) {
      console.log(`🎲 [TAMBOLA] Found existing room ${existingRoom.room_id} with status: ${existingRoom.status}`);
      
      if (existingRoom.status === 'waiting') {
        // Room is waiting, setup timer
        currentRoomId = existingRoom.room_id;
        const now = new Date();
        const endTime = new Date(existingRoom.registration_end_at);
        const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
        
        if (timeRemaining <= 0) {
          // Registration time passed, start game immediately
          await startGame(existingRoom.room_id, io);
        } else {
          // Setup timer
          registrationTimer = setTimeout(async () => {
            await startGame(existingRoom.room_id, io);
          }, timeRemaining * 1000);
          
          // Broadcast timer updates
          const timerInterval = setInterval(() => {
            const now = new Date();
            const endTime = new Date(existingRoom.registration_end_at);
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
            
            io.emit('tambola_registration_timer', {
              room_id: existingRoom.room_id,
              time_remaining: remaining
            });
            
            if (remaining === 0) {
              clearInterval(timerInterval);
            }
          }, 1000);
        }
      } else if (existingRoom.status === 'active') {
        // Game is active, resume number calling
        currentRoomId = existingRoom.room_id;
        
        // Calculate next call time (5 seconds from now)
        nextNumberCallTime = new Date(Date.now() + 5000);
        
        numberCallInterval = setInterval(async () => {
          await callAndCheckNumber(existingRoom.room_id, io);
        }, 5000);
        
        // Broadcast next number countdown every second
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
        countdownInterval = setInterval(() => {
          if (nextNumberCallTime) {
            const now = new Date();
            const remaining = Math.max(0, Math.floor((nextNumberCallTime - now) / 1000));
            
            io.emit('tambola_next_number_countdown', {
              room_id: existingRoom.room_id,
              seconds_remaining: remaining,
              next_call_at: nextNumberCallTime.toISOString()
            });
          }
        }, 1000);
      } else {
        // Room completed, create new one
        await createNewRoom(io);
      }
    } else {
      // No room exists, create new one immediately
      await createNewRoom(io);
    }
    
    console.log('🎲 [TAMBOLA] Tambola game initialized!');
    
  } catch (error) {
    console.error('🎲 [TAMBOLA] Initialize error:', error);
    // Fallback: create new room after 5 seconds
    setTimeout(() => createNewRoom(io), 5000);
  }
};

module.exports = {
  initializeTambolaGame
};
