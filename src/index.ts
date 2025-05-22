import GameEngine from "./gameEngine";

const myGame = new GameEngine("_id1");

//1
myGame.roll(4);
myGame.roll(1);
//2
myGame.roll(4)
myGame.roll(6)
//3
myGame.roll(10)
//myGame.roll(1)
//4
myGame.roll(4)
myGame.roll(5)
//5
myGame.roll(7)
myGame.roll(2)
//6
myGame.roll(8)
myGame.roll(1)
//7
myGame.roll(1)
myGame.roll(2)
//8
myGame.roll(2)
myGame.roll(8)
//9
myGame.roll(5)
myGame.roll(5)

//10
myGame.roll(10)
myGame.roll(10)
myGame.roll(10)





const total = myGame.getState().frames.reduce((sum, frame) => {
  return sum + (frame.score ?? 0);
},0);

console.log(myGame.getState().frames)
console.log("game finished ?: ", myGame.getState().isComplete)
console.log("TOTAL: ",total)