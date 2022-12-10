export interface TreePosition {
  row: number
  column: number
  height: number
}

export interface TreeVisibility {
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
}

export type TreeVisibilityInColumn = Pick<TreeVisibility, 'top' | 'bottom'>
export type TreeVisibilityInRow = Pick<TreeVisibility, 'left' | 'right'>