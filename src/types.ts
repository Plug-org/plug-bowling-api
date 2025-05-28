export type Roll = number;

export interface User {
  id: string;
  name: string;
  createdAt: string;
};

export interface Frame {  
  rolls: Roll[];
  score?: number;
  isStrike?: boolean;
  isSpare?: boolean;
};

type GameStateBase = {
  id: string;
  frames: Frame[];
  currentFrameIndex: number;
  isComplete: boolean;
};

export interface NewGameState extends GameStateBase {
  userId?: string;
  createdAt?: string;
}

export interface ExistingGameState extends GameStateBase {
  userId: string;
  createdAt: string;
}

export type GameState = NewGameState | ExistingGameState;
