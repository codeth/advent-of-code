import { fileURLToPath } from "node:url";
import path from "node:path";

import { inputToArray, makeInputProcessor } from "../../utils/inputs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processInput = makeInputProcessor(__dirname);

export type PositionType = "number" | "symbol";

export interface Position {
  x: number;
  y: number;
}

export interface SchematicPosition<Type extends PositionType> {
  x: Type extends "number" ? { from: number; to: number } : number;
  y: number;
  value: string;
  type: Type;
}

export interface SymbolPosition extends SchematicPosition<"symbol"> {}

export interface NumberPosition extends SchematicPosition<"number"> {
  validSymbolPositions: Position[];
}

export interface EngineSchematic {
  symbols: SymbolPosition[];
  numbers: NumberPosition[];
}

export const createSymbolPosition = (
  args: Pick<SymbolPosition, "x" | "y" | "value">,
): SymbolPosition => {
  return {
    ...args,
    type: "symbol",
  };
};

export const createNumberPosition = (
  args: Pick<NumberPosition, "x" | "y" | "value" | "validSymbolPositions">,
): NumberPosition => {
  return {
    ...args,
    type: "number",
  };
};

export const toSymbolPosition =
  (y: number) =>
  (match: RegExpMatchArray): SymbolPosition => {
    return createSymbolPosition({
      y,
      x: match.index!,
      value: match[0],
    });
  };

export const parseSymbolMatches = (matches: RegExpMatchArray[], y: number) => {
  return matches.map(toSymbolPosition(y));
};

export const setValidSymbolPositions =
  (y: number) =>
  (numberPosition: NumberPosition): NumberPosition => {
    const aboveAndBelow = [y - 1, y + 1];
    const [left, right] = [numberPosition.x.from - 1, numberPosition.x.to + 1];
    const allColumns: number[] = new Array(right - left + 1)
      .fill(left)
      .map((column, index) => column + index);

    const sameRow = [left, right].map((x) => ({ x, y }));

    const otherRows = aboveAndBelow.flatMap((otherY) => {
      return allColumns.map((column) => ({
        x: column,
        y: otherY,
      }));
    });

    const validSymbolPositions = [...sameRow, ...otherRows];

    return {
      ...numberPosition,
      validSymbolPositions,
    };
  };

export const parseNumberMatches = (matches: RegExpMatchArray[], y: number) => {
  const numberPositions = matches.reduce<NumberPosition[]>((results, match) => {
    const previousNumberPosition = results[results.length - 1];

    if (
      !previousNumberPosition ||
      match.index! > previousNumberPosition.x.to + 1
    ) {
      return [
        ...results,
        createNumberPosition({
          y,
          x: { from: match.index!, to: match.index! },
          value: match[0]!,
          validSymbolPositions: [],
        }),
      ];
    }

    previousNumberPosition.x.to = match.index!;
    previousNumberPosition.value = previousNumberPosition.value.concat(
      match[0],
    );

    return results;
  }, []);

  return numberPositions.map(setValidSymbolPositions(y));
};

export const toEngineSchematic = (line: string, y: number): EngineSchematic => {
  const symbolMatches = [...line.matchAll(/[^0-9.]/g)];
  const numberMatches = [...line.matchAll(/[0-9]/g)];

  const symbols = parseSymbolMatches(symbolMatches, y);
  const numbers = parseNumberMatches(numberMatches, y);

  return { symbols, numbers };
};

export const flattenEngineSchematics = (schematics: EngineSchematic[]) => {
  return schematics.reduce<EngineSchematic>(
    (result, { symbols, numbers }) => {
      result.symbols.push(...symbols);
      result.numbers.push(...numbers);

      return result;
    },
    { symbols: [], numbers: [] },
  );
};

export interface PartNumberPosition extends NumberPosition {
  adjacentSymbols: SymbolPosition[];
}

export const toPartNumberPosition =
  (symbols: SymbolPosition[]) =>
  (numberPosition: NumberPosition): PartNumberPosition => {
    const adjacentSymbols = symbols.filter(
      (symbol) =>
        !!numberPosition.validSymbolPositions.find(
          ({ x, y }) => symbol.x === x && symbol.y === y,
        ),
    );

    return {
      ...numberPosition,
      adjacentSymbols,
    };
  };

export const findPartNumberPositions = ({
  symbols,
  numbers,
}: EngineSchematic) => {
  return numbers
    .map(toPartNumberPosition(symbols))
    .filter(({ adjacentSymbols }) => !!adjacentSymbols.length);
};

export const findPartNumbers = (schematic: EngineSchematic) => {
  return findPartNumberPositions(schematic).map(({ value }) =>
    parseInt(value, 10),
  );
};

export const byGearSymbol = (symbol: SymbolPosition) => symbol.value === "*";

export const findGearParts = (schematic: EngineSchematic) => {
  const partsGroupedByGearSymbol = schematic.symbols
    .filter(byGearSymbol)
    .map((symbol) => {
      return {
        symbol,
        parts: findPartNumberPositions(schematic).filter(
          ({ adjacentSymbols }) => {
            return adjacentSymbols.includes(symbol);
          },
        ),
      };
    });

  const gearPartPairs = partsGroupedByGearSymbol
    .filter(({ parts }) => parts.length === 2)
    .map(({ parts }) => parts);

  return gearPartPairs as [PartNumberPosition, PartNumberPosition][];
};

export const calculateGearRatios = (
  gearParts: [PartNumberPosition, PartNumberPosition][],
) => {
  return gearParts.map(
    ([a, b]) => parseInt(a.value, 10) * parseInt(b.value, 10),
  );
};

export const sumOf = (values: number[]) => {
  return values.reduce((sum, next) => {
    return sum + next;
  }, 0);
};

export const processSchematicData = async () => {
  const schematics = await inputToArray(processInput, toEngineSchematic);

  return flattenEngineSchematics(schematics);
};
