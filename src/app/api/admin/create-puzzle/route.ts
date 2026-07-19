import { Puzzle } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from 'fs/promises';
import { getAllPuzzles, getPuzzleByDate, PUZZLES_DIR } from "@/lib/puzzles";

type Body = Omit<Puzzle, 'id' | 'author'> & { id?: number, author?: string }

export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
            { error: "Creating puzzles is only available in development" }, { status: 403 });
    }

    let body;
    try {
        body = await req.json() as Body;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
    }

    if (!body.groups || body.groups.length !== 4) {
        return NextResponse.json({ error: "Invalid puzzle groups" }, { status: 400 })
    }

    if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
        return NextResponse.json({ error: "Invalid puzzle date" }, { status: 400 })
    }

    if (getPuzzleByDate(body.date)) {
        return NextResponse.json({ error: "Duplicate puzzle date" }, { status: 400 })
    }

    const puzzles = getAllPuzzles();
    const highestId = Math.max(...puzzles.map(p => p.id))

    const puzzle: Puzzle = {
        id: body.id ?? highestId + 1,
        date: body.date,
        author: body.author || "Natowski",
        groups: body.groups,
    }

    console.log(body)

    const puzzlePath = path.join(PUZZLES_DIR, `${puzzle.date}.json`)
    await fs.writeFile(puzzlePath, JSON.stringify(puzzle, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
}