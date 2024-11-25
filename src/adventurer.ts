import { Adventurer, ParsedMap } from './definitions.js'
import { DIRECTION, MOVEMENT_MAP } from './constant.js'
import { convertToMap } from './helper.js'

export const simulateAdventurerMovement = (
  parsedMap: ParsedMap,
): Adventurer[] => {
  if (!parsedMap.map) throw new Error('Map is not defined')

  const { map, mountains, treasures, adventurers } = parsedMap

  const mountainMap = convertToMap(
    mountains,
    (mountain) => `${mountain.x}-${mountain.y}`,
  )
  const treasureMap = convertToMap(
    treasures,
    (treasure) => `${treasure.x}-${treasure.y}`,
  )
  const adventurerPositions = convertToMap(
    adventurers,
    (adventurer) => `${adventurer.x}-${adventurer.y}`,
  )

  let remainingMoves = adventurers.reduce(
    (sum, adventurer) => sum + adventurer.moves.length,
    0,
  )

  while (remainingMoves > 0) {
    // TODO not mute adventurer
    for (const adventurer of adventurers) {
      if (!adventurer.moves.length) continue

      const move = adventurer.moves[0]
      adventurer.moves = adventurer.moves.slice(1)

      let { x, y, direction } = adventurer

      switch (move) {
        case 'A': {
          const offset = MOVEMENT_MAP.get(direction) as {
            dx: number
            dy: number
          }
          const newX = x + offset.dx
          const newY = y + offset.dy

          const newCoordinates = `${newX}-${newY}`
          if (
            newX >= 0 &&
            newX < map.width &&
            newY >= 0 &&
            newY < map.height &&
            !mountainMap.has(newCoordinates) &&
            !adventurerPositions.has(newCoordinates)
          ) {
            adventurerPositions.delete(`${x}-${y}`)
            adventurerPositions.set(newCoordinates, adventurer)
            x = newX
            y = newY

            const treasure = treasureMap.get(newCoordinates)
            if (treasure && treasure.count > 0) {
              adventurer.treasuresCollected += 1
              treasureMap.set(newCoordinates, {
                ...treasure,
                count: treasure.count - 1,
              })
            }
          }
          break
        }
        case 'G': {
          direction = DIRECTION[(DIRECTION.indexOf(direction) + 3) % 4]
          break
        }
        case 'D': {
          direction = DIRECTION[(DIRECTION.indexOf(direction) + 1) % 4]
          break
        }
      }

      adventurer.x = x
      adventurer.y = y
      adventurer.direction = direction
      remainingMoves--
    }
  }

  return adventurers
}
