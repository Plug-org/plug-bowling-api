const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');
const path = require('path');
import type { Request, Response } from 'express';


// Initialize DB
const DB_FILE = './database.db'
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

// Start Express server
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


// Routes
// Users
app.get('/users', (req: Request, res:Response) => {
  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

app.get('/users/:id', (req:Request, res:Response) =>{
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const user = stmt.get(req.params.id);
  if(user){
    res.json(user);
  }else{
    res.status(404).json({ error: "User not found."});
  }
});

app.post('/users', (req: Request, res:Response)=> {
  const { name } = req.body;
  const stmt = db.prepare(('INSERT INTO users (name) VALUES (?)'));
  const info = stmt.run(name);
  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(newUser);
});

app.put('/users/:id', (req:Request, res:Response) => {
  const { name } = req.body;
  const stmt = db.prepare('UPDATE users SET name = ? WHERE id = ?');
  const info = stmt.run(name, req.params.id);
  if(info.changes > 0) {
    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    res.json(updated);
  }
  else{
    res.status(404).json({ error: "User not found." });
  }
});

app.delete('/users/:id', (req:Request, res:Response) => {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const info = stmt.run(req.params.id);
  if(info.changes > 0) res.json({ success: true });
  else res.status(404).json({ error: "User not found."})
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
