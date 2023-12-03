import {
  toCalibrationValue,
  getCalibrationValues,
  getSumOfCalibrationValues,
  extractDigits,
  processInput,
} from "./solver.js";
import { inputToArray } from "../../utils/inputs.js";

test("returns the expected values from the example input", () => {
  const calibrationValues = [
    "two1nine",
    "eightwothree",
    "abcone2threexyz",
    "xtwone3four",
    "4nineeightseven2",
    "zoneight234",
    "7pqrstsixteen",
  ].map(toCalibrationValue);

  expect(calibrationValues).toEqual([29, 83, 13, 24, 42, 14, 76]);
  expect(getSumOfCalibrationValues(calibrationValues)).toEqual(281);
});

test("extractNumbers transforms verbose numbers", () => {
  // this was a particularly tricky value to get right due to the overlapping matches at the end
  const result = extractDigits("ninesevensrzxkzpmgz8kcjxsbdftwoner");

  expect(result.first).toEqual(9);
  expect(result.last).toEqual(1);
});

test("getCalibrationValue returns a two-digit number", async () => {
  const calibrationValue = toCalibrationValue(
    "ninesevensrzxkzpmgz8kcjxsbdftwoner",
  );

  expect(calibrationValue).toBe(91);
});

test("getCalibrationValues returns an array of two-digit numbers", async () => {
  const calibrationValues = await getCalibrationValues();

  calibrationValues.forEach((value) => {
    expect(value).toEqual(expect.any(Number));
    expect(`${value}`).toHaveLength(2);
  });
});

test("getCalibrationValues matches the input length", async () => {
  const processedInput = await inputToArray(processInput);
  const calibrationValues = await getCalibrationValues();

  expect(calibrationValues).toHaveLength(processedInput.length);
});

test("getSumOfCalibrationValues returns a number", async () => {
  const sumOfCalibrationValues = getSumOfCalibrationValues(
    await getCalibrationValues(),
  );

  expect(sumOfCalibrationValues).toBeGreaterThan(0);
});

test("getSumOfCalibrationValues returns 54770", async () => {
  const sumOfCalibrationValues = getSumOfCalibrationValues(
    await getCalibrationValues(),
  );

  expect(sumOfCalibrationValues).toEqual(54770);
});
