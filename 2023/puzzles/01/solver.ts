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
      console.log(`processing "${line}"`);

      await processLine(line);

      console.log(`processed "${line}"`);
    } catch (error) {
      console.log(`unable to process "${line}"`);
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

export const extractNumbers = (line: string) => {
  return line.replaceAll(/\D/g, "");
};

export const getCalibrationValue = (line: string) => {
  const numbersOnly = extractNumbers(line);
  const first = numbersOnly[0];
  const last = numbersOnly[numbersOnly.length - 1];

  if (!first || !last)
    throw new Error(`Missing calibration values: ` + { first, last, line });

  const calibrationValueString = `${first}${last}`;

  return Number(calibrationValueString);
};

export const getCalibrationValues = async () => {
  return inputToArray(getCalibrationValue);
};

export const getSumOfCalibrationValues = (calibrationValues: number[]) => {
  return calibrationValues.reduce((sum, next) => {
    return sum + next;
  }, 0);
};
