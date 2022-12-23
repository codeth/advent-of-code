import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'
import {Cycle, Instruction} from "./types.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const input: string = readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8')

const program = input.split('\n') as Instruction[]

const x = 1

const cycles = program.reduce((result, instruction) => {
  const valueBefore = result[result.length - 1]?.valueAfter || x

  if (instruction === 'noop') {
    result.push({ id: result.length + 1, instruction, valueBefore, valueAfter: valueBefore })
    return result
  }

  const [, value] = instruction.split(' ')

  const newCycles = [
    { id: result.length + 1, instruction, valueBefore, valueAfter: valueBefore },
    { id: result.length + 2, instruction, valueBefore, valueAfter: valueBefore + parseInt(value, 10) },
  ]

  return [
    ...result,
    ...newCycles,
  ]
}, [] as Cycle[])

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