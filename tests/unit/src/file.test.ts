import {
  describe,
  it,
  expect,
  vi,
  afterEach,
  beforeAll,
  afterAll,
  MockedFunction,
  MockInstance,
} from 'vitest'
import {
  ObjectEncodingOptions,
  PathOrFileDescriptor,
  readFileSync,
  WriteFileOptions,
  writeFileSync,
} from 'fs'
import {
  getInputFilePath,
  getOutputFilePath,
  parseFileToMap,
  writeMapToFile,
} from '../../../src/file.js'
import { resolve } from 'path'
import { DIRECTION } from '../../../src/constant'

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}))
vi.mock('path', () => ({
  resolve: vi.fn(),
}))

describe('src / file ', () => {
  describe('parseFile', () => {
    let readFileSyncMock: MockedFunction<{
        (
          path: PathOrFileDescriptor,
          options?: {
            encoding?: null | undefined
            flag?: string | undefined
          } | null,
        ): Buffer
        (
          path: PathOrFileDescriptor,
          options:
            | { encoding: BufferEncoding; flag?: string | undefined }
            | BufferEncoding,
        ): string
        (
          path: PathOrFileDescriptor,
          options?:
            | (ObjectEncodingOptions & { flag?: string | undefined })
            | BufferEncoding
            | null,
        ): string | Buffer
      }>,
      consoleMock: MockInstance<any>

    beforeAll(() => {
      readFileSyncMock = vi.mocked(readFileSync)
      consoleMock = vi.spyOn(console, 'warn')
    })
    afterEach(() => {
      readFileSyncMock.mockReset()
      consoleMock.mockReset()
    })
    afterAll(() => {
      readFileSyncMock.mockRestore()
      consoleMock.mockReset()
    })

    it('should parse a valid file correctly', () => {
      const fileContent = `
      C - 3 - 4
      M - 1 - 1
      M - 2 - 2
      T - 0 - 3 - 2
      A - Lara - 1 - 1 - S - AADADAGGA
    `
      readFileSyncMock.mockReturnValueOnce(fileContent)

      const result = parseFileToMap('fakePath')

      expect(result).toEqual({
        map: { width: 3, height: 4 },
        mountains: [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
        ],
        treasures: [{ x: 0, y: 3, count: 2 }],
        adventurers: [
          {
            name: 'Lara',
            x: 1,
            y: 1,
            direction: 'S',
            moves: ['A', 'A', 'D', 'A', 'D', 'A', 'G', 'G', 'A'],
            treasuresCollected: 0,
          },
        ],
      })
    })

    it('should handle an empty file gracefully', () => {
      const fileContent = ''
      readFileSyncMock.mockReturnValueOnce(fileContent)

      const result = parseFileToMap('fakePath')

      expect(result).toEqual({
        map: undefined,
        mountains: [],
        treasures: [],
        adventurers: [],
      })
    })

    it('should log a warning for unrecognized lines', () => {
      const fileContent = `
      C - 3 - 4
      UNKNOWN - DATA
    `
      consoleMock.mockImplementation(() => {})
      readFileSyncMock.mockReturnValueOnce(fileContent)

      const result = parseFileToMap('dummyPath')

      expect(result).toEqual({
        map: { width: 3, height: 4 },
        mountains: [],
        treasures: [],
        adventurers: [],
      })

      expect(consoleMock).toHaveBeenCalledWith(
        'Unrecognized line ignored: UNKNOWN - DATA',
      )
    })

    it('should throw an error if the file does not exist', () => {
      readFileSyncMock.mockImplementation(() => {
        throw new Error('File not found')
      })

      expect(() => parseFileToMap('fakePath')).toThrow('File not found')
    })
  })

  describe('getInputFilePath', () => {
    let resolveMock: MockedFunction<(...paths: string[]) => string>

    beforeAll(() => {
      resolveMock = vi.mocked(resolve)
    })
    afterEach(() => {
      resolveMock.mockReset()
    })
    afterAll(() => {
      resolveMock.mockRestore()
    })
    it('should resolve the correct input file path', () => {
      resolveMock.mockReturnValueOnce('fake/path')

      const result = getInputFilePath()

      expect(result).toBe('fake/path')
      expect(resolveMock).toHaveBeenCalledWith('resource/input/input.txt')
    })
  })

  describe('getOutputFilePath', () => {
    let resolveMock: MockedFunction<(...paths: string[]) => string>

    beforeAll(() => {
      resolveMock = vi.mocked(resolve)
    })
    afterEach(() => {
      resolveMock.mockReset()
    })
    afterAll(() => {
      resolveMock.mockRestore()
    })
    it('should resolve the correct input file path', () => {
      resolveMock.mockReturnValueOnce('fake/path')

      const result = getOutputFilePath()

      expect(result).toBe('fake/path')
      expect(resolveMock).toHaveBeenCalledWith('resource/output/output.txt')
    })
  })

  describe('writeMapToFile', () => {
    let writeFileSyncMock: MockedFunction<
      (
        file: PathOrFileDescriptor,
        data: string | NodeJS.ArrayBufferView,
        options?: WriteFileOptions,
      ) => void
    >

    beforeAll(() => {
      writeFileSyncMock = vi.mocked(writeFileSync)
    })
    afterEach(() => {
      writeFileSyncMock.mockReset()
    })
    afterAll(() => {
      writeFileSyncMock.mockRestore()
    })

    it('should write the correct map data to the file', () => {
      const parsedMap = {
        map: { width: 5, height: 4 },
        mountains: [{ x: 1, y: 1 }],
        treasures: [{ x: 2, y: 3, count: 2 }],
        adventurers: [
          {
            name: 'Lara',
            x: 0,
            y: 0,
            direction: DIRECTION[0],
            treasuresCollected: 1,
            moves: [],
          },
        ],
      }

      const filePath = '/path/to/output.txt'

      writeMapToFile(parsedMap, filePath)

      const expectedFileContent = [
        'C - 5 - 4',
        'M - 1 - 1',
        'T - 2 - 3 - 2',
        'A - Lara - 0 - 0 - N - 1',
      ].join('\n')

      expect(writeFileSync).toHaveBeenCalledWith(filePath, expectedFileContent)
      expect(writeFileSync).toHaveBeenCalledTimes(1)
    })

    it('should handle empty parsedMap gracefully', () => {
      const parsedMap = {
        map: undefined,
        mountains: [],
        treasures: [],
        adventurers: [],
      }

      const filePath = '/path/to/empty.txt'

      writeMapToFile(parsedMap, filePath)

      const expectedFileContent = 'C - undefined - undefined'

      expect(writeFileSync).toHaveBeenCalledWith(filePath, expectedFileContent)
      expect(writeFileSync).toHaveBeenCalledTimes(1)
    })
  })
})
