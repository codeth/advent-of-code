import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'
import {
  TreePosition,
  TreeViewingPosition,
  TreeVisibility,
  TreeVisibilityInColumn,
  TreeVisibilityInRow
} from "./types.ts";

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

const viewingDistance = (current: TreePosition, trees: TreePosition[]) => {
  let isBlocked = false

  return trees.reduce((distance, tree) => {
    if (isBlocked) return distance
    if (tree.height >= current.height) isBlocked = true
    distance += 1
    return distance
  }, 0)
}

const treeViewingPositions: TreeViewingPosition[][] = treeGrid
  .map(row => row.map(tree => {
    const toLeft = treeGrid[tree.row].slice(0, tree.column).reverse()
    const toRight = treeGrid[tree.row].slice(tree.column + 1)
    const toTop = treeGrid.slice(0, tree.row).reverse().map(row => row[tree.column])
    const toBottom = treeGrid.slice(tree.row + 1).map(row => row[tree.column])

    const viewingDistanceTop = viewingDistance(tree, toTop)
    const viewingDistanceLeft = viewingDistance(tree, toLeft)
    const viewingDistanceBottom = viewingDistance(tree, toBottom)
    const viewingDistanceRight = viewingDistance(tree, toRight)

    const scenicScore = viewingDistanceTop
      * viewingDistanceLeft
      * viewingDistanceBottom
      * viewingDistanceRight

    return { scenicScore }
  }))

const topScenicScore = treeViewingPositions.reduce((gridScore, row) => {
  const score = row.reduce((rowScore, tree) => {
    if (tree.scenicScore < rowScore) return rowScore
    return tree.scenicScore
  }, 0)

  if (score < gridScore) return gridScore
  return score
}, 0)

console.log(topScenicScore)