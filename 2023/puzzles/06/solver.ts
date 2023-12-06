import { fileURLToPath } from "node:url";
import path from "node:path";

import { inputToArray, makeInputProcessor } from "../../utils/inputs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processInput = makeInputProcessor(__dirname);
export const processExampleInput = makeInputProcessor(__dirname, "example.txt");

export interface BoatRaceData {
  time: number;
  distance: number;
}

export interface BoatRaceOutcome {
  spoolTime: number;
  speed: number;
  distance: number;
}

export interface BoatRace extends BoatRaceData {
  outcomes: BoatRaceOutcome[];
}

export const toTimeAndDistance = (line: string): number[] => {
  const digits = [...line.matchAll(/\d+/g)];
  return digits.map((digit) => parseInt(digit[0], 10));
};

export const calculateOutcome = (
  spoolTime: number,
  totalTime: number,
): BoatRaceOutcome => {
  const speed = spoolTime;
  const remainingTime = totalTime - spoolTime;
  const distance = remainingTime * speed;

  return {
    spoolTime,
    speed,
    distance,
  };
};

export const calculateOutcomes = ({
  time,
  distance,
}: BoatRaceData): BoatRace => {
  const outcomes = new Array(time - 1)
    .fill(1)
    .map((t, i) => t + i)
    .map((spoolTime) => calculateOutcome(spoolTime, time));

  return {
    time,
    distance,
    outcomes,
  };
};

export const parseBoatRaceData = async (inputProcessor = processInput) => {
  const [times, distances] = await inputToArray(
    inputProcessor,
    toTimeAndDistance,
  );

  const data = times!.map<BoatRaceData>((time, index) => {
    return {
      time,
      distance: distances![index]!,
    };
  });

  return data.map(calculateOutcomes);
};

export const findWinningOutcomes = (boatRaces: BoatRace[]) => {
  return boatRaces.map(({ outcomes, distance }) => {
    return outcomes.filter((outcome) => outcome.distance > distance).length;
  });
};

export const multiply = (values: number[]) => {
  return values.reduce((result, next) => {
    if (!result) return next;
    return result * next;
  });
};

export const sumOf = (values: number[]) => {
  return values.reduce((sum, next) => {
    return sum + next;
  }, 0);
};
