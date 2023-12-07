import { fileURLToPath } from "node:url";
import path from "node:path";

import { inputToArray, makeInputProcessor } from "../../utils/inputs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processInput = makeInputProcessor(__dirname);
export const processExampleInput = makeInputProcessor(__dirname, "example.txt");

export const camelCards = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
] as const;

export type CamelCard = (typeof camelCards)[number];

export type CamelCardStrengthMap = Record<CamelCard, number>;

export const camelCardStrengthMap = camelCards.reduce((map, card, index) => {
  return {
    ...map,
    [card]: index,
  };
}, {} as CamelCardStrengthMap);

export enum HandType {
  highCard,
  onePair,
  twoPair,
  threeKind,
  fullHouse,
  fourKind,
  fiveKind,
}

export type Hand = [CamelCard, CamelCard, CamelCard, CamelCard, CamelCard];

export interface HandData {
  hand: Hand;
  bid: number;
  type: HandType;
}

export interface RankedHandData extends HandData {
  rank: number;
}

export const getHandType = (hand: Hand): HandType => {
  if (hand.every((card) => card === hand[0])) {
    return HandType.fiveKind;
  }

  if (hand.some((card) => hand.filter((c) => c === card).length > 1)) {
    const [groupA, groupB] = hand.reduce<CamelCard[][]>((groups, card) => {
      if (groups.some((group) => group.includes(card))) return groups;

      const group = hand.filter((c) => c === card);

      if (group.length > 1) {
        return [...groups, group];
      }

      return groups;
    }, []);

    if (!groupB) {
      switch (groupA!.length) {
        case 4:
          return HandType.fourKind;
        case 3:
          return HandType.threeKind;
        case 2:
        default:
          return HandType.onePair;
      }
    }

    if (groupA!.length === groupB.length) {
      return HandType.twoPair;
    }

    return HandType.fullHouse;
  }

  return HandType.highCard;
};

export const rankHands = (hands: HandData[]): RankedHandData[] => {
  return hands
    .sort((a, b) => {
      if (a.type === b.type) {
        return a.hand.reduce((sortReturn, card, index) => {
          const aStrength = camelCardStrengthMap[card];
          const bStrength = camelCardStrengthMap[b.hand[index]!];

          if (sortReturn !== 0 || aStrength === bStrength) return sortReturn;

          return aStrength - bStrength;
        }, 0);
      }

      return a.type - b.type;
    })
    .map((hand, index) => ({
      ...hand,
      rank: index + 1,
    }));
};

export const toCamelCardData = (line: string): HandData => {
  const [handString, bidString] = line.split(" ");

  if (!handString || !bidString) throw new Error("Invalid input data");

  const hand = handString.split("") as Hand;
  const bid = parseInt(bidString, 10);
  const type = getHandType(hand);

  return {
    hand,
    bid,
    type,
  };
};

export const totalWinnings = (rankedHands: RankedHandData[]) => {
  return rankedHands.reduce((total, { bid, rank }) => {
    return total + bid * rank;
  }, 0);
};

export const parseCamelCardsData = async (inputProcessor = processInput) => {
  return await inputToArray(inputProcessor, toCamelCardData);
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
