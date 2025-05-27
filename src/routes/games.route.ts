const express = require("express");
const db = require('../db/init');
import type { Request, Response } from 'express';


const router = express.Router();


router.get("/", (req:Request, res:Response) => {
  const games = db.prepare('SELECT * FROM games ORDER BY created_at DESC').all();
  res.json(games)
});

router.get("/:id", (req:Request, res:Response) => {
  const stmt = db.prepare("SELECT * FROM games WHERE id = ?");
  const games = stmt.get(req.params.id);
  if(games){
    res.json(games)
  }else{
    res.status(404).json({ error: "Game not found." })
  }
});

module.exports = router;