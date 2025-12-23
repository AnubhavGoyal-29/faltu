#!/usr/bin/env node
/**
 * Database Setup Script
 * This script helps set up the MySQL database and tables
 * Run: node server/setup-db.js
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const dbName = process.env.DB_NAME || 'faltuverse';

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    
    // Connect without database
    connection = await mysql.createConnection({
      ...dbConfig,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Create database
    console.log(`📦 Creating database '${dbName}' if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${dbName}' is ready`);

    // Switch to the database
    await connection.query(`USE \`${dbName}\``);

    // Create tables
    console.log('📋 Creating tables...');

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

    await connection.query(createEventsTable);
    console.log('✅ Created table: events');

    await connection.query(createUserActivitiesTable);
    console.log('✅ Created table: user_activities');

    console.log('\n🎉 Database setup complete!');
    console.log(`\nYou can now start the server with: npm start (in server directory)`);
    
    await connection.end();
  } catch (error) {
    if (connection) {
      await connection.end();
    }
    
    console.error('\n❌ Database setup failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure MySQL is running:');
    console.error('   - macOS: brew services start mysql (or mysql.server start)');
    console.error('   - Linux: sudo systemctl start mysql');
    console.error('   - Windows: Start MySQL service from Services');
    console.error('\n2. Check your database credentials in .env file');
    console.error('3. Try connecting manually: mysql -u root -p');
    console.error('\nDefault connection settings:');
    console.error(`   Host: ${dbConfig.host}`);
    console.error(`   Port: ${dbConfig.port}`);
    console.error(`   User: ${dbConfig.user}`);
    console.error(`   Database: ${dbName}`);
    
    process.exit(1);
  }
}

setupDatabase();

