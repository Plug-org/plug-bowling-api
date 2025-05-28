const Database = require('better-sqlite3');
const path = require('path');
const { initialUsers, initialGames } = require("./consts");

const DB_FILE = path.resolve(__dirname, '../../database.db');
const db = new Database(DB_FILE);


function seedUsers() {
    const insert = db.prepare('INSERT INTO users (id, name ) VALUES (?,?)');
    const insertMany = db.transaction((users) => {
      for (const user of users) insert.run(user.id, user.name);
    });

    insertMany(initialUsers);  
};


function seedGames() {
    // get seeded user ids in order to preserve "ownership" of games.
    const getUserIds = db.prepare('SELECT id FROM users ORDER BY id ASC').all();
    const userIds = getUserIds.map(user => user.id);

    const insertGame = db.prepare(`
      INSERT INTO games (
        id, user_id, frames, current_frame_index, is_complete 
        ) VALUES (?, ?, ?, ?, ?)
      `);
          
    initialGames.forEach((game, index) => {
      const userId = userIds[index];
      insertGame.run(
        game.id,
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