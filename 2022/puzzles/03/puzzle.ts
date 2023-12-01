import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'
import {ElfGroup, LowerAlpha, lowerAlphabet, Rucksack, RucksackContents, UpperAlpha, upperAlphabet} from './types.ts'

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const input: string = readFileSync(path.resolve(__dirname, './input.tsv'), 'utf-8')

const splitRucksacksToCompartments = (rucksack: RucksackContents): Rucksack => {
  const rucksackSize = rucksack.length
  const compartmentSplit = rucksackSize / 2

  return [rucksack.slice(0, compartmentSplit), rucksack.slice(compartmentSplit)]
}

const fullRucksacks = input.split('\n').map(rucksack => [...rucksack] as RucksackContents)

const rucksacks = fullRucksacks.map(splitRucksacksToCompartments)

const findDuplicate = ([compartmentA, compartmentB]: Rucksack) => {
  return compartmentA.reduce((duplicate, nextItem) => {
    if (duplicate.length) return duplicate
    if (compartmentB.includes(nextItem)) duplicate = nextItem
    return duplicate
  }, '' as LowerAlpha | UpperAlpha)
}

const duplicateItems = rucksacks.map((rucksack) => findDuplicate(rucksack))

const isLowerAlpha = (letter: LowerAlpha | UpperAlpha): letter is LowerAlpha => lowerAlphabet.includes(letter as LowerAlpha)
const isUpperAlpha = (letter: LowerAlpha | UpperAlpha): letter is UpperAlpha => upperAlphabet.includes(letter as UpperAlpha)

const lowerAlphaPriority = (letter: LowerAlpha) => lowerAlphabet.findIndex((item) => item === letter) + 1
const upperAlphaPriority = (letter: UpperAlpha) => upperAlphabet.findIndex((item)=> item === letter) + 27

const itemPriority = (letter: LowerAlpha | UpperAlpha): number => {
  if (isLowerAlpha(letter)) return lowerAlphaPriority(letter)
  if (isUpperAlpha(letter)) return upperAlphaPriority(letter)
  console.error('Unknown item')
  return 0
}

const sumOfItemPriorities = (items: RucksackContents) => items.reduce((total, nextDuplicate) => {
  total += itemPriority(nextDuplicate)
  return total
}, 0)

console.log(sumOfItemPriorities((duplicateItems)))

let groupStartIndex = 0
const groupSize = 3
const groupedElfRucksacks: ElfGroup[] = []

while (groupedElfRucksacks.length < (fullRucksacks.length / groupSize)) {
  groupedElfRucksacks.push(fullRucksacks.slice(groupStartIndex, groupStartIndex + groupSize) as ElfGroup)
  groupStartIndex += groupSize
}

const findTriplicate = ([compartmentA, compartmentB, compartmentC]: ElfGroup) => {
  return compartmentA.reduce((triplicate, nextItem) => {
    if (triplicate.length) return triplicate
    if (compartmentB.includes(nextItem) && compartmentC.includes(nextItem)) triplicate = nextItem
    return triplicate
  }, '' as LowerAlpha | UpperAlpha)
}

const groupBadgeItems = groupedElfRucksacks.map(rucksack => findTriplicate(rucksack))

console.log(sumOfItemPriorities(groupBadgeItems))