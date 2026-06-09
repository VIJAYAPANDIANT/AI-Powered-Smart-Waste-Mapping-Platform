const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.VERCEL
    ? path.join('/tmp', 'database.sqlite')
    : path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database at:', dbPath);
    }
});

// Helper functions for promise-based database operations
db.runAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

db.getAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

db.allAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Initialize schema
const initSchema = async () => {
    try {
        await db.runAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                role TEXT DEFAULT 'user',
                impact_score INTEGER DEFAULT 0,
                password TEXT
            )
        `);

        await db.runAsync(`
            CREATE TABLE IF NOT EXISTS waste_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                location TEXT,
                latitude REAL,
                longitude REAL,
                description TEXT,
                photo_url TEXT,
                category TEXT,
                timestamp TEXT,
                status TEXT DEFAULT 'pending',
                report_id TEXT,
                user_id TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);
        console.log('SQLite schema initialized.');
    } catch (err) {
        console.error('Schema initialization error:', err.message);
    }
};

// Run initialization
initSchema();

module.exports = db;
