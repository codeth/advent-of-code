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

const newMovementPosition = (row: number, column: number, hasTailVisited = false): MovementPosition => {
  return {
    ...newPosition(row, column),
    hasTailVisited,
  }
}

const currentPosition: Record<'head' | 'tail', Position> = {
  head: newPosition(0, 0),
  tail: newPosition(0, 0),
}

const moveRight = ({ row, column }: Position) => newMovementPosition(row, column + 1)
const moveLeft = ({ row, column }: Position) => newMovementPosition(row, column - 1)
const moveUp = ({ row, column }: Position) => newMovementPosition(row + 1, column)
const moveDown = ({ row, column }: Position) => newMovementPosition(row - 1, column)

const updateHeadPosition = (move: (position: Position) => MovementPosition): MovementPosition => {
  const nextPosition = move(currentPosition.head)

  currentPosition.head = {
    row: nextPosition.row,
    column: nextPosition.column,
  }

  return nextPosition
}

const updateTailPosition = (direction: Direction) => {
  const { row, column } = currentPosition.head

  const acceptableRows = [
    row,
    row - 1,
    row + 1
  ]

  const acceptableColumns = [
    column,
    column - 1,
    column + 1
  ]

  if (acceptableRows.includes(currentPosition.tail.row) &&
    acceptableColumns.includes(currentPosition.tail.column)) {
    return newMovementPosition(currentPosition.tail.row, currentPosition.tail.column, true)
  }

  const tail = (() => {
    switch (direction) {
      case 'U':
        return newMovementPosition(row - 1, column, true)
      case 'D':
        return newMovementPosition(row + 1, column, true)
      case 'L':
        return newMovementPosition(row, column + 1, true)
      case 'R':
        return newMovementPosition(row, column - 1, true)
    }
  })()

  currentPosition.tail = {
    row: tail.row,
    column: tail.column,
  }

  return tail
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

    const tail = updateTailPosition(movement.direction)

    const tailPositionIndex = positions.findIndex(
      ({ row, column }) =>
        row === tail.row &&
        column === tail.column
    )

    if (tailPositionIndex > -1) {
      positions.splice(tailPositionIndex, 1, tail)
    }
  })
}

const movementPath = movements.reduce((positions, movement) => {
  processMovement(movement, positions)
  return positions
}, [newMovementPosition(0, 0, true)])

const positionsVisitedByTail = movementPath.reduce((uniqueVisits, position) => {
  if (position.hasTailVisited) uniqueVisits++
  return uniqueVisits
}, 0)

console.log(positionsVisitedByTail)