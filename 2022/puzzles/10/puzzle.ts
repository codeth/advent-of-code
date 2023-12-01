import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'
import { Cycle, Instruction } from "./types.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const input: string = readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8')

const program = input.split('\n') as Instruction[]

const newCycle = (
  id: number,
  instruction: Instruction,
  instructionIndex: number,
  valueBefore: number,
  valueAfter?: number
): Cycle => {
  return {
    id,
    instruction,
    instructionIndex,
    valueBefore,
    valueAfter: valueAfter !== undefined ? valueAfter : valueBefore
  }
}

const cycles = program.reduce((result, instruction, currentIndex) => {
  const valueBefore = result[result.length - 1]?.valueAfter

  const nextCycleUnchanged = newCycle(result.length, instruction, currentIndex, valueBefore)

  if (instruction === 'noop') {
    return [
      ...result,
      nextCycleUnchanged,
    ]
  }

  const [, value] = instruction.split(' ')

  const newCycles = [
    nextCycleUnchanged,
    newCycle(result.length + 1, instruction, currentIndex, valueBefore, valueBefore + parseInt(value, 10)),
  ]

  return [
    ...result,
    ...newCycles,
  ]
}, [newCycle(0, 'start', 0, 1)] as Cycle[])

const targetCycles = [20, 60, 100, 140, 180, 220]

const signals = targetCycles.map(cycleId => {
  const xValue = cycles.find(({ id }) => id === cycleId)!.valueBefore

  return {
    id: cycleId,
    strength: cycleId * xValue
  }
})

const sumOfSignalStrengths = signals.reduce((total, signal) => {
  total += signal.strength
  return total
}, 0)

console.log(sumOfSignalStrengths)