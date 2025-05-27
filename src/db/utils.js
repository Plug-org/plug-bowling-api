const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, '../../database.db');
const db = new Database(DB_FILE);


function seedUsers() {
    //read file
    const filePath = path.join(__dirname, "/seed_users.json")
    const seedData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    //populate user table
    const insert = db.prepare('INSERT INTO users (name ) VALUES (?)');
    const insertMany = db.transaction((users) => {
      for (const user of users) insert.run(user.name);
    });

    insertMany(seedData);    
};


function seedGames() {
    //read file
    const seedGamesFile = path.join(__dirname, 'seed_games.json');
    const gamesData = JSON.parse(fs.readFileSync(seedGamesFile, 'utf-8'));

    // get seeded user ids in order to preserve "ownership" 
    // of seeded games by users when id auto-increments on 'npm run reset'.
    // This way they stay in sync over time.
    const getUserIds = db.prepare('SELECT id FROM users ORDER BY id ASC').all();
    const userIds = getUserIds.map(user => user.id);

    //populate games table
    const insertGame = db.prepare(`
      INSERT INTO games (
        user_id, frames, current_frame_index, is_complete 
        ) VALUES (?, ?, ?, ?)
      `);
          
    gamesData.forEach((game, index) => {
      const userId = userIds[index];
      insertGame.run(
        userId,
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