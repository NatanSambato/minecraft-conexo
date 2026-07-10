import { PUZZLE_KEY_PREFIX } from "@/hooks/useProgress"
import type { SavedProgress } from "@/types"

export function getProgress(): Record<string, SavedProgress> {
    const result: Record<string, SavedProgress> = {}
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith(PUZZLE_KEY_PREFIX)) {
        continue
      } 
      console.log(`Loading localStorage key: ${key}`)
      const raw = localStorage.getItem(key)
      if (raw) result[key] = JSON.parse(raw)
    }
    
    return result
}