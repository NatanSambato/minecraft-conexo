'use client'

import { getGroupHex } from '@/lib/gameUtils'
import useGameStore from '@/store/gameStore'
import type { Tile } from '@/types'
import { getImage } from '@/lib/registry';
import TileCard from '@/components/TileCard';

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

    return (
        <TileCard
            label={tile.label}
            image={image}
            isSelected={isSelected}
            isHinted={isHinted}
            groupHex={groupHex}
            disabled={disabled}
            onClick={handleClick}
        />
    )
}
