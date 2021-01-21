import { calcCoords } from "./FreeformIdeas";

test("Simple no-rotation", () => {
  const value = calcCoords(10, 10, 0, 0, 0);
  expect(value).toEqual([5, 10]);
});

test("No-rotation translated", () => {
  const value = calcCoords(10, 10, 0, 12, 78);
  expect(value).toEqual([17, 88]);
});

test("Bottom-right corner", () => {
  const value = calcCoords(10, 10, 45, 0, 0);
  expect(value).toEqual([10, 10]);
});

test("Top-right corner", () => {
  const value = calcCoords(10, 10, -45, 0, 0);
  expect(value).toEqual([0, 10])
});

test("Bottom-middle" , () => {
  const value = calcCoords(10, 10, 90, 0, 0);
  expect(value).toEqual([10, 5]);
});

test("Top-middle", () => {
  const value = calcCoords(10, 10, -90, 0, 0);
  expect(value).toEqual([0, 5]);
});

test("Bottom-left corner", () => {
  const value = calcCoords(10, 10, 135, 0, 0);
  expect(value).toEqual([10, 0]);
});

test("Left-middle", () => {
  const value = calcCoords(10, 10, 180, 0, 0);
  expect(value).toEqual([5, 0]);
});

test("Right, lower side", () => {
  const value = calcCoords(15, 5, 45, 0, 0);
  expect(value).toEqual([10, 5]);
});

test("Bottom, right side", () => {
  const value = calcCoords(5, 15, 45, 0, 0);
  expect(value).toEqual([5, 10]);
});

test("Top, left side", () => {
  const value = calcCoords(5, 15, -135, 0, 0);
  expect(value).toEqual([0, 5]);
});

test("Left, top side", () => {
  const value = calcCoords(15, 5, -135, 0, 0);
  expect(value).toEqual([5, 0]);
});

test("Zero-area idea", () => {
  const value = calcCoords(0, 0, 82.3, 4, 7);
  expect(value).toEqual([4, 7]);
});