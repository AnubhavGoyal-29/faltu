# 📊 Database Migrations Guide

## Current Migration Status

### ⚠️ **IMPORTANT**: You have migrations in TWO locations!

1. **`backend/migrations/`** (5 files) - Newer timestamped migrations
2. **`backend/src/migrations/`** (7 files) - Older numbered migrations

**The `.sequelizerc` file points to `src/migrations/`**, but newer migrations are in `backend/migrations/`.

---

## 📁 Migration Files

### In `backend/migrations/` (Timestamped):
1. `20241201000001-create-tambola-tables.js` - Creates TambolaRooms & TambolaTickets
2. `20241201000002-create-faltu-games-tables.js` - Creates all game tables
3. `20241202000001-create-user-activity-tracking.js` - Creates UserActivityTracking table
4. `20241202000002-add-password-to-users.js` - Adds password column to users
5. `20241203000001-add-completed-columns-to-tambola-tickets.js` - Adds completed_columns (NEW)

### In `backend/src/migrations/` (Numbered):
1. `001-create-users.js` - Creates users table
2. `002-create-chat-rooms.js` - Creates ChatRooms table
3. `003-create-chat-messages.js` - Creates ChatMessages table
4. `004-create-lucky-draws.js` - Creates LuckyDraws table
5. `005-create-user-points.js` - Creates UserPoints table
6. `006-create-chaos-events.js` - Creates ChaosEvents table
7. `20251126053841-add-password-to-users.js` - Adds password (duplicate)

---

## 🔧 Current Setup

### Sequelize Configuration
- **Config File**: `backend/config/database.js`
- **Migrations Path**: `backend/src/migrations/` (from `.sequelizerc`)
- **Models Path**: `backend/src/models/`

### Server Behavior
Currently using `sequelize.sync({ alter: false })` in `server.js`:
- ❌ **NOT running migrations**
- ✅ **Syncing models** (creates/updates tables based on model definitions)
- ⚠️ **This can cause issues** if models don't match migrations

---

## 🚀 How to Run Migrations

### Option 1: Using Sequelize CLI (Recommended)

```bash
cd backend

# Run all pending migrations
npm run migrate
# OR
npx sequelize-cli db:migrate

# Undo last migration
npm run migrate:undo
# OR
npx sequelize-cli db:migrate:undo

# Check migration status
npx sequelize-cli db:migrate:status
```

### Option 2: Manual Migration (If CLI doesn't work)

You can manually run migrations by executing the SQL or using a migration runner.

---

## 📝 Migration File Structure

### Creating a New Migration

```bash
# Generate migration file
npx sequelize-cli migration:generate --name add-column-name-to-table-name

# This creates: YYYYMMDDHHMMSS-add-column-name-to-table-name.js
```

### Migration File Template

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add column
    await queryInterface.addColumn('TableName', 'column_name', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });
    
    // OR Create table
    await queryInterface.createTable('TableName', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // ... other columns
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: Remove column
    await queryInterface.removeColumn('TableName', 'column_name');
    
    // OR Drop table
    await queryInterface.dropTable('TableName');
  }
};
```

---

## 🔄 Migration Commands Reference

| Command | Description |
|---------|-------------|
| `npx sequelize-cli db:migrate` | Run all pending migrations |
| `npx sequelize-cli db:migrate:undo` | Undo last migration |
| `npx sequelize-cli db:migrate:undo:all` | Undo all migrations |
| `npx sequelize-cli db:migrate:status` | Show migration status |
| `npx sequelize-cli migration:generate --name NAME` | Create new migration |

---

## ⚠️ Important Notes

### 1. Migration vs Model Sync

**Current Setup**: Using `sequelize.sync({ alter: false })`
- Creates tables if they don't exist
- Does NOT modify existing tables
- Does NOT run migrations

**Best Practice**: Use migrations for all schema changes
- More control
- Version controlled
- Can rollback
- Production-safe

### 2. Migration Location Conflict

**Problem**: Migrations in two locations
- `.sequelizerc` points to `src/migrations/`
- But newer migrations are in `backend/migrations/`

**Solution Options**:
1. **Move all migrations to `backend/migrations/`** and update `.sequelizerc`
2. **Move all migrations to `backend/src/migrations/`** (current config)
3. **Consolidate and use one location**

### 3. New Migration Needed

**For Tambola `completed_columns` field**:
- Migration created: `backend/migrations/20241203000001-add-completed-columns-to-tambola-tickets.js`
- **But** `.sequelizerc` points to `src/migrations/`
- **Action needed**: Either move migration or update config

---

## 🛠️ Recommended Fix

### Step 1: Consolidate Migrations

Move all migrations to one location (recommend `backend/migrations/`):

```bash
# Move old migrations
mv backend/src/migrations/*.js backend/migrations/

# Update .sequelizerc
```

### Step 2: Update `.sequelizerc`

```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('config', 'database.js'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src', 'seeders'),
  'migrations-path': path.resolve('migrations')  // Changed from 'src/migrations'
};
```

### Step 3: Run Migrations

```bash
cd backend
npx sequelize-cli db:migrate
```

### Step 4: Update Server (Optional)

Remove `sequelize.sync()` and rely on migrations:

```javascript
// In server.js, change:
await sequelize.sync({ alter: false });

// To:
// Migrations handle schema, no sync needed
// Or keep sync for development only:
if (process.env.NODE_ENV === 'development') {
  await sequelize.sync({ alter: false });
}
```

---

## 📋 Migration Checklist

### For New Features:

- [ ] Create migration file using `sequelize-cli migration:generate`
- [ ] Write `up` function (what to do)
- [ ] Write `down` function (how to rollback)
- [ ] Test migration: `npm run migrate`
- [ ] Test rollback: `npm run migrate:undo`
- [ ] Commit migration file to git

### For Column Changes:

- [ ] Create migration: `add-column-name-to-table-name`
- [ ] Use `queryInterface.addColumn()` in `up`
- [ ] Use `queryInterface.removeColumn()` in `down`
- [ ] Update model file to include new column
- [ ] Run migration

---

## 🎯 Current Migration Status

### Pending Migrations (if not run):

1. ✅ `20241201000001-create-tambola-tables.js` - Tambola tables
2. ✅ `20241201000002-create-faltu-games-tables.js` - Game tables
3. ✅ `20241202000001-create-user-activity-tracking.js` - Activity tracking
4. ✅ `20241202000002-add-password-to-users.js` - Password field
5. ⚠️ `20241203000001-add-completed-columns-to-tambola-tickets.js` - **NEW - Needs to be run**

### To Check Status:

```bash
cd backend
npx sequelize-cli db:migrate:status
```

This will show which migrations have been run and which are pending.

---

## 🔍 Troubleshooting

### Migration Fails?

1. **Check database connection** in `.env`
2. **Check migration file syntax**
3. **Check if table/column already exists**
4. **Check foreign key constraints**

### Migration Already Run?

- Sequelize tracks migrations in `SequelizeMeta` table
- If migration shows as "already run" but table doesn't exist:
  - Check `SequelizeMeta` table
  - Manually remove entry if needed

### Models Out of Sync?

- If models don't match database:
  - Run migrations to update database
  - OR update models to match database
  - Don't use `sync({ alter: true })` in production!

---

**Last Updated**: December 2024  
**Migration System**: Sequelize CLI

