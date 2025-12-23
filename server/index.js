const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

// Database Setup (MySQL)
console.log('DB Config:', {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'faltuverse',
    password_len: (process.env.DB_PASSWORD || '').length
});

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'faltuverse',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Connection and Init DB
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database.');
        initDb(connection);
        connection.release();
    }
});

function initDb(connection) {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        anonymous_user_id VARCHAR(255) NOT NULL,
        event_name VARCHAR(255) NOT NULL,
        activity_id VARCHAR(255),
        timestamp BIGINT,
        metadata TEXT
    )`;
    connection.query(createTableQuery, (err) => {
        if (err) console.error('Error creating table:', err);
        else console.log('Events table ready.');
    });
}

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

app.post('/api/event', (req, res) => {
    const { anonymous_user_id, event_name, activity_id, timestamp, metadata } = req.body;

    if (!anonymous_user_id || !event_name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `INSERT INTO events (anonymous_user_id, event_name, activity_id, timestamp, metadata) VALUES (?, ?, ?, ?, ?)`;
    const metadataStr = metadata ? JSON.stringify(metadata) : null;

    db.query(sql, [anonymous_user_id, event_name, activity_id, timestamp || Date.now(), metadataStr], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ id: result.insertId, status: 'recorded' });
    });
});

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../client/dist')));

// SPA Fallback (Must be last)
app.get('*', (req, res) => {
    // Skip API routes to avoid confusion if API 404s
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Not Found' });
    }
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
