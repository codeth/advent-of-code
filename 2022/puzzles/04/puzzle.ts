import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'
import { CleanupAssignmentPair, CleanupPair } from './types.ts';

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const input: string = readFileSync(path.resolve(__dirname, './input.csv'), 'utf-8')

const toAssignedSections = (rangePair: CleanupPair) =>
  rangePair
    .map(range => range.split('-').map(id => parseInt(id, 10)))
    .map(([start, end]) => ({ start, end })) as CleanupAssignmentPair

const cleanupPairs = input.split('\n')
  .map(pair => pair.split(',') as CleanupPair)
  .map(toAssignedSections)

const isFullyOverlapping = ([a, b]: CleanupAssignmentPair) => {
  const aContainsB = a.start <= b.start && a.end >= b.end
  const bContainsA = b.start <= a.start && b.end >= a.end

  return aContainsB || bContainsA
}

const fullyOverlappingAssigmentPairs = cleanupPairs.reduce((total, nextPair) => {
  if (isFullyOverlapping(nextPair)) total += 1
  return total
}, 0)

console.log(fullyOverlappingAssigmentPairs)

const isOverlapping = ([a, b]: CleanupAssignmentPair) => {
  const aStartsInB = a.start >= b.start && a.start <= b.end
  const aEndsInB = a.end >= b.start && a.end <= b.end
  const bStartsInA = b.start >= a.start && b.start <= a.end
  const bEndsInA = b.end >= a.start && b.end <= a.end

  return aStartsInB || aEndsInB || bStartsInA || bEndsInA
}

const overlappingAssigmentPairs = cleanupPairs.reduce((total, nextPair) => {
  if (isOverlapping(nextPair)) total += 1
  return total
}, 0)

console.log(overlappingAssigmentPairs)