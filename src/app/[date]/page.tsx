import Board from './components/Board'

import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { getTodaysDate } from '@/lib/gameUtils'

export default async function GamePage({ params }: { params: Promise<{ date: string }> }) {
    const { date } = await params
    const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'puzzles', `${date}.json`)

    if (!fs.existsSync(filePath)) {
        console.log("File does not exist")
        notFound() 
    }
    if ((date) > getTodaysDate()) {
        console.log("That game is in the future")
        notFound()
    }
    const raw = fs.readFileSync(filePath, 'utf-8')
    let puzzle
    try {
        puzzle = JSON.parse(raw)
        if (!puzzle || !puzzle.groups) notFound()
    } catch { notFound() }
    
    return <Board puzzle={puzzle}/>
}
