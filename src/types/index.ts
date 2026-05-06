export interface Tile {
  id:      string
  label:   string
  groupId: number
}

export interface Group {
  id:          number
  correlation: string
  color:       string
  items:       string[]
}

export interface Puzzle {
  id: number
  date:   string
  groups: Group[]
}

export type GameStatus = 'playing' | 'won'