import { fileURLToPath } from "node:url";
import path from "node:path";

import { inputToArray, makeInputProcessor } from "../../utils/inputs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processInput = makeInputProcessor(__dirname);

export interface Card {
  id: number;
  winningNumbers: number[];
  numbers: number[];
}

export interface ProcessedCard extends Card {
  matches: number[];
  points: number;
}

export const toNumbersList = (data: string) => {
  return data
    .trim()
    .split(/\s+/)
    .map((value) => parseInt(value, 10));
};

export const toCard = (data: string): Card => {
  const [cardId, winningNumbers, numbers] = data
    .split(/(:|\|)/g)
    .filter((value) => ![":", "|"].includes(value));

  if (!cardId) throw new Error("No card ID");

  return {
    id: parseInt(cardId.trim().replace(/\D/g, ""), 10),
    winningNumbers: toNumbersList(winningNumbers!),
    numbers: toNumbersList(numbers!),
  };
};

export const byCardIdAscending = (a: Card, b: Card) => a.id - b.id;

export const processCards = (cards: Card[]) => {
  const processedOriginalCards = cards
    .map((card) => {
      const matches = card.winningNumbers.reduce<number[]>(
        (results, winningNumber) => {
          if (card.numbers.includes(winningNumber)) results.push(winningNumber);
          return results;
        },
        [],
      );

      const points = matches.reduce((result, _, index) => {
        return index === 0 ? 1 : result * 2;
      }, 0);

      return {
        ...card,
        matches,
        points,
      };
    })
    .sort(byCardIdAscending);

  const cardCountMap = processedOriginalCards.reduce<Record<number, number>>(
    (map, { id }) => {
      return {
        ...map,
        [id]: 1,
      };
    },
    {},
  );

  const resolveWinningCards = () => {
    let nextCardIds = processedOriginalCards.map(({ id }) => id);

    while (nextCardIds.length) {
      const wonCardIds: number[] = [];

      for (const cardId of nextCardIds) {
        const card = processedOriginalCards[cardId - 1]!;

        if (!card.matches.length) continue;

        const wonIds = new Array(card.matches.length)
          .fill(cardId + 1)
          .map((id, index) => id + index);

        wonIds.forEach((id) => {
          cardCountMap[id]++;
        });

        wonCardIds.push(...wonIds);
      }

      nextCardIds = [...wonCardIds];
    }
  };

  resolveWinningCards();

  const totalCount = Object.values(cardCountMap).reduce((result, count) => {
    return result + count;
  }, 0);

  return {
    processedOriginalCards,
    totalCount,
  };
};

export const parseScratchcardData = async () => {
  return inputToArray(processInput, toCard);
};

export const sumOf = (values: number[]) => {
  return values.reduce((sum, next) => {
    return sum + next;
  }, 0);
};
