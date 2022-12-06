import path from 'https://deno.land/std@0.167.0/node/path.ts'
import { readFileSync } from 'https://deno.land/std@0.167.0/node/fs.ts'
import { Marker } from './types.ts'

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const input: string = readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8')

const buffer = [...input]

let markerFoundIndex = 0

const startOfPacketMarker = buffer.reduce((marker, nextCharacter, currentIndex) => {
  if (marker.length === 4) {
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
  ] as unknown as Marker
}, [] as unknown as Marker)

console.log(startOfPacketMarker.join(''), 'found after', markerFoundIndex, 'characters')