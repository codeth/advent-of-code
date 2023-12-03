import { open } from "node:fs/promises";
import { join } from "node:path";

const __dirname = new URL(".", import.meta.url).pathname;

export type LineHandler = (line: string) => void | Promise<void>;
export type LineTransformer<Return = string> = (
  line: string,
) => Return | Promise<Return>;

export const processInput = async (processLine: LineHandler) => {
  const file = await open(join(__dirname, "input.txt"));

  for await (const line of file.readLines()) {
    try {
      await processLine(line);
    } catch (error) {
      console.log(`Unable to process`);
      console.error(error);
    }
  }
};

export const inputToArray = async <ItemType = string>(
  transformLine?: LineTransformer<ItemType>,
) => {
  const results: ItemType[] = [];

  const processLineAndPush = async (line: string) => {
    const processedLine = (await transformLine?.(line)) ?? (line as ItemType);
    results.push(processedLine);
  };

  await processInput(processLineAndPush);

  return results;
};

export enum NumberMap {
  one = 1,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
}

export type VerboseNumber = keyof typeof NumberMap;

export const oneToNine = Array(9)
  .fill(1)
  .map((value, index) => `${value + index}`);

export const verboseNumberEntries = (
  Object.entries(NumberMap) as [VerboseNumber, number][]
).filter(([key]) => !oneToNine.includes(key));

export const verboseNumberKeys = verboseNumberEntries.map(([key]) => key);

export interface CalibrationValueParts {
  first?: number;
  last?: number;
  line: string;
}

export interface MatchRange {
  first: RegExpMatchArray;
  last: RegExpMatchArray;
}

export const consolidateMatches = (...matches: (MatchRange | null)[]) => {
  return matches.reduce<MatchRange | null>((result, range) => {
    if (!result) return range;
    if (!range) return result;

    if (range.first.index! < result.first.index!) result.first = range.first;
    if (range.last.index! > result.last.index!) result.last = range.last;

    return result;
  }, null);
};

export const getFirstAndLastMatches = (matches: RegExpMatchArray[]) => {
  return matches.reduce<MatchRange | null>((result, match) => {
    if (!result)
      return {
        first: match,
        last: match,
      };

    if (match.index! < result.first.index!) result.first = match;
    if (match.index! > result.last.index!) result.last = match;

    return result;
  }, null);
};

export const extractDigits = (line: string): CalibrationValueParts => {
  const parts: CalibrationValueParts = { line };

  const verboseNumberRegex = new RegExp(
    `(?=(${verboseNumberKeys.join("|")}))`,
    "g",
  );

  const digits = [...line.matchAll(/\d/g)];
  const verboseNumbers = [...line.matchAll(verboseNumberRegex)];

  const digitMatches = getFirstAndLastMatches(digits);
  const verboseMatches = getFirstAndLastMatches(verboseNumbers);

  const matches = consolidateMatches(digitMatches, verboseMatches);

  if (!matches) throw new Error(`Invalid input: "${line}"`);

  const firstValue = (matches.first[1] || matches.first[0])!;
  const lastValue = (matches.last[1] || matches.last[0])!;

  parts.first =
    firstValue.length > 1
      ? NumberMap[firstValue as VerboseNumber]
      : parseInt(firstValue, 10);

  parts.last =
    lastValue.length > 1
      ? NumberMap[lastValue as VerboseNumber]
      : parseInt(lastValue, 10);

  return parts;
};

export const toCalibrationValue = (line: string) => {
  const { first, last } = extractDigits(line.trim());

  if (!first || !last) throw new Error(`Missing calibration values`);

  const calibrationValueString = `${first}${last}`;

  return parseInt(calibrationValueString, 10);
};

export const getCalibrationValues = async () => {
  return inputToArray(toCalibrationValue);
};

export const getSumOfCalibrationValues = (calibrationValues: number[]) => {
  return calibrationValues.reduce((sum, next) => {
    return sum + next;
  }, 0);
};
