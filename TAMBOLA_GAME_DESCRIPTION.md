# 🎲 Tambola Game Description

## Overview

Tambola (also known as Housie or Bingo) is a multiplayer number-calling game where players compete to complete rows, columns, or the entire ticket (full house) by marking numbers as they are called.

---

## 🎫 Ticket Structure

### 3x3 Grid
- Each ticket is a **3x3 grid** (3 rows × 3 columns)
- Total of **9 numbers** per ticket
- Numbers range from **1 to 90**
- Each number appears only once per ticket
- Numbers are randomly distributed across the grid

### Example Ticket:
```
┌─────┬─────┬─────┐
│  15 │  42 │  78 │
├─────┼─────┼─────┤
│  3  │  67 │  91 │
├─────┼─────┼─────┤
│  28 │  55 │  12 │
└─────┴─────┴─────┘
```

---

## 🎮 Game Flow

### 1. Registration Phase (5 Minutes)

- **Duration**: 5 minutes (300 seconds)
- **Status**: `waiting`
- **Actions**:
  - Users can register for the game
  - Each user gets a unique 3x3 ticket
  - Registration countdown timer displayed
  - Last round winners shown (if available)

**Registration Requirements**:
- User must be logged in
- Can only register once per game
- Minimum 2 players required to start

### 2. Active Game Phase

- **Status**: `active`
- **Number Calling**: Every 20 seconds
- **Numbers Range**: 1-90 (random selection)
- **Auto-marking**: Numbers are automatically marked on tickets when called

**Win Conditions**:
1. **Row Completion**: Complete any horizontal row (3 numbers)
2. **Column Completion**: Complete any vertical column (3 numbers)
3. **Full House**: Complete entire ticket (all 9 numbers)

### 3. Game End

- **Automatic End**: Game ends immediately when any user completes **Full House**
- **Status**: `completed`
- **Winner**: User who completed full house
- **Points Awarded**:
  - Row completion: 200 points
  - Column completion: 200 points
  - Full House: 500 points

### 4. Next Round

- **Wait Time**: 5 minutes after game completion
- **New Room**: New room created automatically
- **Previous Winners**: Cleared when new game starts

---

## 📊 Leaderboard System

### Right-Side Display

During active game, the right sidebar shows:

#### 1. **Full House Winners** (Top Priority)
- Users who completed all 9 numbers
- Game ends when first full house is achieved

#### 2. **Row Completions**
- Users who completed any row (Row 1, Row 2, or Row 3)
- Shows completion type (e.g., "Row 1")

#### 3. **Column Completions**
- Users who completed any column (Column 1, Column 2, or Column 3)
- Shows completion type (e.g., "Column 2")

### Leaderboard Updates
- Updates in real-time after each number is called
- Shows all users who have achieved any completion
- Multiple users can complete rows/columns simultaneously

---

## 🏆 Last Round Winners Display

### During Registration Phase

When a new game is in registration phase (`waiting` status):

- **Shows**: Winners from the most recent completed game
- **Categories**:
  - Full House winners
  - Row completions
  - Column completions
- **Cleared**: When new game starts (status changes to `active`)

### Purpose
- Motivates players
- Shows previous game results
- Creates competitive atmosphere

---

## 🎯 Visual Features

### Ticket Display
- **3x3 Grid**: Clean, easy-to-read layout
- **Number States**:
  - **White**: Not called yet
  - **Yellow**: Called but not in your ticket
  - **Green**: Called and marked (in your ticket)
- **Animations**: 
  - Pulse animation for called numbers
  - Scale animation for marked numbers

### Current Number Display
- **Large Display**: Shows current number prominently
- **Animation**: Bouncing effect
- **Color**: Red highlight

### Called Numbers Board
- **Grid View**: Shows all called numbers
- **Current Number**: Highlighted in red with pulse animation
- **Scrollable**: If many numbers called

---

## ⏱️ Timing

| Phase | Duration | Description |
|-------|----------|-------------|
| Registration | 5 minutes | Users register and get tickets |
| Number Calling | 20 seconds | Interval between each number call |
| Game Duration | Variable | Until full house is completed |
| Next Round Wait | 5 minutes | After game completion |

