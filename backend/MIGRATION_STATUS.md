# 📊 Migration Status Report

## Current Situation

### ⚠️ **Migrations are split in TWO locations:**

1. **`backend/migrations/`** - 5 files (newer, timestamped)
2. **`backend/src/migrations/`** - 7 files (older, numbered)

**The `.sequelizerc` has been updated** to point to `backend/migrations/` (timestamped ones).

---

## 📋 All Migration Files

### ✅ In `backend/migrations/` (Active - 5 files):

1. **`20241201000001-create-tambola-tables.js`**
   - Creates: `TambolaRooms`, `TambolaTickets`
   - Status: ✅ Should be run

2. **`20241201000002-create-faltu-games-tables.js`**
   - Creates: `BakchodiChallenges`, `Debates`, `MemeBattles`, `WheelSpins`, `FuturePredictions`, `TapGameScores`, `RunawayButtonWins`, `Dares`, `Roasts`
   - Status: ✅ Should be run

3. **`20241202000001-create-user-activity-tracking.js`**
   - Creates: `UserActivityTracking`
   - Status: ✅ Should be run

4. **`20241202000002-add-password-to-users.js`**
   - Adds: `password` column to `users` table
   - Status: ✅ Should be run

5. **`20241203000001-add-completed-columns-to-tambola-tickets.js`** ⭐ NEW
   - Adds: `completed_columns` JSON column to `TambolaTickets`
   - Status: ⚠️ **NEEDS TO BE RUN** for Tambola fix

### 📁 In `backend/src/migrations/` (Legacy - 7 files):

These are older migrations that may have already been applied via `sequelize.sync()`:

1. `001-create-users.js` - Creates users table
2. `002-create-chat-rooms.js` - Creates ChatRooms
3. `003-create-chat-messages.js` - Creates ChatMessages
4. `004-create-lucky-draws.js` - Creates LuckyDraws
5. `005-create-user-points.js` - Creates UserPoints
6. `006-create-chaos-events.js` - Creates ChaosEvents
7. `20251126053841-add-password-to-users.js` - Adds password (duplicate)

---

## 🔧 How Migrations Work

### Current Setup:

**Server uses**: `sequelize.sync({ alter: false })`
- Creates tables if they don't exist
- Does NOT modify existing tables
- Does NOT run migrations automatically

**To run migrations manually**:
```bash
cd backend
npm run migrate
# OR
npx sequelize-cli db:migrate
```

### Migration System:

1. **Sequelize CLI** reads `.sequelizerc` config
2. Looks for migrations in configured path (`backend/migrations/`)
3. Checks `SequelizeMeta` table to see which migrations ran
4. Runs pending migrations in order (by filename)
5. Records completed migrations in `SequelizeMeta`

---

## ✅ What Needs to Be Done

### For Tambola Fix (completed_columns):

**Migration file exists**: `backend/migrations/20241203000001-add-completed-columns-to-tambola-tickets.js`

**To apply it**:
```bash
cd backend
npx sequelize-cli db:migrate
```

This will:
1. Check which migrations have run
2. Run `20241203000001-add-completed-columns-to-tambola-tickets.js`
3. Add `completed_columns` column to `TambolaTickets` table

---

## 📝 Migration File Structure

### Example: Adding a Column

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add column
    await queryInterface.addColumn('TambolaTickets', 'completed_columns', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: Remove column
    await queryInterface.removeColumn('TambolaTickets', 'completed_columns');
  }
};
```

### Example: Creating a Table

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TableName', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TableName');
  }
};
```

---

## 🚀 Quick Commands

### Check Migration Status:
```bash
cd backend
npx sequelize-cli db:migrate:status
```

### Run All Pending Migrations:
```bash
cd backend
npm run migrate
```

### Undo Last Migration:
```bash
cd backend
npm run migrate:undo
```

### Create New Migration:
```bash
cd backend
npx sequelize-cli migration:generate --name add-column-name-to-table-name
```

---

## ⚠️ Important Notes

1. **Migrations are NOT run automatically** - You must run them manually
2. **Server uses `sequelize.sync()`** - This creates tables but doesn't run migrations
3. **Two migration locations** - Currently using `backend/migrations/` (timestamped)
4. **New migration needed** - `completed_columns` migration must be run for Tambola fix

---

## ✅ Action Required

**To complete the Tambola fix**:

1. Run the migration:
   ```bash
   cd backend
   npx sequelize-cli db:migrate
   ```

2. Verify the column was added:
   ```sql
   DESCRIBE TambolaTickets;
   -- Should show completed_columns column
   ```

3. Restart server if needed

---

**Last Updated**: December 2024  
**Migration Location**: `backend/migrations/`  
**Config File**: `backend/.sequelizerc`

