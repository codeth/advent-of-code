import {
  findLowestLocation,
  parseAlmanacData,
  processExampleInput,
} from "./solver.js";

test("returns the expected values from the example input", async () => {
  const almanac = await parseAlmanacData(processExampleInput);

  // Part 1
  // const seeds = collectSeedData(almanac);
  // const lowestSeed = findSeedWithLowestLocation(seeds);
  // expect(lowestSeed?.id).toEqual(13);
  // expect(lowestSeed?.location).toEqual(35);

  // Part 2
  const lowestLocation = findLowestLocation(almanac);
  expect(lowestLocation).toEqual(46);
});

test("returns the correct sums from the input data", async () => {
  const almanac = await parseAlmanacData();

  // Part 1
  // const seeds = collectSeedData(almanac);
  // const lowestSeed = findSeedWithLowestLocation(seeds);
  // expect(lowestSeed?.location).toEqual(462648396);

  // Part 2
  const lowestLocation = findLowestLocation(almanac);
  expect(lowestLocation).toEqual(2520479);
});
