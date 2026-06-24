import { SavedProgress } from "@/types"

export function getProgress(): Record<string, SavedProgress> {
    const result: Record<string, SavedProgress> = {}
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith('puzzle_')) continue
      const raw = localStorage.getItem(key)
      if (raw) result[key] = JSON.parse(raw)
    }
    
    return result
}