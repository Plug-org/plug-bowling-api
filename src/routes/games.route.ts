const express = require("express");
const db = require('../db/init');
import type { Request, Response } from 'express';
const GameEngine =require('../gameEngine');


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


router.post("/", (req:Request, res:Response) => {
  const { userId } = req.body;
  
  // create game instance
  const game = new GameEngine(userId);
  const { id, frames, currentFrameIndex, isComplete } = game.state;

  //insert game into db
  db.prepare((`
    INSERT INTO games (
    id, user_id, frames, current_frame_index, is_complete
    ) VALUES (?,?,?,?,?)
  `))
  .run(
    id,
    userId,
    JSON.stringify(frames),
    currentFrameIndex,
    isComplete ? 1 : 0
   );

   //respond with new game blank state 
   const newGame = db.prepare('SELECT * FROM games WHERE id = ?').get(id);
   res.json(newGame);

});

router.delete("/:id", (req:Request, res:Response) => {
  const stmt = db.prepare((`DELETE FROM games WHERE id = ?`));
  const info = stmt.run(req.params.id);

  if(info.changes > 0) res.json({ succss: true });
  else res.status(404).json({ error: "Game not found." });
});

module.exports = router;