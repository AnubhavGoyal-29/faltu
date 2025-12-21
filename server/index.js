require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

// Database Setup
const dbPath = path.resolve(__dirname, 'faltu.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    anonymous_user_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    activity_id TEXT,
    timestamp INTEGER,
    metadata TEXT
  )`, (err) => {
        if (err) console.error('Error creating table', err);
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

    db.run(sql, [anonymous_user_id, event_name, activity_id, timestamp || Date.now(), metadataStr], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ id: this.lastID, status: 'recorded' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
