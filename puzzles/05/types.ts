export interface RearrangementStep {
  move: number
  from: number
  to: number
}

export type StacksByColumnId = Record<number, string[]>