const express = require("express");
const db = require('../db/init');
import type { Request, Response } from 'express';
const GameEngine = require('../gameEngine');
const normalizeGameStates = require('../utils/normalizeGameState');


const router = express.Router();


router.get("/", (req:Request, res:Response) => {
  const rawGames = db.prepare('SELECT * FROM games ORDER BY createdAt DESC').all();
  const games = normalizeGameStates(rawGames)
  res.json(games)
});


router.get("/:id", (req:Request, res:Response) => {
  const stmt = db.prepare("SELECT * FROM games WHERE id = ?");
  const rawGames = stmt.get(req.params.id);
  const games = normalizeGameStates(rawGames);

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
    id, userId, frames, currentFrameIndex, isComplete
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
   const rawGame = db.prepare('SELECT * FROM games WHERE id = ?').get(id);
   const newGame = normalizeGameStates(rawGame);
   res.json(newGame);
});

router.delete("/:id", (req:Request, res:Response) => {
  const stmt = db.prepare((`DELETE FROM games WHERE id = ?`));
  const info = stmt.run(req.params.id);

  if(info.changes > 0) res.json({ succss: true });
  else res.status(404).json({ error: "Game not found." });
});


//GAME PLAY
router.post("/rolls", (req:Request, res:Response) => {
  const { id, pins } = req.body;

  //checkout current game state by game id
  const stmt = db.prepare('SELECT * FROM games WHERE id = ?');
  const gameState = stmt.get(id);
  gameState.frames = JSON.parse(gameState.frames);
  
  //create game instance with existing game-state
  const game = new GameEngine(null,gameState);
  
  //call roll method
  game.roll(pins);
  
  //save updated state
  const updatedState = game.getState();
  updatedState.frames = JSON.stringify(updatedState.frames);

  db.prepare(`
    UPDATE games
    SET frames = ?, currentFrameIndex = ?, isComplete = ?
    WHERE id = ?
  `).run(
    updatedState.frames,
    updatedState.currentFrameIndex,
    updatedState.isComplete ? 1 : 0,
    id
  );

  //return state from db to client
  const result = db.prepare('SELECT * FROM games WHERE id = ?').get(id);
  const newState = normalizeGameStates(result)

  res.json(newState);
});

module.exports = router;