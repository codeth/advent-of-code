import {
  findWinningOutcomes,
  parseBoatRaceData,
  processExampleInput,
} from "./solver.js";

test("returns the expected values from the example input", async () => {
  const boatRaces = await parseBoatRaceData(processExampleInput);
  const winningOutcomes = findWinningOutcomes(boatRaces);

  // Part 1
  // expect(winningOutcomes).toEqual([4, 8, 9]);
  // expect(multiply(winningOutcomes)).toEqual(288);

  // Part 2
  expect(winningOutcomes[0]).toEqual(71503);
});

test("returns the correct sums from the input data", async () => {
  const boatRaces = await parseBoatRaceData();
  const winningOutcomes = findWinningOutcomes(boatRaces);

  // Part 1
  // expect(multiply(winningOutcomes)).toEqual(503424);

  // Part 2
  expect(winningOutcomes[0]).toEqual(32607562);
});
