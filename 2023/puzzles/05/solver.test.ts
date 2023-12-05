import {
  collectSeedData,
  findSeedWithLowestLocation,
  parseAlmanacData,
  processExampleInput,
} from "./solver.js";

test("returns the expected values from the example input", async () => {
  const almanac = await parseAlmanacData(processExampleInput);

  const seeds = collectSeedData(almanac);
  const lowestSeed = findSeedWithLowestLocation(seeds);

  expect(lowestSeed?.id).toEqual(13);
  expect(lowestSeed?.location).toEqual(35);
});

test("returns the correct sums from the input data", async () => {
  const almanac = await parseAlmanacData();

  const seeds = collectSeedData(almanac);
  const lowestSeed = findSeedWithLowestLocation(seeds);

  expect(lowestSeed?.location).toEqual(462648396);
});
