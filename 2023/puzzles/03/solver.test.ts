import {
  findPartNumbers,
  flattenEngineSchematics,
  sumOfPartNumbers,
  toEngineSchematic,
} from "./solver.js";

test("returns the expected values from the example input", () => {
  const schematics = [
    "467..114..",
    "...*......",
    "..35..633.",
    "......#...",
    "617*......",
    ".....+.58.",
    "..592.....",
    "......755.",
    "...$.*....",
    ".664.598..",
  ].map(toEngineSchematic);

  const { symbols, numbers } = flattenEngineSchematics(schematics);
  const partNumbers = findPartNumbers({ symbols, numbers });

  expect(partNumbers).not.toContain(114);
  expect(partNumbers).not.toContain(58);
  expect(sumOfPartNumbers(partNumbers)).toEqual(4361);
});

test("returns the correct sums from the input data", async () => {});
