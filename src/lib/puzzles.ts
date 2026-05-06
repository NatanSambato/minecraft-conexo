import path from "path"
import fs from "fs" 

const PUZZLES_DIR = path.join(process.cwd(), 'src', 'app', 'data', 'puzzles')

export function getAllPuzzles() {
    const files = fs.readdirSync(PUZZLES_DIR)
        .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))

    const puzzles = files.map(f => {
        const content = JSON.parse(fs.readFileSync(path.join(PUZZLES_DIR, f), 'utf-8'))
        return content
    })

    const ids = puzzles.map(p => p.id)
    const uniqueIds = new Set(ids)
    if (uniqueIds.size !== ids.length) {
        const duplicate = ids.find((id, i) => ids.indexOf(id) !== i)
        throw new Error(`Duplicate puzzle ID detected: ${duplicate}`)
    }

    return puzzles.sort((a, b) => a.date.localeCompare(b.date))
}

export function getPuzzleByDate(date: string) {
    const filePath = path.join(PUZZLES_DIR, `${date}.json`)
    if (!fs.existsSync(filePath)) return null
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}