import { Directions } from './definitions.js'

export const DIRECTION = ['N', 'E', 'S', 'W'] as const

export const MOVEMENT_MAP = new Map<Directions, { dx: number; dy: number }>([
  ['N', { dx: 0, dy: -1 }],
  ['E', { dx: 1, dy: 0 }],
  ['S', { dx: 0, dy: 1 }],
  ['W', { dx: -1, dy: 0 }],
])
