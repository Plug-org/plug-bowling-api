import type { ExistingGameState } from "../types";
type GameRow = {
  id: string;
  userId: string;
  frames: string; // stringified JSON
  currentFrameIndex: number;
  isComplete: 0 | 1;
  createdAt: string;
  updatedAt?: string;
};

function normalizeGameStates<T extends GameRow | GameRow[]>(data: T): T extends GameRow[] ? ExistingGameState[] : ExistingGameState {
  if (Array.isArray(data)) {
    return data.map(normalizeGameState) as any;
  } else {
    return normalizeGameState(data) as any;
  }
}

function normalizeGameState(row: GameRow): ExistingGameState {
  return {
    ...row,
    frames: JSON.parse(row.frames),
    isComplete: Boolean(row.isComplete),
  };
}

module.exports = normalizeGameStates;