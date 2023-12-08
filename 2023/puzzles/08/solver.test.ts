import { end, parseData, processExampleInput, start, walk } from "./solver.js";

test("returns the expected values from the example input", async () => {
  const data = await parseData(processExampleInput);

  const { totalSteps } = walk(start, end, data);

  expect(totalSteps).toEqual(2);
});

test("returns the correct sums from the input data", async () => {
  const data = await parseData();

  const { totalSteps } = walk(start, end, data);

  expect(totalSteps).toEqual(19637);
});
