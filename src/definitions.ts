import { DIRECTION } from './constant.js'

export type Mountain = { x: number; y: number }
export type Treasure = { x: number; y: number; count: number }
export type Adventurer = {
  name: string
  x: number
  y: number
  direction: Directions
  moves: string[]
  treasuresCollected: number
}

export type ParsedMap = {
  map?: { width: number; height: number }
  mountains: Mountain[]
  treasures: Treasure[]
  adventurers: Adventurer[]
}

export type Directions = (typeof DIRECTION)[number]
