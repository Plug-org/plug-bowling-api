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

export interface GameState {
  id: string;
  userId: string;
  frames: Frame[];
  currentFrameIndex: number;
  isComplete: boolean;
  createdAt?: string;
}
