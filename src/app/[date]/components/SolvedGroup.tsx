import { getGroupColor } from '@/lib/gameUtils'
import { getImage } from '@/lib/registry'
import type { Group } from '@/types'
import Image from 'next/image'

export default function SolvedGroup({ group }: { group: Group }) {
  const bgColor = getGroupColor(group.color)
  const images =  group.items.map(item => getImage(item))

  return (
    <div className={`flex flex-col items-center justify-center p-1.5 h-20 rounded-lg position:relative ${bgColor}`}>
      <span className='font-bold text-lg'>{group.correlation}</span>
      <span className='flex gap-5 mt-1'>
        {images.map((image, i) => (
          <Image
            key={group.items[i] ?? i}
            src={image || '/images/placeholder.png'}
            alt={group.items[i]}
            width={35}
            height={35}
            unoptimized={image?.endsWith(".gif") ?? false}
            loading='lazy'
            className='object-contain'
          />
        ))}
      </span>
    </div>
  )
}
