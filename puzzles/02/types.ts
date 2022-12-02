export enum OpponentShape {
  Rock = 'A',
  Paper = 'B',
  Scissors = 'C'
}

export enum ResponseShape {
  Rock = 'X',
  Paper = 'Y',
  Scissors = 'Z'
}

export enum ShapeScore {
  Rock = 1,
  Paper,
  Scissors
}

export const shapeScores = {
  [OpponentShape.Rock]: 1,
  [ResponseShape.Rock]: 1,
  [OpponentShape.Paper]: 2,
  [ResponseShape.Paper]: 2,
  [OpponentShape.Scissors]: 3,
  [ResponseShape.Scissors]: 3,
}

export enum Outcome {
  Loss,
  Draw,
  Win
}

export const outcomeScores = {
  [Outcome.Loss]: 0,
  [Outcome.Draw]: 3,
  [Outcome.Win]: 6,
}

export const outcomeMap = {
  [OpponentShape.Rock]: {
    [ResponseShape.Paper]: Outcome.Win,
    [ResponseShape.Rock]: Outcome.Draw,
    [ResponseShape.Scissors]: Outcome.Loss,
  },
  [OpponentShape.Paper]: {
    [ResponseShape.Scissors]: Outcome.Win,
    [ResponseShape.Paper]: Outcome.Draw,
    [ResponseShape.Rock]: Outcome.Loss,
  },
  [OpponentShape.Scissors]: {
    [ResponseShape.Rock]: Outcome.Win,
    [ResponseShape.Scissors]: Outcome.Draw,
    [ResponseShape.Paper]: Outcome.Loss,
  },
}

export interface Round {
  opponent: OpponentShape
  response: ResponseShape
}
