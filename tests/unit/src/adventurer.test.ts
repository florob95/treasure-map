import { simulateAdventurerMovement } from '../../../src/adventurer.js'
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterEach,
  afterAll,
  MockedFunction,
} from 'vitest'
import { convertToMap } from '../../../src/helper'
import { DIRECTION } from '../../../src/constant'

vi.mock('../../../src/helper.js', () => ({
  convertToMap: vi.fn(),
}))

describe('src / adventurer', () => {
  describe('simulateAdventurers', () => {
    let convertToMapMock: MockedFunction<
      <T, KEY>(
        toMap: T[],
        keyOfElement: (toMapElement: T) => KEY,
      ) => Map<KEY, T>
    >

    beforeAll(() => {
      convertToMapMock = vi.mocked(convertToMap)
    })
    afterEach(() => {
      convertToMapMock.mockReset()
    })
    afterAll(() => {
      convertToMapMock.mockRestore()
    })

    it('should simulate the movement of adventurers and update positions and treasures', () => {
      const mockParsedMap = {
        map: { width: 5, height: 5 },
        mountains: [{ x: 1, y: 1 }],
        treasures: [{ x: 2, y: 2, count: 1 }],
        adventurers: [
          {
            name: 'John',
            x: 0,
            y: 0,
            direction: DIRECTION[0],
            moves: ['A', 'D', 'A'],
            treasuresCollected: 0,
          },
        ],
      }

      const mockMountainMap = new Map([['1-1', { x: 1, y: 1 }]])
      const mockTreasureMap = new Map([['2-2', { x: 2, y: 2, count: 1 }]])
      const mockAdventurerPositions = new Map([
        ['0-0', mockParsedMap.adventurers[0]],
      ])

      convertToMapMock
        .mockImplementationOnce(() => mockMountainMap)
        .mockImplementationOnce(() => mockTreasureMap)
        .mockImplementationOnce(() => mockAdventurerPositions)

      const result = simulateAdventurerMovement(mockParsedMap)

      const expectedAdventurers = [
        {
          name: 'John',
          x: 1,
          y: 0,
          direction: 'E',
          moves: [],
          treasuresCollected: 0,
        },
      ]

      expect(result).toEqual(expectedAdventurers)
      expect(convertToMapMock).toHaveBeenCalledTimes(3)
      expect(convertToMapMock).toHaveBeenCalledWith(
        mockParsedMap.mountains,
        expect.any(Function),
      )
      expect(convertToMapMock).toHaveBeenCalledWith(
        mockParsedMap.treasures,
        expect.any(Function),
      )
      expect(convertToMapMock).toHaveBeenCalledWith(
        mockParsedMap.adventurers,
        expect.any(Function),
      )
    })

    it('should throw an error if map is not defined', () => {
      const invalidParsedMap = {
        map: undefined,
        mountains: [],
        treasures: [],
        adventurers: [],
      }

      expect(() => simulateAdventurerMovement(invalidParsedMap)).toThrowError(
        'Map is not defined',
      )
    })

    it('should handle empty moves gracefully', () => {
      const mockParsedMap = {
        map: { width: 5, height: 5 },
        mountains: [],
        treasures: [],
        adventurers: [
          {
            name: 'Jane',
            x: 0,
            y: 0,
            direction: DIRECTION[0],
            moves: [],
            treasuresCollected: 0,
          },
        ],
      }

      const mockMountainMap = new Map()
      const mockTreasureMap = new Map()
      const mockAdventurerPositions = new Map([
        ['0-0', mockParsedMap.adventurers[0]],
      ])

      convertToMapMock
        .mockImplementationOnce(() => mockMountainMap)
        .mockImplementationOnce(() => mockTreasureMap)
        .mockImplementationOnce(() => mockAdventurerPositions)

      const result = simulateAdventurerMovement(mockParsedMap)

      const expectedAdventurers = [
        {
          name: 'Jane',
          x: 0,
          y: 0,
          direction: 'N',
          moves: [],
          treasuresCollected: 0,
        },
      ]

      expect(result).toEqual(expectedAdventurers)
      expect(convertToMapMock).toHaveBeenCalledTimes(3)
    })
  })
})