---

## 🔔 Real-time Updates

### Socket.IO Events

1. **`tambola_room_created`**
   - New room created
   - Registration phase starts

2. **`tambola_game_started`**
   - Registration phase ends
   - Game becomes active
   - Number calling begins

3. **`tambola_number_called`**
   - New number called
   - Updates called numbers list
   - Auto-marks numbers on tickets

4. **`tambola_winner`**
   - User completed row/column/full house
   - Shows winner name and completion type
   - Updates leaderboard

5. **`tambola_game_completed`**
   - Full house achieved
   - Game ends
   - Winner declared

---

## 🎁 Rewards

### Points System

- **Row Completion**: 200 points
- **Column Completion**: 200 points
- **Full House**: 500 points

### AI-Enhanced Rewards
- Points can be dynamically adjusted by AI
- Considers user performance, activity, and context
- Fallback to default points if AI unavailable

---

## 🛠️ Technical Details

### Backend

**Service**: `tambolaService.js`
- Ticket generation (3x3 grid)
- Winner checking (rows, columns, full house)
- Leaderboard generation
- Last round winners retrieval

**Model**: `TambolaTicket`
- `ticket_numbers`: JSON array (3x3 grid)
- `marked_numbers`: JSON array
- `completed_rows`: JSON array
- `completed_columns`: JSON array (NEW)
- `has_won`: Boolean

**Cron Job**: `tambolaCron.js`
- Creates new rooms every 5 minutes
- Manages game lifecycle
- Handles number calling intervals

### Frontend

**Component**: `Tambola.jsx`
- Real-time ticket display
- Leaderboard sidebar
- Registration timer
- Last round winners display
- Socket.IO integration

---

## 📝 Game Rules

1. **One Ticket Per User**: Each user gets one unique ticket per game
2. **Auto-Marking**: Numbers are automatically marked when called
3. **Multiple Wins**: Users can complete multiple rows/columns
4. **First Full House Wins**: Game ends when first full house is achieved
5. **No Manual Marking**: All marking is automatic
6. **Real-time Updates**: All players see updates simultaneously

---

## 🎨 UI/UX Features

### Color Coding
- **Green**: Completed/marked numbers
- **Yellow**: Called numbers (not in ticket)
- **Red**: Current number
- **White**: Uncalled numbers

### Animations
- Bounce animation for current number
- Pulse animation for called numbers
- Scale animation for marked numbers
- Confetti burst on wins

### Responsive Design
- Works on desktop and mobile
- Grid layout adapts to screen size
- Scrollable sections for long lists

---

## 🔄 Game Lifecycle

```
Server Start
    ↓
Wait 5 minutes
    ↓
Create Room (status: waiting)
    ↓
5-minute Registration Window
    ↓
Start Game (status: active)
    ↓
Call Numbers Every 20 seconds
    ↓
Check for Winners (rows/columns/full house)
    ↓
Full House Achieved?
    ↓ YES
End Game (status: completed)
    ↓
Wait 5 minutes
    ↓
Create New Room (repeat)
```

---

## 🐛 Edge Cases Handled

1. **No Players**: Game doesn't start if < 2 players
2. **All Numbers Called**: Game ends if all 90 numbers called
3. **Multiple Full Houses**: First full house wins, game ends immediately
4. **Disconnected Users**: Can rejoin and see current state
5. **Server Restart**: New game starts after restart

---

## 📈 Future Enhancements (Potential)

1. **Multiple Tickets**: Allow users to buy multiple tickets
2. **Special Patterns**: Diagonal wins, corners, etc.
3. **Tournament Mode**: Multiple rounds with cumulative scores
4. **Private Rooms**: Create custom rooms with friends
5. **Ticket Preview**: Show ticket before registration
6. **Statistics**: Show user's win history
7. **Achievements**: Badges for different win types

---

**Last Updated**: December 2024  
**Version**: 2.0 (3x3 Grid Update)

