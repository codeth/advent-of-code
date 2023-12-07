import {
  parseCamelCardsData,
  processExampleInput,
  rankHands,
  totalWinnings,
} from "./solver.js";

test("returns the expected values from the example input", async () => {
  const hands = await parseCamelCardsData(processExampleInput);

  const rankedHands = rankHands(hands);

  expect(totalWinnings(rankedHands)).toEqual(6440);
});

test("returns the correct sums from the input data", async () => {
  const hands = await parseCamelCardsData();

  const rankedHands = rankHands(hands);

  expect(totalWinnings(rankedHands)).toEqual(253603890);
});
