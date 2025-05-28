const { seedUsers, seedGames, deleteTables } = require("./utils");

async function resetDb () {
  try{    
    deleteTables();    
    seedUsers();
    seedGames();
    console.log({ success: "Succesfully seeded database." });
  }catch{
    console.error({ error:"Failed to reset data." })
  }
};

resetDb();