'use client'

import { getGroupHex } from '@/lib/gameUtils'
import useGameStore from '@/store/gameStore'
import type { Tile } from '@/types'

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

    const handleClick = () => {
        if (disabled) return
        toggleTile(tile.id)
    }

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
        {isHinted && (
            <div
                className='absolute top-0 right-0 w-0 h-0'
                style={{
                    borderTop: `30px solid ${groupHex}`,
                    borderLeft: '30px solid transparent',
                }}
            />
        )}
        {tile.label}
    </button>
  )
}
