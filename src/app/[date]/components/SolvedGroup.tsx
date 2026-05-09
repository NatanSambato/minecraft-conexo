import { getGroupColor } from '@/lib/gameUtils'
import { Group } from '@/types'

export default function SolvedGroup({ group }: { group: Group }) {
  const bgColor = getGroupColor(group.color)

  return (
    <div className={`flex flex-col items-center justify-center p-1.5 h-20 rounded-lg ${bgColor}`}>
      <span className='font-bold text-lg'>{group.correlation}</span>
      <span className='uppercase'>{group.items.join(', ')}</span>
    </div>
  )
}
