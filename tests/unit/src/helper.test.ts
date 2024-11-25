import { describe, expect, it } from 'vitest'
import { convertToMap } from '../../../src/helper'

describe('src / helper', () => {
  describe('convertToMap', () => {
    it('should convert array to map', () => {
      expect(convertToMap([{ key: 1 }, { key: 2 }], (obj) => obj.key)).toEqual(
        new Map([
          [1, { key: 1 }],
          [2, { key: 2 }],
        ]),
      )
    })
  })
})
