import { fileURLToPath } from "node:url";
import path from "node:path";

import { inputToArray, makeInputProcessor } from "../../utils/inputs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processInput = makeInputProcessor(__dirname);
export const processExampleInput = makeInputProcessor(__dirname, "example.txt");
export const processExample2Input = makeInputProcessor(
  __dirname,
  "example-2.txt",
);

export const start = "AAA";
export const end = "ZZZ";

export type Direction = "L" | "R";

export type Directions = Direction[];

export interface DesertNode {
  location: string;
  waypoint: Record<Direction, string>;
}

export interface DesertPathData {
  directions: Directions;
  nodes: DesertNode[];
}

const move = (
  currentNode: DesertNode,
  pathIndex: number,
  { directions, nodes }: DesertPathData,
) => {
  const nextLocation = currentNode.waypoint[directions[pathIndex]!];
  const nextNode = nodes.find(({ location }) => location === nextLocation);

  if (!nextNode)
    throw new Error(`Unable to find next location: ${nextLocation}`);

  return nextNode;
};

export const walk = (
  from: string,
  to: string,
  { directions, nodes }: DesertPathData,
) => {
  const startNode = nodes.find(({ location }) => location === from);
  const endNode = nodes.find(({ location }) => location === to);

  if (!startNode || !endNode) throw new Error("Locations not found");

  let pathIndex = 0;
  let totalSteps = 0;
  let currentNode = startNode;

  while (currentNode !== endNode) {
    // Repeat directions when they have been exhausted but destination not reached
    if (pathIndex === directions.length) pathIndex = 0;

    currentNode = move(currentNode, pathIndex, { directions, nodes });
    pathIndex++;
    totalSteps++;
  }

  return {
    totalSteps,
  };
};

export interface GhostWalkReturn {
  pathCycles: number;
  totalSteps: number;
  startNode: DesertNode;
  endNode: DesertNode;
  pathIndex: number;
  currentCycleStartNode: DesertNode;
}

export const ghostWalk = (
  startNode: DesertNode,
  endFlag: string,
  { directions, nodes }: DesertPathData,
): GhostWalkReturn => {
  const isValidEndNode = (node: DesertNode) => node.location.endsWith(endFlag);

  let pathIndex = 0;
  let pathCycles = 0;
  let totalSteps = 0;
  let currentNode = startNode;
  let currentCycleStartNode = startNode;

  while (!isValidEndNode(currentNode)) {
    // Repeat directions when they have been exhausted but destination not reached
    if (pathIndex === directions.length) {
      pathIndex = 0;
      pathCycles++;
      currentCycleStartNode = currentNode;
    }

    currentNode = move(currentNode, pathIndex, { directions, nodes });
    pathIndex++;
    totalSteps++;
  }

  return {
    totalSteps,
    pathCycles,
    startNode,
    pathIndex,
    currentCycleStartNode,
    endNode: currentNode,
  };
};

const gcd = (a: number, b: number): number => {
  return b == 0 ? a : gcd(b, a % b);
};

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

const lcmFromArray = (...numbers: number[]) => {
  numbers.sort((a, b) => a - b);

  const initial = numbers.splice(0, 2) as [number, number];

  return numbers.reduce(
    (result, num) => {
      return lcm(result, num);
    },
    lcm(...initial),
  );
};

export const findOptimalGhostWalkSteps = (
  startFlag: string,
  endFlag: string,
  { directions, nodes }: DesertPathData,
) => {
  const startNodes = nodes.filter(({ location }) =>
    location.endsWith(startFlag),
  );

  if (!startNodes) throw new Error("Locations not found");

  const results = startNodes.map((startNode) =>
    ghostWalk(startNode, endFlag, { directions, nodes }),
  );

  const optimalSteps = lcmFromArray(
    ...results.map(({ totalSteps }) => totalSteps),
  );

  return {
    results,
    optimalSteps,
  };
};

export const toDesertNode = (line: string): DesertNode => {
  const [location, left, right] = [...line.matchAll(/[A-Z0-9]{3}/g)];

  if (!location || !left || !right) throw new Error("Invalid node data");

  return {
    location: location[0],
    waypoint: {
      L: left[0],
      R: right[0],
    },
  };
};

export const parseData = async (
  inputProcessor = processInput,
): Promise<DesertPathData> => {
  const [directions, , ...nodes] = await inputToArray(inputProcessor);

  if (!directions || !nodes) throw new Error("Invalid input data");

  return {
    directions: directions
      .split("")
      .map((leftOrRight) => leftOrRight as Direction),
    nodes: nodes.map(toDesertNode),
  };
};

export const multiply = (values: number[]) => {
  return values.reduce((result, next) => {
    if (!result) return next;
    return result * next;
  });
};

export const sumOf = (values: number[]) => {
  return values.reduce((sum, next) => {
    return sum + next;
  }, 0);
};
