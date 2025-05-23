const Database = require('better-sqlite3');
const path = require('path');

// Initialize DB
const DB_FILE = path.resolve(__dirname, '../../database.db')
const db = new Database(DB_FILE);

db.pragma('journal_mode = WAL');

//create users table
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`).run();

//create games table
db.prepare(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    frames TEXT NOT NULL,
    current_frame_index INTEGER NOT NULL,
    is_complete INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`).run();

module.exports = db;