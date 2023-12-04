import {
  calculateGearRatios,
  findGearParts,
  findPartNumbers,
  flattenEngineSchematics,
  processSchematicData,
  sumOf,
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
  expect(sumOf(partNumbers)).toEqual(4361);

  // Part 2
  const gearParts = findGearParts({ symbols, numbers });
  const gearRatios = calculateGearRatios(gearParts);

  expect(gearRatios).toEqual([16345, 451490]);
  expect(sumOf(gearRatios)).toEqual(467835);
});

test("returns the correct sums from the input data", async () => {
  const { symbols, numbers } = await processSchematicData();

  const partNumbers = findPartNumbers({ symbols, numbers });

  expect(sumOf(partNumbers)).toEqual(526404);

  // Part 2
  const gearParts = findGearParts({ symbols, numbers });
  const gearRatios = calculateGearRatios(gearParts);

  expect(sumOf(gearRatios)).toEqual(84399773);
});
