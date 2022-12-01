import { topCalories } from './puzzle-1.ts'

const sumOfTopCalories = topCalories.reduce((result, current) => result + current, 0)

console.log(sumOfTopCalories)