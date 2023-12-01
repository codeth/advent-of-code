export type Instruction = `noop` | `addx ${number}` | 'start'

export interface Cycle {
  id: number
  instruction: Instruction
  instructionIndex: number
  valueBefore: number
  valueAfter: number
}