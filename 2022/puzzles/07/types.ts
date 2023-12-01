export interface CommandGroup {
  commands: string[]
  outputs: string[]
}

export interface CommandGroupWithPath extends CommandGroup {
  workingDirectory: string
}

export interface DirectoryTree {
  workingDirectory: string
  size: number
  directories: Record<string, DirectoryTree>
}
