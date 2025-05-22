import { v4 as uuidv4 } from 'uuid';
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

  private handleFinalFrame(frame: Frame): void {
    const [first, second] = frame.rolls;

    if (frame.rolls.length === 2 && (first + second < 10)) {
      this.state.isComplete = true;      
    }else if  (frame.rolls.length === 3) {
      this.state.isComplete = true;
    }
  }

  private updateScore(): void {
    const frames = this.state.frames;

    for(let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      if (frame.score !== undefined) continue;

      //Normal frame
      const [first, second] = frame.rolls;

      //Strike
      if (frame.isStrike) {
        const bonus = this.getNextRolls(i, 2);
        if (bonus.length < 1) continue;
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
      //Final frame (can have 3 rolls)
      if (i === 9 && frame.rolls.length >= 2) {
        frame.score = frame.rolls. reduce((sum, pins) => sum + pins, 0);
      }
    } 
  }

  private getNextRolls(startIndex: number, count:number): number[] {
    const rolls: number[] = [];
    for(let i = startIndex +1; i < this.state.frames.length && rolls.length < count; i++) {
      rolls.push(...this.state.frames[i].rolls);
    }
    return rolls.slice(0, count);
  }
};

export default GameEngine;