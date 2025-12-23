# Database Setup Guide

## Quick Start

The server will automatically create the database and tables on first run. However, you need to ensure MySQL is running first.

## Step 1: Start MySQL

### macOS (using Homebrew):
```bash
brew services start mysql
# OR
mysql.server start
```

### Linux:
```bash
sudo systemctl start mysql
# OR
sudo service mysql start
```

### Windows:
Start MySQL from Services (Services.msc) or use:
```bash
net start MySQL
```

## Step 2: Verify MySQL is Running

```bash
mysql -u root -p
# Enter your password when prompted
# Type EXIT; to leave
```

## Step 3: (Optional) Manual Database Setup

If you want to set up the database manually before starting the server:

```bash
cd server
npm run setup-db
```

This will:
- Create the database `faltuverse` (or the name from your `.env`)
- Create all necessary tables (`events` and `user_activities`)

## Step 4: Configure Environment Variables

Create a `.env` file in the project root (or `server/.env`) with:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=faltuverse
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
```

## Step 5: Start the Server

The server will automatically:
1. Connect to MySQL
2. Create the database if it doesn't exist
3. Create all necessary tables

```bash
cd server
npm start
```

## Troubleshooting

### Error: ECONNREFUSED
**Problem**: MySQL is not running or connection refused

**Solution**:
1. Check if MySQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status mysql
   ```

2. Start MySQL (see Step 1 above)

3. Verify connection:
   ```bash
   mysql -u root -p -e "SELECT 1;"
   ```

### Error: Access Denied
**Problem**: Wrong username or password

**Solution**:
1. Check your `.env` file has correct credentials
2. Try connecting manually:
   ```bash
   mysql -u root -p
   ```
3. If you forgot the root password, reset it:
   - macOS: https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html
   - Linux: `sudo mysql_secure_installation`

### Error: Database doesn't exist
**Problem**: Database creation failed

**Solution**: The updated code should auto-create it, but you can manually create:
```sql
CREATE DATABASE IF NOT EXISTS faltuverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Database Schema

The application uses two main tables:

### `events` table
- Stores analytics events (activity views, completions, etc.)
- Fields: id, anonymous_user_id, event_name, activity_id, timestamp, metadata

### `user_activities` table
- Tracks which activities each user has completed/skipped
- Fields: id, anonymous_user_id, activity_id, status, timestamp
- Unique constraint on (anonymous_user_id, activity_id)

Both tables are automatically created on server startup if they don't exist.

