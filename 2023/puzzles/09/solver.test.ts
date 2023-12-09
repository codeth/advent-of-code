import {
  generateForecasts,
  parseData,
  processExampleInput,
  sumOf,
} from "./solver.js";

test("returns the expected values from the example input", async () => {
  const records = await parseData(processExampleInput);

  const forecasts = generateForecasts(records);

  // Part 1
  expect(
    sumOf(forecasts.map(({ predictions }) => predictions.future[0]!)),
  ).toEqual(114);

  // Part 2
  expect(
    sumOf(forecasts.map(({ predictions }) => predictions.past[0]!)),
  ).toEqual(2);
});

test("returns the correct sums from the input data", async () => {
  const records = await parseData();

  const forecasts = generateForecasts(records);

  // Part 1
  expect(
    sumOf(forecasts.map(({ predictions }) => predictions.future[0]!)),
  ).toEqual(1743490457);

  // Part 2
  expect(
    sumOf(forecasts.map(({ predictions }) => predictions.past[0]!)),
  ).toEqual(1053);
});
