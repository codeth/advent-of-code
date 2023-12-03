import {
  calculatePossibilities,
  getSumOfGameIds,
  processGameData,
  toGameRecord,
} from "./solver.js";

test("returns the expected values from the example input", () => {
  const exampleInput = [
    "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
    "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
    "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
    "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
    "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
  ].map(toGameRecord);

  const { possibleGames, impossibleGames } = calculatePossibilities(
    exampleInput,
    {
      red: 12,
      green: 13,
      blue: 14,
    },
  );

  expect(possibleGames).toHaveLength(3);
  expect(impossibleGames).toHaveLength(2);
  expect(getSumOfGameIds(possibleGames)).toEqual(8);
});

test("returns a sum of 2377 from the input data", async () => {
  const { possibleGames } = calculatePossibilities(await processGameData(), {
    red: 12,
    green: 13,
    blue: 14,
  });

  expect(getSumOfGameIds(possibleGames)).toEqual(2377);
});
