import puzzleOverhauls from '@/app/data/puzzleOverhauls.json'
import { Puzzle, Group } from '@/types'

export function wasOverhauled(puzzleId: number): boolean {
    return (puzzleOverhauls as number[]).includes(puzzleId)
}

export function puzzleContentMatches(puzzle: Puzzle, solvedGroups: Group[]): boolean {
    return solvedGroups.every((saved) => {
        const current = puzzle.groups.find((g) => g.id === saved.id)
        if (!current) return false
        if (current.correlation !== saved.correlation) return false

        const a = [...saved.items].sort()
        const b = [...current.items].sort()
        return a.length === b.length && a.every((item, i) => item === b[i])
    })
}