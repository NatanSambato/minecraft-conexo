import { useCallback } from 'react';
import { SavedProgress } from '../types/index';

const STORAGE_VERSION = 2;
export const PUZZLE_KEY_PREFIX = `v${STORAGE_VERSION}_puzzle_`;

export const buildKey = (puzzleId: number): string => `${PUZZLE_KEY_PREFIX}${puzzleId}`

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