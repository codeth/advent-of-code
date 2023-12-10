import {
  parseData,
  processExample2Input,
  processExampleInput,
  traverse,
} from "./solver.js";

test("returns the expected values from the example input", async () => {
  const tiles = await parseData(processExampleInput);

  const { steps } = traverse(tiles);

  expect(steps / 2).toEqual(4);
});

test("returns the expected values from the example 2 input", async () => {
  const tiles = await parseData(processExample2Input);

  const { steps } = traverse(tiles);

  expect(steps / 2).toEqual(8);
});

test("returns the correct sums from the input data", async () => {
  const tiles = await parseData();

  const { steps } = traverse(tiles);

  expect(steps / 2).toEqual(6842);
});
