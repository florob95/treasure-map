import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { Directions, ParsedMap } from './definitions.js'

export const parseFileToMap = (filePath: string): ParsedMap => {
  try {
    const fileContent = readFileSync(filePath, 'utf-8')

    const lines = fileContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => !!line)

    return lines.reduce<ParsedMap>(
      (acc, line) => {
        const parts = line.split(' - ')
        const type = parts[0]

        switch (type) {
          case 'C':
            return {
              ...acc,
              map: {
                width: parseInt(parts[1], 10),
                height: parseInt(parts[2], 10),
              },
            }

          case 'M':
            return {
              ...acc,
              mountains: [
                ...acc.mountains,
                {
                  x: parseInt(parts[1], 10),
                  y: parseInt(parts[2], 10),
                },
              ],
            }

          case 'T':
            return {
              ...acc,
              treasures: [
                ...acc.treasures,
                {
                  x: parseInt(parts[1], 10),
                  y: parseInt(parts[2], 10),
                  count: parseInt(parts[3], 10),
                },
              ],
            }

          case 'A':
            return {
              ...acc,
              adventurers: [
                ...acc.adventurers,
                {
                  name: parts[1],
                  x: parseInt(parts[2], 10),
                  y: parseInt(parts[3], 10),
                  direction: parts[4] as Directions,
                  moves: parts[5].split(''),
                  treasuresCollected: 0,
                },
              ],
            }

          default:
            console.warn(`Unrecognized line ignored: ${line}`)
            return acc
        }
      },
      { map: undefined, mountains: [], treasures: [], adventurers: [] },
    )
  } catch (error) {
    console.error('Error while reading the file:', error)
    throw error
  }
}

export const getInputFilePath = () => {
  return resolve('resource/input/input.txt')
}

export const getOutputFilePath = () => {
  return resolve('resource/output/output.txt')
}

export function writeMapToFile(parsedMap: ParsedMap, filePath: string) {
  const { map, mountains, treasures, adventurers } = parsedMap

  const fileContent = [
    `C - ${map?.width} - ${map?.height}`,
    ...mountains.map((mountain) => `M - ${mountain.x} - ${mountain.y}`),
    ...treasures.map(
      (treasure) => `T - ${treasure.x} - ${treasure.y} - ${treasure.count}`,
    ),
    ...adventurers.map(
      (adventurer) =>
        `A - ${adventurer.name} - ${adventurer.x} - ${adventurer.y} - ${adventurer.direction} - ${adventurer.treasuresCollected ?? 0}`,
    ),
  ].join('\n')

  writeFileSync(filePath, fileContent)
}
