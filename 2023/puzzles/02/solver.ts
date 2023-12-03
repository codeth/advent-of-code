import { fileURLToPath } from "node:url";
import path from "node:path";

import { inputToArray, makeInputProcessor } from "../../utils/inputs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processInput = makeInputProcessor(__dirname);

export interface CubeSample {
  red?: number;
  green?: number;
  blue?: number;
}

export interface GameRecord {
  id: number;
  reveals: CubeSample[];
}

export const toCubeSample = (sample: string): CubeSample => {
  const colorCounts = sample.split(", ");

  return colorCounts.reduce<CubeSample>((result, colorCount) => {
    const [count, color] = colorCount.split(" ");

    return {
      ...result,
      [color!]: parseInt(count!, 10),
    };
  }, {});
};

export const toGameRecord = (game: string): GameRecord => {
  const [gameId, ...reveals] = game
    .split(/(:|;) /g)
    .filter((value) => ![":", ";"].includes(value));

  if (!gameId) throw new Error("No game ID");

  return {
    id: parseInt(gameId.replace("Game ", ""), 10),
    reveals: reveals.map(toCubeSample),
  };
};

export const processGameData = async () => {
  return inputToArray(processInput, toGameRecord);
};

export interface GamePossibilities {
  possibleGames: GameRecord[];
  impossibleGames: GameRecord[];
}

export const calculatePossibilities = (
  games: GameRecord[],
  cubes: Required<CubeSample>,
): GamePossibilities => {
  return games.reduce<GamePossibilities>(
    (result, game) => {
      const isPossible = game.reveals.every((sample) => {
        return (Object.entries(sample) as [keyof CubeSample, number][]).every(
          ([color, count]) => count <= cubes[color],
        );
      });

      if (isPossible) {
        result.possibleGames.push(game);
      } else {
        result.impossibleGames.push(game);
      }

      return result;
    },
    { possibleGames: [], impossibleGames: [] },
  );
};

export const getSumOfGameIds = (games: GameRecord[]) => {
  return games.reduce((sum, next) => {
    return sum + next.id;
  }, 0);
};
