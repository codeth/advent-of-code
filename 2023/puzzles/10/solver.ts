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

export const tileTypes = [
  "v-pipe",
  "h-pipe",
  "nw-bend",
  "sw-bend",
  "ne-bend",
  "se-bend",
  "ground",
  "start",
] as const;

export const tileTypeSymbolMap: Record<string, TileType> = {
  S: "start",
  J: "nw-bend",
  L: "ne-bend",
  F: "se-bend",
  "7": "sw-bend",
  "|": "v-pipe",
  "-": "h-pipe",
  ".": "ground",
};

export type TileType = (typeof tileTypes)[number];

export interface Position {
  x: number;
  y: number;
}

export interface GridTile extends Position {
  type: TileType;
  neighbours: [Position, Position] | null;
}

export const getMovements = (x: number, y: number) => {
  return {
    up: { x, y: y - 1 },
    down: { x, y: y + 1 },
    left: { y, x: x - 1 },
    right: { y, x: x + 1 },
  };
};

export const findNeighbours = (
  { x, y }: GridTile,
  tiles: GridTile[],
): [Position, Position] => {
  const { up, down, left, right } = getMovements(x, y);

  const neighbours = [up, down, left, right]
    .map(
      (position) =>
        tiles.find((tile) => tile.x === position.x && tile.y === position.y)! ??
        {},
    )
    .filter((tile) => {
      if (!tile.neighbours) return false;

      return tile.neighbours.some(
        (neighbour) => neighbour.x === x && neighbour.y === y,
      );
    })
    .map((tile) => ({ x: tile.x, y: tile.y }));

  return [neighbours[0]!, neighbours[1]!];
};

export const getNeighbours = (
  type: TileType,
  x: number,
  y: number,
): [Position, Position] | null => {
  const { up, down, left, right } = getMovements(x, y);

  switch (type) {
    case "v-pipe":
      return [up, down];
    case "h-pipe":
      return [left, right];
    case "nw-bend":
      return [up, left];
    case "sw-bend":
      return [down, left];
    case "ne-bend":
      return [up, right];
    case "se-bend":
      return [down, right];
    case "ground":
      return null;
    case "start":
      return null; // set lazily after all other tiles
  }
};

export const toGridTile =
  (y: number) =>
  (value: string, x: number): GridTile => {
    const type = tileTypeSymbolMap[value]!;

    return {
      y,
      x,
      type,
      neighbours: getNeighbours(type, x, y),
    };
  };

export const toGridRow = (line: string, y: number): GridTile[] => {
  return line.split("").map(toGridTile(y));
};

export const traverse = (tiles: GridTile[]) => {
  const start = tiles.find(({ type }) => type === "start")!;

  let steps = 0;
  let loops = 0;
  let current = start;
  let previous = tiles.find((tile) => {
    const { x, y } = start.neighbours![0];
    return tile.x === x && tile.y === y;
  })!;

  while (loops < 1) {
    const nextNeighbour = current.neighbours!.find(
      (neighbour) => neighbour.x !== previous.x || neighbour.y !== previous.y,
    )!;

    const next = tiles.find((tile) => {
      return tile.x === nextNeighbour.x && tile.y === nextNeighbour.y;
    })!;

    if (next === start) loops++;

    previous = current;
    current = next;
    steps++;
  }

  return {
    steps,
  };
};

export const parseData = async (inputProcessor = processInput) => {
  const rows = await inputToArray(inputProcessor, toGridRow);

  return rows.flat().map((tile, _, tiles) => {
    if (tile.type !== "start") return tile;

    return {
      ...tile,
      neighbours: findNeighbours(tile, tiles),
    };
  });
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
