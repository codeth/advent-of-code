import { fileURLToPath } from "node:url";
import path from "node:path";

import { inputToArray, makeInputProcessor } from "../../utils/inputs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processInput = makeInputProcessor(__dirname);
export const processExampleInput = makeInputProcessor(__dirname, "example.txt");

export interface OasisEnvironmentalRecord {
  history: number[];
  sequences: number[][];
}

export interface OasisEnvironmentalForecast extends OasisEnvironmentalRecord {
  predictions: number[];
}

export const getSequence = (readings: number[]) => {
  return readings.reduce<number[]>((seq, value, index) => {
    if (index === 0) return seq;

    const previousValue = readings[index - 1]!;

    const difference = Math.abs(value - previousValue);

    return [...seq, value < previousValue ? -difference : difference];
  }, []);
};

export const getSequences = (readings: number[]) => {
  const sequences: number[][] = [readings];
  let isResolved = false;

  while (!isResolved) {
    const previousSequence = sequences[sequences.length - 1]!;
    const nextSequence = getSequence(previousSequence);

    isResolved = nextSequence.every((value) => value === 0);

    if (!isResolved) sequences.push(nextSequence);
  }

  return sequences;
};

export const predictNextReading = (record: OasisEnvironmentalRecord) => {
  const nextValues = record.sequences
    .reverse()
    .reduce<number[]>((results, seq, index) => {
      const latestValue = seq[seq.length - 1]!;

      if (index === 0) return [latestValue];

      const previousResult = results[results.length - 1]!;

      return [...results, latestValue + previousResult];
    }, []);

  return nextValues.pop()!;
};

export const generateForecasts = (
  records: OasisEnvironmentalRecord[],
): OasisEnvironmentalForecast[] => {
  return records.map((record) => ({
    ...record,
    predictions: [predictNextReading(record)],
  }));
};

export const toOasisEnvironmentalRecord = (
  line: string,
): OasisEnvironmentalRecord => {
  const history = line.split(" ").map((value) => parseInt(value, 10));
  const sequences = getSequences(history);

  return {
    history,
    sequences,
  };
};

export const parseData = async (inputProcessor = processInput) => {
  return await inputToArray(inputProcessor, toOasisEnvironmentalRecord);
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
