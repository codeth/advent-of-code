import {
  end,
  findOptimalGhostWalkSteps,
  parseData,
  processExample2Input,
  processExampleInput,
  start,
  walk,
} from "./solver.js";

test("returns the expected values from the example input", async () => {
  const data = await parseData(processExampleInput);

  const walked = walk(start, end, data);

  expect(walked.totalSteps).toEqual(2);
});

test("returns the expected values from the part 2 example input", async () => {
  const data = await parseData(processExample2Input);

  const { optimalSteps } = findOptimalGhostWalkSteps("A", "Z", data);

  expect(optimalSteps).toEqual(6);
});

test("returns the correct sums from the input data", async () => {
  const data = await parseData();

  // Part 1
  const walked = walk(start, end, data);
  expect(walked.totalSteps).toEqual(19637);

  // Part 2
  const { optimalSteps } = findOptimalGhostWalkSteps("A", "Z", data);
  expect(optimalSteps).toEqual(8811050362409);
});
