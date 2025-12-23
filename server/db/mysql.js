import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;

export async function initDb() {
  try {
    const dbName = process.env.DB_NAME || 'faltuverse';
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    // First, connect without database to create it if needed
    const adminPool = mysql.createPool({
      ...dbConfig,
      multipleStatements: true
    });

    try {
      // Check if database exists, create if not
      const [databases] = await adminPool.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
        [dbName]
      );

      if (databases.length === 0) {
        console.log(`📦 Creating database: ${dbName}`);
        await adminPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(`✅ Database '${dbName}' created`);
      }

      await adminPool.end();
    } catch (error) {
      await adminPool.end();
      // If database creation fails, try to continue anyway
      console.warn('⚠️  Could not create database (might already exist):', error.message);
    }

    // Now connect to the specific database
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName
    });

    // Test connection
    await pool.query('SELECT 1');
    console.log(`✅ MySQL connected to database '${dbName}'`);

    // Create tables
    await createTables();
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    throw error;
  }
}

async function createTables() {
  const createEventsTable = `
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      anonymous_user_id VARCHAR(255) NOT NULL,
      event_name VARCHAR(100) NOT NULL,
      activity_id VARCHAR(100),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      metadata JSON,
      INDEX idx_user_id (anonymous_user_id),
      INDEX idx_event_name (event_name),
      INDEX idx_timestamp (timestamp)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const createUserActivitiesTable = `
    CREATE TABLE IF NOT EXISTS user_activities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      anonymous_user_id VARCHAR(255) NOT NULL,
      activity_id VARCHAR(100) NOT NULL,
      status ENUM('completed', 'skipped') NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_activity (anonymous_user_id, activity_id),
      INDEX idx_user_id (anonymous_user_id),
      INDEX idx_activity_id (activity_id),
      INDEX idx_status (status),
      INDEX idx_timestamp (timestamp)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  try {
    await pool.query(createEventsTable);
    await pool.query(createUserActivitiesTable);
    console.log('✅ Database tables created');
  } catch (error) {
    console.error('❌ Table creation error:', error.message);
    throw error;
  }
}

export function getDb() {
  if (!pool) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return pool;
}

