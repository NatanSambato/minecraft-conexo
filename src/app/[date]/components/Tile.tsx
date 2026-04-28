'use client'

import useGameStore from '@/store/gameStore'
import type { Tile } from '@/types'

interface TileProps {
  tile: Tile
  disabled?: boolean
}

export default function Tile({ tile, disabled }: TileProps) {
    const selected = useGameStore((state) => state.selected)
    const toggleTile = useGameStore((state) => state.toggleTile)

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
            h-16 flex items-center justify-center rounded-sm p-4 text-center text-lg leading-5 font-bold uppercase
            ${isSelected ? 'bg-orange-300' : 'bg-stone-600'}
            ${disabled   ? 'opacity-50' : 'cursor-pointer'}
        `}
    >
        {tile.label}
    </button>
  )
}
