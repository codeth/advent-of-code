import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'
import {CommandGroup, CommandGroupWithPath, DirectoryTree} from "./types.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const input: string = readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8')

const shellOutput = input.split('\n')

const isCommand = (line: string) => line.startsWith('$')
const isUpOneLevel = (line: string) => isCommand(line) && line.includes('..')
const isEnterDirectory = (line: string) => isCommand(line) && line.includes('cd') && !isUpOneLevel(line)

let commandGroupIndex = 0

const newCommandGroup = (): CommandGroup => ({ commands: [], outputs: [] })

const cwd = ['.']

const commandGroups: CommandGroupWithPath[] = shellOutput
  .reduce((groups, nextLine) => {
    if (isCommand(nextLine)) {
      if (groups[commandGroupIndex].outputs.length) {
        groups.push(newCommandGroup())
        commandGroupIndex++
      }

      groups[commandGroupIndex].commands.push(nextLine)
    } else {
      groups[commandGroupIndex].outputs.push(nextLine)
    }

    return groups
  }, [newCommandGroup()] as CommandGroup[])
  .map(({ commands, outputs }) => {
    commands.forEach(line => {
      if (isUpOneLevel(line)) cwd.pop()

      if (isEnterDirectory(line)) {
        const directoryName = line.replace('$ cd ', '')

        if (directoryName !== '/') cwd.push(directoryName)
      }
    })

    return {
      commands,
      outputs,
      workingDirectory: cwd.join('/')
    }
  })


const getChildCommandGroup = (pathToDirectory: string) => {
  return commandGroups.find(({ workingDirectory }) => workingDirectory === pathToDirectory)
}

const isDirectory = (output: string) => output.startsWith('dir')

const processCommandGroup = ({ outputs, workingDirectory }: CommandGroupWithPath): DirectoryTree => {
  const sizeOfFiles = outputs
    .filter(output => !isDirectory(output))
    .reduce((total, nextFile) => {
      total += parseInt(nextFile.split(' ')[0], 10)
      return total
    }, 0)

  const directories = outputs
    .filter(output => output.startsWith('dir'))
    .map(directoryOutput => directoryOutput.replace('dir ', ''))
    .reduce((map, nextDirectory) => ({
      ...map,
      [nextDirectory]: processCommandGroup(getChildCommandGroup(`${workingDirectory}/${nextDirectory}`)!)
    }), {} as Record<string, DirectoryTree>)

  const sizeOfDirectories = Object.keys(directories).reduce((total, directory) => {
    total += directories[directory].size
    return total
  }, 0)

  return {
    workingDirectory,
    size: sizeOfFiles + sizeOfDirectories,
    directories,
  }
}

const sizedDirectories = commandGroups.slice(1).map(group => processCommandGroup(group))

const totalSizeOfSub100kDirectories = sizedDirectories
  .filter(directory => directory.size <= 100000)
  .reduce((total, { size }) => {
    total += size
    return total
  }, 0)

console.log(totalSizeOfSub100kDirectories)

const currentFreeSpace = 70000000 - processCommandGroup(commandGroups[0]).size
const spaceToFreeUp = 30000000 - currentFreeSpace

const candidatesForDeletion = sizedDirectories
  .filter(({ size }) => size >= spaceToFreeUp)
  .sort((a, b) => a.size - b.size)

console.log(candidatesForDeletion[0].size)