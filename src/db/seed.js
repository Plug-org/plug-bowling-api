const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, '../../database.db');
const db = new Database(DB_FILE);

async function seedDb () {
  try{
    const filePath = path.join(__dirname, "/seed_users.json")
    console.log(filePath)
    const seedData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const insert = db.prepare('INSERT INTO users (name ) VALUES (?)');
    const insertMany = db.transaction((users) => {
      for (const user of users) insert.run(user.name);
    });
    insertMany(seedData);
    console.log({ success: "Succesfully seeded database." });
  }catch(err){
    console.error({ error:"Failed to seed data", message:err })
  }
};

seedDb();