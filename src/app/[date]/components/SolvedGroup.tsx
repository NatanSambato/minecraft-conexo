import { getGroupColor } from '@/lib/gameUtils'
import { getImage } from '@/lib/registry'
import type { Group } from '@/types'
import Image from 'next/image'

export default function SolvedGroup({ group }: { group: Group }) {
  const bgColor = getGroupColor(group.color)
  const images =  group.items.map(item => getImage(item))

  return (
    <div className={`flex flex-col items-center justify-center p-1.5 h-20 rounded-lg ${bgColor}`}>
      <span className='font-bold text-base leading-tight'>{group.correlation}</span>
      <div className='flex gap-5 mt-1 shrink-0'>
        {images.map((image, i) => (
          <div key={group.items[i] ?? i} className='relative w-[35px] h-[35px]'>
            <Image
              src={image || '/images/placeholder.png'}
              alt={group.items[i]}
              fill
              unoptimized={image?.endsWith(".gif") ?? false}
              loading='lazy'
              className='object-contain'
            />
          </div>
        ))}
      </div>
    </div>
  )
}
