export enum OpponentShape {
  Rock = 'A',
  Paper = 'B',
  Scissors = 'C'
}

export enum Response {
  Lose = 'X',
  Draw = 'Y',
  Win = 'Z'
}

export enum Shape {
  Rock = 1,
  Paper,
  Scissors
}

export const outcomeScores = {
  [Response.Lose]: 0,
  [Response.Draw]: 3,
  [Response.Win]: 6,
}

export const responseToShapeMap = {
  [OpponentShape.Rock]: {
    [Response.Win]: Shape.Paper,
    [Response.Draw]: Shape.Rock,
    [Response.Lose]: Shape.Scissors,
  },
  [OpponentShape.Paper]: {
    [Response.Win]: Shape.Scissors,
    [Response.Draw]: Shape.Paper,
    [Response.Lose]: Shape.Rock,
  },
  [OpponentShape.Scissors]: {
    [Response.Win]: Shape.Rock,
    [Response.Draw]: Shape.Scissors,
    [Response.Lose]: Shape.Paper,
  },
}

export interface Round {
  opponentShape: OpponentShape
  response: Response
}
