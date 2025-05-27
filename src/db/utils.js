const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, '../../database.db');
const db = new Database(DB_FILE);


//read initial data from local users JSON file and seed DB
function seedUsers() {
    const filePath = path.join(__dirname, "/seed_users.json")
    const seedData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const insert = db.prepare('INSERT INTO users (name ) VALUES (?)');
    const insertMany = db.transaction((users) => {
      for (const user of users) insert.run(user.name);
    });

    insertMany(seedData);    
};


//read initial data from local games JSON file and seed DB
function seedGames() {
    const seedGamesFile = path.join(__dirname, 'seed_games.json');
    const gamesData = JSON.parse(fs.readFileSync(seedGamesFile, 'utf-8'));
    const insertGame = db.prepare(`
      INSERT INTO games (
        user_id, frames, current_frame_index, is_complete 
        ) VALUES (?, ?, ?, ?)
      `);

    gamesData.forEach((game) => {
      insertGame.run(
        game.userId,
        JSON.stringify(game.frames),
        game.currentFrameIndex,
        game.isComplete ? 1 : 0
      );
    });
};


//Utility to delete all tables related to this project.
function deleteTables() {
  db.prepare('DELETE FROM users').run();
  db.prepare('DELETE FROM games').run();
}


module.exports = { seedUsers, seedGames, deleteTables };