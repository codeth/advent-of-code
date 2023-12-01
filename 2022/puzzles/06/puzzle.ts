import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const input: string = readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8')

const buffer = [...input]

const findMarkerOfLength = (markerLength: number) => {
  let markerFoundIndex = 0

  const marker = buffer.reduce((marker, nextCharacter, currentIndex) => {
    if (marker.length === markerLength) {
      if (markerFoundIndex < 1) markerFoundIndex = currentIndex
      return marker
    }
    if (marker.includes(nextCharacter)) {
      const repeatIndex = marker.findIndex(character => character === nextCharacter)
      marker.splice(0, repeatIndex + 1)
    }

    return [
      ...marker,
      nextCharacter
    ]
  }, [] as string[])

  return { marker, markerFoundIndex }
}

const startOfPacket = findMarkerOfLength(4)
console.log(startOfPacket.marker.join(''), 'found after', startOfPacket.markerFoundIndex, 'characters')

const startOfMessage = findMarkerOfLength(14)
console.log(startOfMessage.marker.join(''), 'found after', startOfMessage.markerFoundIndex, 'characters')