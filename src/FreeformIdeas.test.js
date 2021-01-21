import { calcCoords } from "./FreeformIdeas";

test("Right-middle", () => {
  const idea = { height: 10, width: 10, top: 0, left: 0 };
  const value = calcCoords(idea, 0);
  expect(value).toEqual([5, 10]);
});

test("Right-middle translated", () => {
  const idea = { height: 10, width: 10, top: 12, left: 78 };
  const value = calcCoords(idea, 0);
  expect(value).toEqual([17, 88]);
});

test("Bottom-right corner", () => {
  const idea = { height: 10, width: 10, top: 0, left: 0 };
  const value = calcCoords(idea, 45);
  expect(value).toEqual([10, 10]);
});

test("Top-right corner", () => {
  const idea = { height: 10, width: 10, top: 0, left: 0 };
  const value = calcCoords(idea, -45);
  expect(value).toEqual([0, 10]);
});

test("Bottom-middle", () => {
  const idea = { height: 10, width: 10, top: 0, left: 0 };
  const value = calcCoords(idea, 90);
  expect(value).toEqual([10, 5]);
});

test("Bottom-middle translated", () => {
  const idea = { height: 10, width: 10, top: 27, left: 89 };
  const value = calcCoords(idea, 90);
  expect(value).toEqual([37, 94]);
});

test("Top-middle", () => {
  const idea = { height: 10, width: 10, top: 0, left: 0 };
  const value = calcCoords(idea, -90);
  expect(value).toEqual([0, 5]);
});

test("Bottom-left corner", () => {
  const idea = { height: 10, width: 10, top: 0, left: 0 };
  const value = calcCoords(idea, 135);
  expect(value).toEqual([10, 0]);
});

test("Left-middle", () => {
  const idea = { height: 10, width: 10, top: 0, left: 0 };
  const value = calcCoords(idea, 180);
  expect(value).toEqual([5, 0]);
});

test("Right, lower side", () => {
  const idea = { height: 15, width: 5, top: 0, left: 0 };
  const value = calcCoords(idea, 45);
  expect(value).toEqual([10, 5]);
});

test("Bottom, right side", () => {
  const idea = { height: 5, width: 15, top: 0, left: 0 };
  const value = calcCoords(idea, 45);
  expect(value).toEqual([5, 10]);
});

test("Top, left side", () => {
  const idea = { height: 5, width: 15, top: 0, left: 0 };
  const value = calcCoords(idea, -135);
  expect(value).toEqual([0, 5]);
});

test("Left, top side", () => {
  const idea = { height: 15, width: 5, top: 0, left: 0 };
  const value = calcCoords(idea, -135);
  expect(value).toEqual([5, 0]);
});

test("Zero-area idea", () => {
  const idea = { height: 0, width: 0, top: 4, left: 7 };
  const value = calcCoords(idea, 82.3);
  expect(value).toEqual([4, 7]);
});
