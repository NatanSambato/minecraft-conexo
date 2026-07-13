'use client'

import { getGroupHex } from '@/lib/gameUtils'
import useGameStore from '@/store/gameStore'
import type { Tile } from '@/types'
import { getImage } from '@/lib/registry';
import Image from 'next/image';
import { getEffectIcon } from '@/lib/effectIcons';

const getFontSize = (label: string) => {
    
    if (label.length > 14) return 'text-sm'
    return 'text-lg'
  }

interface TileProps {
  tile: Tile
  disabled?: boolean
}

export default function Tile({ tile, disabled }: TileProps) {
    const toggleTile = useGameStore((state) => state.toggleTile)
    const selected = useGameStore((state) => state.selected)
    const isHinted = useGameStore((state) => Object.values(state.hintedGroups).flat().includes(tile.id))
    const groupHex = useGameStore((state) => {
        const group = state.puzzle?.groups.find(g => g.id === tile.groupId)
        return group ? getGroupHex(group.color) : '#57534e'
    })

    const isSelected = selected.includes(tile.id)

    const image = getImage(tile.label)

    const handleClick = () => {
        if (disabled) return
        toggleTile(tile.id)
    }

    const isWaxed = tile.label.startsWith('Waxed ')
    const effectIcon = getEffectIcon(tile.label)
    const isArrow = tile.label.startsWith('Arrow of')

  return (
    <button
        onClick={handleClick}
        disabled={disabled}
        className={`
            relative h-20 flex items-center justify-center rounded-sm p-4 text-center ${getFontSize(tile.label)} leading-5 font-bold uppercase
            ${isSelected ? 'bg-amber-600' : 'bg-stone-600'}
            ${disabled   ? '' : 'cursor-pointer'}
        `}
    >
       <div className='absolute inset-1'>
            <Image
                src={image || '/images/placeholder.png '} 
                alt={tile.label}
                fill
                sizes="(max-width: 576px) 25vw, 144px"
                unoptimized={image?.endsWith(".gif") ?? false}
                className='object-contain'
            />

            {isWaxed && (
                <Image
                    src='/images/tile-overlays/wax-effect-overlay.png'
                    alt='waxed'
                    fill
                    className='object-contain pointer-events-none'
                />
            )}

            {effectIcon && (
                <div className={`absolute w-5 h-5 ${isArrow ? 'bottom-1.5 right-3.5' : 'top-1.5 right-3.5'}`}>
                    <Image
                        src={effectIcon}
                        alt=''
                        fill
                        className='object-contain pointer-events-none'
                    />
                </div>
            )}
       </div>

        {isHinted && (
            <div
                className='absolute top-0 right-0 w-0 h-0'
                style={{
                    borderTop: `30px solid ${groupHex}`,
                    borderLeft: '30px solid transparent',
                }}
            />
        )}
    </button>
  )
}
