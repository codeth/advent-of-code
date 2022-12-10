import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'
import {TreePosition, TreeVisibility, TreeVisibilityInColumn, TreeVisibilityInRow} from "./types.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const input: string = readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8')

const newTreePosition = (row: number, column: number, height: string): TreePosition => ({
  row,
  column,
  height: parseInt(height, 10)
})

const treeGrid = input.split('\n')
  .map((row, rowIndex) => ([...row])
    .map((treeHeight, columnIndex) => newTreePosition(rowIndex, columnIndex, treeHeight)))

const visiblePerimeter = (treeGrid.length - 1) * 4

const treeVisibilityInColumn = ({ row, column, height }: TreePosition) => treeGrid.reduce((isVisibleFrom, currentRow, currentIndex) => {
  if (currentIndex === row) return isVisibleFrom

  const isTop = currentIndex < row
  const isBottom = currentIndex > row

  if (currentRow[column].height >= height) {
    if (isTop) isVisibleFrom.top = false
    if (isBottom) isVisibleFrom.bottom = false
  }

  return isVisibleFrom
}, { top: true, bottom: true } as TreeVisibilityInColumn)

const treeVisibilityInRow = ({ row, column, height }: TreePosition) => treeGrid[row].reduce((isVisibleFrom, currentColumn, currentIndex) => {
  if (currentIndex === column) return isVisibleFrom

  const isLeft = currentIndex < column
  const isRight = currentIndex > column

  if (currentColumn.height >= height) {
    if (isLeft) isVisibleFrom.left = false
    if (isRight) isVisibleFrom.right = false
  }

  return isVisibleFrom
}, { left: true, right: true } as TreeVisibilityInRow)

const treeVisibilityGrid: TreeVisibility[][] = treeGrid
  .map(row => row.map(tree => {
    return {
      ...treeVisibilityInColumn(tree),
      ...treeVisibilityInRow(tree),
    }
  }))

const innerTreeVisibilityGrid = treeVisibilityGrid
  .slice(1, treeGrid.length - 1)
  .map(row => row.slice(1, row.length - 1))

const innerVisibleTrees = innerTreeVisibilityGrid.reduce((gridTotal, row) => {
  gridTotal += row.reduce((rowTotal, treeVisibility) => {
    if (Object.values(treeVisibility).some((side: boolean) => side === true)) {
      rowTotal += 1
    }

    return rowTotal
  }, 0)

  return gridTotal
}, 0)

console.log(innerVisibleTrees + visiblePerimeter)
