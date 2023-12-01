import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'
import {RearrangementStep, StacksByColumnId} from './types.ts';

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const input: string = readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8')

const [stacks, rearrangement] = input.split('\n\n')

const steps = rearrangement.split('\n')
  .map(step => step.split(' '))
  .map(([move, x, from, y, to, z]) => ({
    [move]: parseInt(x, 10),
    [from]: parseInt(y, 10),
    [to]: parseInt(z, 10)
  } as unknown as RearrangementStep))

const [rawStackIds, ...bottomUpStacks] = stacks.split('\n').reverse()

const stackIds = rawStackIds.trim().split(/\s+/).map(id => parseInt(id, 10))

let valuePositionIndex = 1
const stacksByColumnId = stackIds.reduce((result, nextId) => {
  result[nextId] = bottomUpStacks.reduce((result, nextRow) => {
    const value = nextRow[valuePositionIndex]?.trim()

    return value ? [
      ...result,
      value
    ] : result
  }, [] as string[])

  valuePositionIndex += 4

  return result
}, {} as StacksByColumnId)

steps.forEach(({ move, from, to }) => {
  stacksByColumnId[to].push(...stacksByColumnId[from].splice(-move))
})

const topCrates = stackIds.reduce((result, nextStackId) => {
  const stack = stacksByColumnId[nextStackId]
  return [
    ...result,
    stack[stack.length - 1]
  ]
}, [] as string[])

console.log(topCrates.join(''))
