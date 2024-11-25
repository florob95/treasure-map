import {
  describe,
  vi,
  it,
  afterEach,
  afterAll,
  expect,
  beforeAll,
  MockedFunction,
  MockInstance,
} from 'vitest'
import {
  getInputFilePath,
  getOutputFilePath,
  parseFileToMap,
  writeMapToFile,
} from '../../../src/file'
import { simulateAdventurerMovement } from '../../../src/adventurer'
import { Adventurer, ParsedMap } from '../../../src/definitions'
import { run } from '../../../src'
import { DIRECTION } from '../../../src/constant'

vi.mock('../../../src/adventurer', () => ({
  simulateAdventurerMovement: vi.fn(),
}))
vi.mock('../../../src/file', () => ({
  parseFileToMap: vi.fn(),
  getInputFilePath: vi.fn(),
  getOutputFilePath: vi.fn(),
  writeMapToFile: vi.fn(),
}))

describe('src / index', () => {
  describe('run', () => {
    let parseFileToMapMock: MockedFunction<(filePath: string) => ParsedMap>,
      simulateAdventurerMovementMock: MockedFunction<
        (parsedMap: ParsedMap) => Adventurer[]
      >,
      getInputFilePathMock: MockedFunction<() => string>,
      getOutputFilePathMock: MockedFunction<() => string>,
      writeMapToFileMock: MockedFunction<
        (parsedMap: ParsedMap, filePath: string) => void
      >,
      consoleErrorSpy: MockInstance<any>

    beforeAll(() => {
      parseFileToMapMock = vi.mocked(parseFileToMap)
      simulateAdventurerMovementMock = vi.mocked(simulateAdventurerMovement)
      getInputFilePathMock = vi.mocked(getInputFilePath)
      getOutputFilePathMock = vi.mocked(getOutputFilePath)
      writeMapToFileMock = vi.mocked(writeMapToFile)
      consoleErrorSpy = vi.spyOn(console, 'error')
    })
    afterEach(() => {
      parseFileToMapMock.mockReset()
      simulateAdventurerMovementMock.mockReset()
      getInputFilePathMock.mockReset()
      getOutputFilePathMock.mockReset()
      writeMapToFileMock.mockReset()
      consoleErrorSpy.mockReset()
    })
    afterAll(() => {
      parseFileToMapMock.mockRestore()
      simulateAdventurerMovementMock.mockRestore()
      getInputFilePathMock.mockRestore()
      getOutputFilePathMock.mockRestore()
      writeMapToFileMock.mockRestore()
      consoleErrorSpy.mockRestore()
    })

    it('should parse the input file, simulate movements, and write the output', () => {
      const mockAdventurers = [
        {
          name: 'John',
          x: 1,
          y: 1,
          direction: DIRECTION[0],
          moves: ['A', 'A', 'G'],
          treasuresCollected: 1,
        },
      ]
      const mockMap = {
        width: 5,
        height: 5,
        mountains: [],
        adventurers: mockAdventurers,
        treasures: [],
      }

      parseFileToMapMock.mockReturnValue(mockMap)
      simulateAdventurerMovementMock.mockReturnValue(mockAdventurers)
      getInputFilePathMock.mockReturnValue('/path/to/input')
      getOutputFilePathMock.mockReturnValue('/path/to/output')

      run()

      expect(parseFileToMapMock).toHaveBeenCalledWith('/path/to/input')
      expect(simulateAdventurerMovementMock).toHaveBeenCalledWith(mockMap)
      expect(writeMapToFileMock).toHaveBeenCalledWith(
        { ...mockMap, adventurers: mockAdventurers },
        '/path/to/output',
      )
    })

    it('should handle errors gracefully', () => {
      const errorMessage = 'Something went wrong'
      parseFileToMapMock.mockImplementation(() => {
        throw new Error(errorMessage)
      })
      consoleErrorSpy.mockImplementation(() => {})

      run()

      expect(consoleErrorSpy).toBeCalled()
    })
  })
})
