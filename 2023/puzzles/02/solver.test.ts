import {
  calculatePossibilities,
  getSumOfGameIds,
  getSumOfGamePower,
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

  expect(exampleInput[0]?.power).toEqual(48);
  expect(exampleInput[1]?.power).toEqual(12);
  expect(exampleInput[2]?.power).toEqual(1560);
  expect(exampleInput[3]?.power).toEqual(630);
  expect(exampleInput[4]?.power).toEqual(36);
  expect(getSumOfGamePower(exampleInput)).toEqual(2286);
});

test("returns the correct sums from the input data", async () => {
  const games = await processGameData();

  const { possibleGames } = calculatePossibilities(games, {
    red: 12,
    green: 13,
    blue: 14,
  });

  expect(getSumOfGameIds(possibleGames)).toEqual(2377);
  expect(getSumOfGamePower(games)).toEqual(71220);
});
