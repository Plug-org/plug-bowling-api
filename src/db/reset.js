const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, '../../database.db');
const db = new Database(DB_FILE);

async function resetDb () {
  try{
    //TODO add delete games table
    db.prepare('DELETE FROM users').run();
    const filePath = path.join(__dirname, "/seed_users.json")
    const seedData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const insert = db.prepare('INSERT INTO users (name ) VALUES (?)');
    const insertMany = db.transaction((users) => {
      for (const user of users) insert.run(user.name);
    });
    insertMany(seedData);
    console.log({ success: "Succesfully seeded database." });
  }catch{
    console.error({ error:"Failed to reset data." })
  }
};

resetDb();