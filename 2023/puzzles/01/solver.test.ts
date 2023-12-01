import {
  getCalibrationValues,
  getSumOfCalibrationValues,
  inputToArray,
} from "./solver.js";

test("getCalibrationValues returns an array of two-digit numbers", async () => {
  const calibrationValues = await getCalibrationValues();

  calibrationValues.forEach((value) => {
    expect(value).toEqual(expect.any(Number));
    expect(`${value}`).toHaveLength(2);
  });
});

test("getCalibrationValues matches the input length", async () => {
  const processedInput = await inputToArray();
  const calibrationValues = await getCalibrationValues();

  expect(calibrationValues).toHaveLength(processedInput.length);
});

test("getSumOfCalibrationValues returns a number", async () => {
  const sumOfCalibrationValues = getSumOfCalibrationValues(
    await getCalibrationValues(),
  );

  expect(sumOfCalibrationValues).toBeGreaterThan(0);
});

test("getSumOfCalibrationValues returns 54630", async () => {
  const sumOfCalibrationValues = getSumOfCalibrationValues(
    await getCalibrationValues(),
  );

  expect(sumOfCalibrationValues).toEqual(54630);
});
