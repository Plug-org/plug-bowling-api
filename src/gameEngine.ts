const { v4: uuidv4 } = require('uuid');
import type { Frame, GameState } from './types';

class GameEngine {
  private state: GameState;

  constructor(userId: string, existingState?: GameState){
    this.state = existingState ?? {
      id: uuidv4(),
      userId,
      frames: [],
      currentFrameIndex: 0,
      isComplete: false,
    };
  }

  public getState(): GameState {
    return this.state;
  }
  public getTotal(): number {
    return this.state.frames.reduce((sum, frame) => {
      return sum + (frame.score ?? 0);
    },0)
  }

  public roll(pins: number): GameState {
    if (this.state.isComplete) throw new Error("Game is already finished.");
    if (pins < 0 || pins > 10 ) throw new Error('Invalid number of pins');

    const { frames, currentFrameIndex } = this.state;
    const isFinalFrame = currentFrameIndex === 9;

    //Create new frame if necessary
    if ( !frames[currentFrameIndex]) {
      frames[currentFrameIndex] = { rolls: [] };
    }

    const currentFrame = frames[currentFrameIndex];
    
    //Guard against illegal totals i.e. 11+ in a single frame (except the final frame)
    if(!isFinalFrame && currentFrame.rolls.length === 1){
      const firstRoll = currentFrame.rolls[0];
      if(firstRoll + pins > 10){
        throw new Error('Total pins in a frame cannot exceed 10.')
      }
    }
    //Guard against illegal totals in the final frame (i.e. in the first two rolls)
    if (isFinalFrame) {
      this.validateFinalFrameRoll(currentFrame, pins)
    }

    currentFrame.rolls.push(pins);

    //handle strike
    if(!isFinalFrame && currentFrame.rolls[0] === 10){
      currentFrame.isStrike = true;
      this.advanceFrame();
    }
    //hanlde spare
    else if ( !isFinalFrame && currentFrame.rolls.length === 2){
      const total = currentFrame.rolls[0] + currentFrame.rolls[1];
      currentFrame.isSpare = total === 10;
      this.advanceFrame();
    }
    //Final frame logic
    else if ( isFinalFrame ) {
      this.handleFinalFrame(currentFrame);
    }

    this.updateScore();
    return this.state;
  }

  private advanceFrame(): void {
    this.state.currentFrameIndex++;
    if (this.state.currentFrameIndex > 9) {
      this.state.isComplete = true;
    }
  }

/**
   * handleFinalFrame()
   * checks if player should get a third roll in the final frame
   * (e.g they get a strike or spare on the first or second roll
   * then they should get a third roll)
*/
  private handleFinalFrame(frame: Frame): void {
    const [first, second] = frame.rolls;

    if (frame.rolls.length === 2 && (first + second < 10)) {
      this.state.isComplete = true;      
    }else if  (frame.rolls.length === 3) {
      this.state.isComplete = true;
    }
  }

/**
   * validateFinalFrameRoll()
   * This guards agains getting 11+ points on a given roll in the final frame.
   * 
*/
  private validateFinalFrameRoll(frame: Frame, pins: number): void {
    const rolls = frame.rolls;

    if (rolls.length === 1) {
      const first = rolls[0];
      if (first !== 10 && first + pins > 10) {
        throw new Error(
          'In the final frame, the total of the first two rolls cannot exceed 10 unless the first roll is a strike.'
        );
      }
    }

    if (rolls.length === 2) {
      const [first, second] = rolls;
      const isStrike = first === 10;
      const isSpare = first + second === 10;

      if (!isStrike && !isSpare) {
        throw new Error(
          'No third roll allowed in the final frame unless the player scored a strike or spare.'
        );
      }
    }

    if (rolls.length >= 3) {
      throw new Error('No more than 3 rolls allowed in the final frame.');
    }
  }

  private updateScore(): void {
    const frames = this.state.frames;

    for(let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      if (frame.score !== undefined) continue;

      //Final frame (can have 3 rolls so check this first)
      if(i === 9 ){
        if (this.state.isComplete) {
          frame.score = frame.rolls.reduce((sum, pins) => sum + pins, 0);
        }
        continue;
      }

      //Normal frame
      const [first, second] = frame.rolls;

      //Strike
      if (frame.isStrike) {
        const bonus = this.getNextRolls(i, 2);
        if (bonus.length < 2) continue;
        frame.score = 10 + (bonus[0] ?? 0) + (bonus[1] ?? 0)
      }
      //Spare
      else if (frame.isSpare) {
        const bonus = this.getNextRolls(i, 1);
        if (bonus.length < 1) continue;
        frame.score = 10 + bonus[0]
      }
      //Open frame
      else if (frame.rolls.length === 2) {
        frame.score = first + second;
      }
    } 
  }

/** 
 * getNextRolls()
 * Collects the next `count` rolls starting from the frame after `startIndex`.
 * Used for calculating bonus points for strikes and spares.
 * 
 * For example, after a strike, you need the next two rolls from subsequent frames.
*/
  private getNextRolls(startIndex: number, count:number): number[] {
    const rolls: number[] = [];
    for(let i = startIndex +1; i < this.state.frames.length && rolls.length < count; i++) {
      rolls.push(...this.state.frames[i].rolls);
    }
    return rolls.slice(0, count);
  }
};

export default GameEngine;



function runGame(){
  const myGame = new GameEngine("_id1");
  
  myGame.roll(5);
  
  console.log(myGame.getState())
  console.log(myGame.getState().frames)
};

runGame()