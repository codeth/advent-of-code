import {
  generateForecasts,
  parseData,
  processExampleInput,
  sumOf,
} from "./solver.js";

test("returns the expected values from the example input", async () => {
  const records = await parseData(processExampleInput);

  const forecasts = generateForecasts(records);

  expect(sumOf(forecasts.map(({ predictions }) => predictions[0]!))).toEqual(
    114,
  );
});

test("returns the correct sums from the input data", async () => {
  const records = await parseData();

  const forecasts = generateForecasts(records);

  expect(sumOf(forecasts.map(({ predictions }) => predictions[0]!))).toEqual(
    1743490457,
  );
});
