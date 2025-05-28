const express = require("express");
const db = require('../db/init');
const { v4: uuidv4 } = require('uuid');
import type { Request, Response } from 'express';


const router = express.Router();


router.get('/', (req: Request, res:Response) => {
  const users = db.prepare('SELECT * FROM users ORDER BY createdAt DESC').all();
  res.json(users);
});


router.get('/:id', (req:Request, res:Response) =>{
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const user = stmt.get(req.params.id);
  
  if(user){
    res.json(user);
  }else{
    res.status(404).json({ error: "User not found."});
  }
});


router.post('/', (req: Request, res:Response)=> {
  const { name } = req.body;
  const id = uuidv4();

  db.prepare(('INSERT INTO users (id, name) VALUES (?, ?)')).run(id, name);

  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  res.status(201).json(newUser);
});


router.put('/:id', (req:Request, res:Response) => {
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


router.delete('/:id', (req:Request, res:Response) => {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const info = stmt.run(req.params.id);
  
  if(info.changes > 0) res.json({ success: true });
  else res.status(404).json({ error: "User not found."})
});


router.delete('/:id/games', (req:Request, res:Response) => {
  const stmt = db.prepare('DELETE FROM games WHERE userId = ?');
  const info = stmt.run(req.params.id);

  if(info.changes > 0) {
    res.json({ success: true, deletedGames: info.changes });
  }else{
    res.status(404).json({ error: "No games found for this user." });
  }
});

module.exports = router;