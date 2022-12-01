import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const input: string = readFileSync(path.resolve(__dirname, './input-1.tsv'), 'utf-8')

const calories: string[] = input.split('\n')

const nextElfIndexes = calories.reduce((result, currentValue, currentIndex) => {
  if (currentValue.length) return result

  return [
    ...result,
    currentIndex,
  ]
}, [] as number[])

export const groupedCalories = nextElfIndexes.reduce((result, currentValue, currentIndex) => {
  const group = calories.slice(currentIndex > 0 ? nextElfIndexes[currentIndex - 1] + 1 : 0, currentValue)

  return [
    ...result,
    group,
  ]
}, [] as string[][])

export const allCalories = groupedCalories.reduce((results, group) => {
  const totalCaloriesForElf = group.reduce((total, elfCalories) => total + parseInt(elfCalories, 10), 0)

  return [
    ...results,
    totalCaloriesForElf,
  ]
}, [] as number[])

export const topCalories = allCalories.sort((a, b) => b - a).slice(0, 3)

export const mostCalories = topCalories[0]

console.log(mostCalories)
