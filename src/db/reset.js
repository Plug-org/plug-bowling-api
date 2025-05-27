const { seedUsers, seedGames, deleteTables } = require("./utils");

async function resetDb () {
  try{
    
    //delete games and users tables
    deleteTables();    
    
    //seed scripts
    seedUsers();
    seedGames();

    console.log({ success: "Succesfully seeded database." });
  }catch{
    console.error({ error:"Failed to reset data." })
  }
};

resetDb();