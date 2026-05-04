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
  hintsUsed:       number
  hintedGroups:    Record<number, string[]> 
  status:          GameStatus
  initGame:        (puzzle: Puzzle) => void
  toggleTile:      (tileId: string) => void
  submitSelection: () => void
  activateHint:    () => void
}

const useGameStore = create<GameState>((set, get) => ({

  // --- STATE ---
  puzzle: null,
  tiles:          [],   // [{ id, label, groupId }]
  solvedGroups:   [],   // [{ id, correlation, color, items }]
  selected:       [],   // tile ids, max 4
  attempts:       0,
  hintsUsed:      0,
  hintedGroups:   {},
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
    hintsUsed:    0,
    hintedGroups: {},
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

  activateHint: () => {
    const { puzzle, solvedGroups, hintsUsed, hintedGroups, tiles } = get()
    if (!puzzle) return
    
    const unsolvedGroups = puzzle.groups.filter(g => !solvedGroups.some(sg => sg.id === g.id))
    if (unsolvedGroups.length === 0) return 

    const newHintedGroups = { ...hintedGroups }

    const partialGroup = unsolvedGroups.find(g => hintedGroups[g.id] && hintedGroups[g.id].length < 3)

    if (partialGroup) {
      const alreadyHinted = hintedGroups[partialGroup.id]
      const candidates = tiles.filter(t => t.groupId === partialGroup.id && !alreadyHinted.includes(t.id))
      const picked = candidates[Math.floor(Math.random() * candidates.length)]

      newHintedGroups[partialGroup.id] = [...alreadyHinted, picked.id]
    } else {
      const unhintedGroup = unsolvedGroups.filter(g => !hintedGroups[g.id])
      if (unhintedGroup.length === 0) return

      const randomGroup = unhintedGroup[Math.floor(Math.random() * unhintedGroup.length)]
      const candidates = tiles.filter(t => t.groupId === randomGroup.id)

      const shuffled = [...candidates].sort(() => Math.random() - 0.5)
      const picked = shuffled.slice(0, 2).map(t => t.id)

      newHintedGroups[randomGroup.id] = picked
    }

    set({
      hintedGroups: newHintedGroups,
      hintsUsed: hintsUsed + 1,
      selected: [],
    })
  }

}))

export default useGameStore