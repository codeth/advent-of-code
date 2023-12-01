export type Direction = 'U' | 'D' | 'L' | 'R'

export interface Movement {
  direction: Direction
  steps: number
}

export interface Position {
  row: number
  column: number
}

export interface MovementPosition extends Position {}

export type MovementPositions = MovementPosition[]
