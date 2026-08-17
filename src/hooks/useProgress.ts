import { useCallback } from "react";
import type { Puzzle, SavedProgress } from "../types/index";
import { wasOverhauled, puzzleContentMatches } from "@/lib/puzzleOverhauls";

const STORAGE_VERSION = 2;
export const PUZZLE_KEY_PREFIX = `v${STORAGE_VERSION}_puzzle_`;

export const buildKey = (puzzleId: number): string =>
  `${PUZZLE_KEY_PREFIX}${puzzleId}`;

export const loadProgressFromStorage = (
  puzzle: Puzzle,
): SavedProgress | null => {
  try {
    const raw = localStorage.getItem(buildKey(puzzle.id));
    if (!raw) return null;

    const saved = JSON.parse(raw) as SavedProgress;

    if (
      wasOverhauled(puzzle.id) &&
      !puzzleContentMatches(puzzle, saved.solvedGroups)
    ) {
      localStorage.removeItem(buildKey(puzzle.id));
      return null;
    }

    return saved;
  } catch {
    return null;
  }
};
export const saveProgressToStorage = (
  puzzleId: number,
  progress: SavedProgress,
): void => {
  try {
    localStorage.setItem(buildKey(puzzleId), JSON.stringify(progress));
  } catch { }
};

export function useProgress(puzzle: Puzzle) {
  const loadProgress = useCallback(
    () => loadProgressFromStorage(puzzle),
    [puzzle],
  );
  const saveProgress = (progress: SavedProgress) =>
    saveProgressToStorage(puzzle.id, progress);
  return { loadProgress, saveProgress };
}
