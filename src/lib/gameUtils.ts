export function getTodaysDate(): string {
  return new Date().toISOString().split('T')[0] // "2026-04-23"
}