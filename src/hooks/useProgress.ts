import { useCallback } from 'react';
import { SavedProgress } from '../types/index';

export const buildKey = (puzzleId: number): string => `puzzle_${puzzleId}`

export const loadProgressFromStorage = (puzzleId: number): SavedProgress | null => {
    try {
        const raw = localStorage.getItem(buildKey(puzzleId))
        return raw ? (JSON.parse(raw) as SavedProgress) : null
    } catch {
        return null
    }   
}

export const saveProgressToStorage = (puzzleId: number, progress : SavedProgress): void => {
    try {
        localStorage.setItem(buildKey(puzzleId), JSON.stringify(progress))
    } catch {}
}

export function useProgress(puzzleId: number) {
    const loadProgress = useCallback(() => loadProgressFromStorage(puzzleId), [puzzleId])
    const saveProgress = (progress: SavedProgress) => saveProgressToStorage(puzzleId, progress)
    return { loadProgress, saveProgress }
}