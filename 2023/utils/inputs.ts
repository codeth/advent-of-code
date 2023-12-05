import { open } from "node:fs/promises";
import { join } from "node:path";

export type LineHandler = (line: string, index: number) => void | Promise<void>;

export type LineTransformer<Return = string> = (
  line: string,
  index: number,
) => Return | Promise<Return>;

export type InputProcessor = (processLine: LineHandler) => Promise<void>;

export const makeInputProcessor =
  (directory: string, filename = "input.txt") =>
  async (processLine: LineHandler) => {
    const file = await open(join(directory, filename));

    let index = 0;

    for await (const line of file.readLines()) {
      try {
        await processLine(line, index);
        index++;
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

  const processLineAndPush = async (line: string, index: number) => {
    const processedLine =
      (await transformLine?.(line, index)) ?? (line as ItemType);
    results.push(processedLine);
  };

  await processInput(processLineAndPush);

  return results;
};
