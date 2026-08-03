import { Puzzle } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises';
import { getAllPuzzles, getPuzzleByDate, getPuzzlePath } from "@/lib/puzzles";

type PuzzleFields = Omit<Puzzle, 'id' | 'author'> & { id?: number, author?: string }

type Payload =
    | { action: "create"; entry: PuzzleFields }
    | { action: "update"; oldDate: string; entry: PuzzleFields }
    | { action: "delete"; date: string }

function validateEntry(entry: PuzzleFields): string | null {
    if (!entry.date || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) return "Invalid puzzle date"
    if (!entry.groups || entry.groups.length !== 4) return "Invalid puzzle groups"
    return null
}

export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
            { error: "Creating puzzles is only available in development" }, { status: 403 });
    }

    let payload: Payload;
    try {
        payload = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
    }

    switch (payload.action) {
        case "create": {
            const { entry } = payload;
            const error = validateEntry(entry)
            if (error) return NextResponse.json({ error }, { status: 400 })
            if (getPuzzleByDate(entry.date)) {
                return NextResponse.json({ error: `"${entry.date}" already exists.` }, { status: 409 })
            }
            return await writePuzzle(entry);
        }

        case "update": {
            const { oldDate, entry } = payload;
            const error = validateEntry(entry)
            if (error) return NextResponse.json({ error }, { status: 400 })
            if (oldDate !== entry.date) {
                if (getPuzzleByDate(entry.date)) {
                    return NextResponse.json({ error: `"${entry.date}" already exists.` }, { status: 409 })
                }

                await fs.unlink(getPuzzlePath(oldDate)).catch(() => { })
            }
            return await writePuzzle(entry)
        }

        case "delete": {
            try {
                await fs.unlink(getPuzzlePath(payload.date))
                return NextResponse.json({ ok: true })
            } catch {
                return NextResponse.json({ error: `"${payload.date}" not found.` }, { status: 404 },);
            }
        }
    }
}

async function writePuzzle(entry: PuzzleFields) {
    const puzzles = getAllPuzzles()
    const highestId = Math.max(...puzzles.map(p => p.id))

    const puzzle: Puzzle = {
        id: entry.id ?? highestId + 1,
        date: entry.date,
        author: entry.author || "Natowski",
        groups: entry.groups,
    }

    await fs.writeFile(getPuzzlePath(puzzle.date), JSON.stringify(puzzle, null, 2), "utf-8")
    return NextResponse.json({ ok: true })
}