import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'
import {Direction, Movement, MovementPosition, MovementPositions, Position} from "./types.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const input: string = readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8')

const newMovement = (direction: string, steps: string): Movement => ({
  direction: direction as Direction,
  steps: parseInt(steps, 10),
})

const movements = input.split('\n')
  .map(movement => movement.split(' '))
  .map(([direction, steps]) => newMovement(direction, steps))

const newPosition = (row: number, column: number): Position => ({ row, column })

const newMovementPosition = (row: number, column: number): MovementPosition => {
  return {
    ...newPosition(row, column),
  }
}

const knots = 10
const head = 0
const tail = 9

const knotPositions = new Map<number, Position>(
  Array(knots)
    .fill(newPosition(0, 0))
    .map((position, index) => ([index, position]))
)

const moveRight = ({ row, column }: Position) => newMovementPosition(row, column + 1)
const moveLeft = ({ row, column }: Position) => newMovementPosition(row, column - 1)
const moveUp = ({ row, column }: Position) => newMovementPosition(row + 1, column)
const moveDown = ({ row, column }: Position) => newMovementPosition(row - 1, column)

const moveUpAndRight = ({ row, column }: Position) => newMovementPosition(row + 1, column + 1)
const moveUpAndLeft = ({ row, column }: Position) => newMovementPosition(row + 1, column - 1)
const moveDownAndRight = ({ row, column }: Position) => newMovementPosition(row - 1, column + 1)
const moveDownAndLeft = ({ row, column }: Position) => newMovementPosition(row - 1, column - 1)

const updateHeadPosition = (move: (position: Position) => MovementPosition): MovementPosition => {
  const nextPosition = move(knotPositions.get(head)!)

  knotPositions.set(head, {
    row: nextPosition.row,
    column: nextPosition.column,
  })

  // console.log(`HEAD moved to r${nextPosition.row}:c${nextPosition.column}`)

  return nextPosition
}

const tailMoves: MovementPositions = [newMovementPosition(0, 0)]

const updateNextPosition = (key: number) => {
  const { row, column } = knotPositions.get(key - 1)!

  const acceptableRows = [
    row - 1,
    row,
    row + 1
  ]

  const acceptableColumns = [
    column - 1,
    column,
    column + 1
  ]

  const current = knotPositions.get(key)!

  if (acceptableRows.includes(current.row) &&
    acceptableColumns.includes(current.column)) {
    // console.log(`${key} did not move from r${current.row}:c${current.column}`)
    return newMovementPosition(current.row, current.column)
  }

  const rowDifference = row - current.row
  const columnDifference = column - current.column

  const nextMove = (() => {
    switch (true) {
      case rowDifference > 0:
        return columnDifference > 0
          ? moveUpAndRight(current)
          : columnDifference === 0
            ? moveUp(current)
            : moveUpAndLeft(current)
      case rowDifference < 0:
        return columnDifference > 0
          ? moveDownAndRight(current)
          : columnDifference === 0
            ? moveDown(current)
            : moveDownAndLeft(current)
      case columnDifference > 0:
        return rowDifference > 0
          ? moveUpAndRight(current)
          : rowDifference === 0
            ? moveRight(current)
            : moveDownAndRight(current)
      case columnDifference < 0:
        return rowDifference > 0
          ? moveUpAndLeft(current)
          : rowDifference === 0
            ? moveLeft(current)
            : moveDownAndLeft(current)
    }
  })()!

  const next = newMovementPosition(nextMove.row, nextMove.column)

  // console.log(`${key} moved to r${next.row}:c${next.column}`)

  if (key === tail) tailMoves.push(next)

  knotPositions.set(key, {
    row: next.row,
    column: next.column
  })

  return next
}

const processMovement = (movement: Movement, positions: MovementPositions) => {
  const steps = Array(movement.steps).fill(null)

  steps.forEach(() => {
    const head = (() => {
      switch (movement.direction) {
        case 'U':
          return updateHeadPosition(moveUp)
        case 'D':
          return updateHeadPosition(moveDown)
        case 'L':
          return updateHeadPosition(moveLeft)
        case 'R':
          return updateHeadPosition(moveRight)
      }
    })()

    const headPositionIndex = positions.findIndex(
      ({ row, column }) =>
        row === head.row &&
        column === head.column
    )

    if (headPositionIndex === -1) {
      positions.push(head)
    }

    knotPositions.forEach((value, key) => {
      if (key > 0) {
        const next = updateNextPosition(key)

        const nextPositionIndex = positions.findIndex(
          ({ row, column }) =>
            row === next.row &&
            column === next.column
        )

        if (nextPositionIndex > -1) {
          positions.splice(nextPositionIndex, 1, next)
        }
      }
    })
  })
}

const movementPath = movements.reduce((positions, movement) => {
  processMovement(movement, positions)
  return positions
}, [newMovementPosition(0, 0)])

const uniqueTailPositions = tailMoves.reduce((result, move) => {
  const existingPosition = result.find(({ row, column }) => row === move.row && column === move.column)

  if (!existingPosition) result.push(move)

  return result
}, [] as MovementPositions)

console.log(uniqueTailPositions.length)