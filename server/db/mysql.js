import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;

export async function initDb() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'faltuverse',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ MySQL connected');

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

  try {
    await pool.query(createEventsTable);
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

