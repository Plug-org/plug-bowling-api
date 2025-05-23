import GameEngine from "./gameEngine";

function runGame(){
  const myGame = new GameEngine("_id1");
  
  //perfect score game
  myGame.roll(10);
  myGame.roll(10);
  myGame.roll(10);
  myGame.roll(10);
  myGame.roll(10);
  myGame.roll(10);
  myGame.roll(10);
  myGame.roll(10);
  myGame.roll(10);
  myGame.roll(10);
  myGame.roll(10);
  myGame.roll(10)
  
  
  //console.log(myGame.getState())
  console.log(myGame.getState().frames)
  console.log("game finished ?: ", myGame.getState().isComplete)
  console.log("TOTAL: ",myGame.getTotal())
};

export default runGame;