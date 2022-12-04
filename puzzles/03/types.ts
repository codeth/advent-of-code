export const lowerAlphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
] as const

export const upperAlphabet = (lowerAlphabet.map(letter => letter.toUpperCase()) as unknown) as Readonly<[UpperAlpha]>

export type LowerAlpha = typeof lowerAlphabet[number]

export type UpperAlpha = Uppercase<LowerAlpha>

export type RucksackContents = (LowerAlpha | UpperAlpha)[]

export type RucksackCompartment = RucksackContents

export type Rucksack = [RucksackCompartment, RucksackCompartment]
