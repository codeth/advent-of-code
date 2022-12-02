import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'
import {outcomeMap, outcomeScores, Round, shapeScores} from "./types.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const input: string = readFileSync(path.resolve(__dirname, './input.tsv'), 'utf-8')

const strategy = input.split('\n').map(
  (roundString) => ({
    opponent: roundString[0],
    response: roundString[2],
  } as Round)
)

const roundOutcome = ({ opponent, response }: Round) => {
  const shapeScore = shapeScores[response]
  const outcome = outcomeMap[opponent][response]
  const outcomeScore = outcomeScores[outcome]

  return {
    shapeScore,
    outcomeScore,
  }
}

const totalScore = strategy.reduce((score, nextRound) => {
  const { shapeScore, outcomeScore } = roundOutcome(nextRound)
  const roundScore = shapeScore + outcomeScore

  score += roundScore

  return score
}, 0)

console.log(totalScore)

