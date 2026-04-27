// store/gameStore.js
import { create } from 'zustand'
import type { Tile, Group, Puzzle, GameStatus } from '@/types'

const GROUP_SIZE = 4

interface GameState {
  puzzle: Puzzle | null
  tiles:           Tile[]
  solvedGroups:    Group[]
  selected:        string[]
  attempts:        number
  status:          GameStatus
  initGame:        (puzzle: Puzzle) => void
  toggleTile:      (tileId: string) => void
  submitSelection: () => void
}

const useGameStore = create<GameState>((set, get) => ({

  // --- STATE ---
  puzzle: null,
  tiles:          [],   // [{ id, label, groupId }]
  solvedGroups:   [],   // [{ id, correlation, color, items }]
  selected:       [],   // tile ids, max 4
  attempts:       0,
  status:         'playing', // 'playing' | 'won'


  // --- ACTIONS ---

  initGame: (puzzle) => set({
    puzzle,
    tiles:        puzzle.groups.flatMap(g => g.items.map((label, i) => ({
                    id:      `${g.id}-${i}`,
                    label,
                    groupId: g.id,
                  })))
                  .sort(() => Math.random() - 0.5),
    solvedGroups: [],
    selected:     [],
    attempts:     0,
    status:       'playing',
  }),

  toggleTile: (tileId) => {
    const { selected } = get()

    // Deselect if already selected
    if (selected.includes(tileId)) {
      return set({ selected: selected.filter(id => id !== tileId) })
    }

    // Ignore if already 4 selected
    if (selected.length >= GROUP_SIZE) return

    const newSelected = [...selected, tileId]
    set({ selected: newSelected })

    if (newSelected.length === GROUP_SIZE) {
      get().submitSelection()
    }
  },

  submitSelection: () => {
    const { selected, tiles, solvedGroups, attempts, puzzle } = get()
    if (!puzzle) return

    // Increase Attempts
    const newAttempts = attempts + 1

    // Find which group all 4 selected tiles belong to
    const selectedTiles = tiles.filter(t => selected.includes(t.id))
    const groupIds      = [...new Set(selectedTiles.map(t => t.groupId))]
    const isCorrect     = groupIds.length === 1

    if (isCorrect) {
      const solvedGroup = puzzle.groups.find(g => g.id === groupIds[0])
      if (!solvedGroup) return
      const newSolved   = [...solvedGroups, solvedGroup]
      const hasWon      = newSolved.length === puzzle.groups.length

      return set({
        attempts: newAttempts,
        solvedGroups: newSolved,
        selected:     [],
        status:       hasWon ? 'won' : 'playing',
      })
    }

    // Wrong guess
    set({ attempts: newAttempts, selected: [] })
  },

}))

function shuffle<T>(array: T[]): T[] {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

export default useGameStore