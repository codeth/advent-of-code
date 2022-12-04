export type AssignmentRange = `${number}-${number}`

export type CleanupPair = [AssignmentRange, AssignmentRange]

export interface CleanupAssignment {
  start: number
  end: number
}

export type CleanupAssignmentPair = [CleanupAssignment, CleanupAssignment]
