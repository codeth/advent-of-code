export type Instruction = `noop` | `addx ${number}`

export interface Cycle {
  id: number
  instruction: Instruction
  valueBefore: number
  valueAfter: number
}