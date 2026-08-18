import overhauledPuzzles from '@/app/data/overhauledPuzzles.json'
import { Puzzle } from '@/types'

export function wasOverhauled(puzzleId: number): boolean {
    return (overhauledPuzzles as number[]).includes(puzzleId)
}

export function puzzleContentMatches(puzzle: Puzzle, savedLabels: string[]): boolean {
    if (!savedLabels) return false;

    const currentItems = puzzle.groups.flatMap((g) => g.items).sort();
    const savedItems = [...savedLabels].sort();

    if (currentItems.length !== savedItems.length) return false;
    return currentItems.every((item, i) => item === savedItems[i]);
}