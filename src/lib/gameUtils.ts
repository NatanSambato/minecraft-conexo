export function getTodaysDate(): string {
  return new Date().toISOString().split('T')[0] // "2026-04-23"
}

const colorMap: Record<string, string> = {
  green:  'bg-green-600',
  yellow: 'bg-yellow-500',
  blue:   'bg-blue-800',
  purple: 'bg-purple-600',
}

export function getGroupColor(groupColor: string): string {
  return colorMap[groupColor] ?? 'bg-gray-600'
}

            
const colorHexMap: Record<string, string> = {
  green:  '#16a34a',
  yellow: '#eab308',
  blue:   '#1e40af',
  purple: '#9333ea',
}

export function getGroupHex(groupColor: string): string {
  return colorHexMap[groupColor] ?? '#57534e'
}