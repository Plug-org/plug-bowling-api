import GameEngine from "./gameEngine";

const myGame = new GameEngine("_id1");

//1
myGame.roll(2);
myGame.roll(2);

//2
myGame.roll(2);
myGame.roll(2);


//console.log(myGame.getState())
//console.log(myGame.getState().frames)
//console.log("game finished ?: ", myGame.getState().isComplete)
//console.log("TOTAL: ",myGame.getTotal())