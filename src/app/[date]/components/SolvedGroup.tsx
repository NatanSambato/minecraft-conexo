import { Group } from '@/types'

const colorMap: Record<string, string> = {
  green:  'bg-green-600',
  yellow: 'bg-yellow-500',
  blue:   'bg-blue-800',
  purple: 'bg-purple-600',
}

export default function SolvedGroup({ group }: { group: Group }) {
  const bgColor = colorMap[group.color] ?? 'bg-gray-600'

  return (
    <div className={`flex flex-col items-center justify-center p-1.5 rounded-lg ${bgColor}`}>
      <span className='font-bold text-lg'>{group.correlation}</span>
      <span className='uppercase'>{group.items.join(', ')}</span>
    </div>
  )
}
