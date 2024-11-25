import {
  getInputFilePath,
  getOutputFilePath,
  parseFileToMap,
  writeMapToFile,
} from './file.js'
import { simulateAdventurerMovement } from './adventurer.js'

export const run = () => {
  try {
    const map = parseFileToMap(getInputFilePath())
    const adventurers = simulateAdventurerMovement(map)
    console.log(simulateAdventurerMovement(map))
    writeMapToFile({ ...map, adventurers }, getOutputFilePath())
  } catch (error) {
    console.log(error)
    console.error(error)
  }
}

run()
