const {seedUsers, seedGames } = require("./utils");


async function seedDb () {
  try{
    seedUsers();
    seedGames();  
    console.log({ success: "Succesfully seeded database." });
  }catch(err){
    console.error({ error:"Failed to seed data", message:err })
  }
};

seedDb();
