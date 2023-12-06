import {
  findWinningOutcomes,
  multiply,
  parseBoatRaceData,
  processExampleInput,
} from "./solver.js";

test("returns the expected values from the example input", async () => {
  const boatRaces = await parseBoatRaceData(processExampleInput);
  const winningOutcomes = findWinningOutcomes(boatRaces);

  expect(winningOutcomes).toEqual([4, 8, 9]);
  expect(multiply(winningOutcomes)).toEqual(288);
});

test("returns the correct sums from the input data", async () => {
  const boatRaces = await parseBoatRaceData();
  const winningOutcomes = findWinningOutcomes(boatRaces);

  expect(multiply(winningOutcomes)).toEqual(503424);
});
