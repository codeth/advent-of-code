import { fileURLToPath } from "node:url";
import path from "node:path";

import { inputToArray, makeInputProcessor } from "../../utils/inputs.js";
import { camelCase } from "change-case";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processInput = makeInputProcessor(__dirname);
export const processExampleInput = makeInputProcessor(__dirname, "example.txt");

export type DataLineType = "break" | "map-start" | "map-values" | "seeds";

export interface DataLine {
  type: DataLineType;
  value: string;
}

export interface CategoryRange {
  start: number;
  end: number;
}

export interface CategoryRangeMap {
  destination: CategoryRange;
  source: CategoryRange;
  length: number;
}

export interface AlmanacCategoryRangeMapper {
  ranges: CategoryRangeMap[];
  getDestination: (this: AlmanacCategoryRangeMapper, source: number) => number;
}

export interface Almanac {
  seeds: [number, number][];
  seedToSoil: AlmanacCategoryRangeMapper;
  soilToFertilizer: AlmanacCategoryRangeMapper;
  fertilizerToWater: AlmanacCategoryRangeMapper;
  waterToLight: AlmanacCategoryRangeMapper;
  lightToTemperature: AlmanacCategoryRangeMapper;
  temperatureToHumidity: AlmanacCategoryRangeMapper;
  humidityToLocation: AlmanacCategoryRangeMapper;
}

export interface Seed {
  id: number;
  soil: number;
  fertilizer: number;
  water: number;
  light: number;
  temperature: number;
  humidity: number;
  location: number;
}

export type AlmanacMapName = keyof Omit<Almanac, "seeds">;

export const getType = (line: string): DataLineType => {
  if (line === "") return "break";
  if (line.startsWith("seeds")) return "seeds";
  if (line.includes("map")) return "map-start";
  if (line.search(/\d/) !== -1) return "map-values";

  throw new Error("Unhandled type");
};

export const toDataLine = (line: string): DataLine => {
  return {
    type: getType(line),
    value: line,
  };
};

export const parseSeeds = ({ value }: DataLine) => {
  const [, ...seedRanges] = value.split(" ");
  return seedRanges
    .map((num) => parseInt(num, 10))
    .reduce<[number, number][]>((pairs, value) => {
      const previous = pairs[pairs.length - 1];

      if (previous && previous.length < 2) {
        previous.push(value);
        return pairs;
      }

      return [...pairs, [value] as unknown as [number, number]];
    }, []);
};

export const parseMapStart = ({ value }: DataLine) => {
  const [kebabName] = value.split(" ");
  return camelCase(kebabName!) as AlmanacMapName;
};

export const setCategoryMapperHelpers = (
  mapper: AlmanacCategoryRangeMapper,
) => {
  return {
    ...mapper,
    getDestination:
      mapper.getDestination ||
      function (sourceId: number) {
        const range = this.ranges.find(
          ({ source }) => sourceId >= source.start && sourceId <= source.end,
        );

        if (range) {
          const difference = sourceId - range.source.start;
          return range.destination.start + difference;
        }

        return sourceId;
      },
  };
};

export const parseMapValues = ({ value }: DataLine): CategoryRangeMap => {
  const [destinationStart, sourceStart, length] = value
    .split(" ")
    .map((v) => parseInt(v, 10));

  const destination = {
    start: destinationStart!,
    end: destinationStart! + length! - 1,
  };

  const source = {
    start: sourceStart!,
    end: sourceStart! + length! - 1,
  };

  return {
    destination,
    source,
    length: length!,
  };
};

export const createAlmanac = (data: DataLine[]) => {
  let currentMapName: AlmanacMapName | null = null;

  return data.reduce<Almanac>((result, line) => {
    switch (line.type) {
      case "seeds":
        result.seeds = parseSeeds(line);
        break;
      case "break":
        // end of section, new map starting on next line
        currentMapName = null;
        break;
      case "map-start":
        // eslint-disable-next-line no-case-declarations
        const newMapName = parseMapStart(line);
        currentMapName = newMapName;
        result[newMapName] = {} as AlmanacCategoryRangeMapper;
        break;
      case "map-values":
        if (!currentMapName) throw new Error("Current map name is null");

        result[currentMapName] = {
          ...setCategoryMapperHelpers(result[currentMapName]),
          ranges: [
            ...(result[currentMapName].ranges ?? []),
            parseMapValues(line),
          ],
        };
        break;
    }

    return result;
  }, {} as Almanac);
};

export const parseAlmanacData = async (inputProcessor = processInput) => {
  const data = await inputToArray(inputProcessor, toDataLine);

  return createAlmanac(data);
};

export const createSeed = (
  id: number,
  {
    seedToSoil,
    soilToFertilizer,
    fertilizerToWater,
    waterToLight,
    lightToTemperature,
    temperatureToHumidity,
    humidityToLocation,
  }: Almanac,
) => {
  const soil = seedToSoil.getDestination(id);
  const fertilizer = soilToFertilizer.getDestination(soil);
  const water = fertilizerToWater.getDestination(fertilizer);
  const light = waterToLight.getDestination(water);
  const temperature = lightToTemperature.getDestination(light);
  const humidity = temperatureToHumidity.getDestination(temperature);
  const location = humidityToLocation.getDestination(humidity);

  return {
    id,
    soil,
    fertilizer,
    water,
    light,
    temperature,
    humidity,
    location,
  };
};

export const collectSeedData = (almanac: Almanac) => {
  return almanac.seeds.reduce<Seed[]>((results, [seedStart, length]) => {
    const newSeeds: Seed[] = [];
    let loops = 0;

    while (loops < length) {
      newSeeds.push(createSeed(seedStart + loops, almanac));
      loops++;
    }

    return [...results, ...newSeeds];
  }, []);
};

export const findSeedWithLowestLocation = (seeds: Seed[]) => {
  return seeds.reduce<Seed | null>((result, seed) => {
    if (!result || result.location > seed.location) return seed;
    return result;
  }, null);
};

export const findLowestLocation = ({
  seeds,
  seedToSoil,
  soilToFertilizer,
  fertilizerToWater,
  waterToLight,
  lightToTemperature,
  temperatureToHumidity,
  humidityToLocation,
}: Almanac) => {
  let lowestLocation: number | null = null;

  for (const [seedStart, length] of seeds) {
    let loops = 0;

    while (loops < length) {
      const seed = seedStart + loops;
      const soil = seedToSoil.getDestination(seed);
      const fertilizer = soilToFertilizer.getDestination(soil);
      const water = fertilizerToWater.getDestination(fertilizer);
      const light = waterToLight.getDestination(water);
      const temperature = lightToTemperature.getDestination(light);
      const humidity = temperatureToHumidity.getDestination(temperature);
      const location = humidityToLocation.getDestination(humidity);

      if (lowestLocation === null || location < lowestLocation) {
        lowestLocation = location;
      }

      loops++;
    }
  }

  return lowestLocation;
};

export const sumOf = (values: number[]) => {
  return values.reduce((sum, next) => {
    return sum + next;
  }, 0);
};
