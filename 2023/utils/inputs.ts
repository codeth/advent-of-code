import { open } from "node:fs/promises";
import { join } from "node:path";

export type LineHandler = (line: string) => void | Promise<void>;

export type LineTransformer<Return = string> = (
  line: string,
) => Return | Promise<Return>;

export type InputProcessor = (processLine: LineHandler) => Promise<void>;

export const makeInputProcessor =
  (directory: string) => async (processLine: LineHandler) => {
    const file = await open(join(directory, "input.txt"));

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
  processInput: InputProcessor,
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
