'use client'

import useGameStore from '@/store/gameStore'
import { Puzzle } from '@/types'
import { useEffect } from 'react'
import SolvedGroup from './SolvedGroup'
import Tile from './Tile'
import BoardHeader from './BoardHeader';
import Header from '@/components/Header'

export default function Board({ puzzle }: { puzzle: Puzzle }) {
    const tiles = useGameStore((state) => state.tiles)
    const solvedGroups = useGameStore((state) => state.solvedGroups)

    const solvedTiles = solvedGroups.flatMap(g =>
        tiles.filter(t => t.groupId === g.id).map(t => t.id)
    )

    const remainingTiles = tiles.filter(t => !solvedTiles.includes(t.id))

    useEffect(() => {
        useGameStore.getState().initGame(puzzle)
    }, [puzzle])

  return (
    <div className='flex flex-col items-center'>
        <div className='flex flex-col gap-2 w-full max-w-xl'>
            <Header />

            <BoardHeader dateTitle={puzzle.date} /> 

            {solvedGroups.map(group => (
                <SolvedGroup key={group.id} group={group}/>
            ))}
        
            <div className='grid grid-cols-4 gap-2'>
                {remainingTiles.map(tile => (
                    <Tile
                        key={tile.id}
                        tile={tile}
                        disabled={solvedGroups.some(g => g.id === tile.groupId)}
                    />
                ))}
            </div>
        </div>
    </div>
  )
}
