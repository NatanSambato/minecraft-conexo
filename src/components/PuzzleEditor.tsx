"use client";

import { useState } from "react";
import type { Group, Puzzle, RegistryRow } from "@/types";
import TileCard from "./TileCard";
import PuzzleForm from "@/components/PuzzleForm";
import SolvedGroup from "@/app/[date]/components/SolvedGroup";
import { Pencil } from "lucide-react";
import { getImage, getPageUrl } from "@/lib/registry";

function emptyGroups(): Group[] {
  return [
    { id: 1, color: "yellow", correlation: "", items: ["", "", "", ""] },
    { id: 2, color: "green", correlation: "", items: ["", "", "", ""] },
    { id: 3, color: "blue", correlation: "", items: ["", "", "", ""] },
    { id: 4, color: "purple", correlation: "", items: ["", "", "", ""] },
  ];
}

interface Props {
  mode?: "create" | "suggest";
  items: RegistryRow[];
  puzzles?: Puzzle[];
  onSave?: (puzzle: {
    id: number | null;
    date: string;
    author: string;
    notes?: string;
    groups: Group[];
  }) => void;
}

export default function PuzzleEditor({ mode, items, puzzles, onSave }: Props) {
  const [groups, setGroups] = useState<Group[]>(emptyGroups());
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("");
  const [notes, setNotes] = useState("");
  const [id, setId] = useState<number | null>(null);

  const updateCorrelation = (gi: number, value: string) =>
    setGroups((prev) =>
      prev.map((g, i) => (i === gi ? { ...g, correlation: value } : g)),
    );

  const updateItem = (gi: number, ii: number, value: string) =>
    setGroups((prev) =>
      prev.map((g, i) => {
        if (i !== gi) return g;
        const next = [...g.items];
        next[ii] = value;
        return { ...g, items: next };
      }),
    );

  function handleReorderGroups(newGroups: Group[]) {
    setGroups(newGroups);
  }

  const handleReorderItems = (gi: number, newItems: string[]) => {
    setGroups((prev) =>
      prev.map((g, i) => (i === gi ? { ...g, items: newItems } : g)),
    );
  };

  const handleSave = () => onSave?.({ id, date, author, notes, groups });

  const handleImport = (json: string) => {
    try {
      const parsed = JSON.parse(json);

      if (Array.isArray(parsed)) {
        setGroups(parsed);
      } else {
        setGroups(parsed.groups ?? []);
        setAuthor(parsed.author ?? "");
        setDate(parsed.date ?? "");
        setNotes(parsed.notes ?? "");
        setId(parsed.id ?? null);
      }
    } catch {
      alert("Invalid JSON");
    }
  };

  return (
    <div className="flex items-start justify-center gap-10 w-full max-w-7xl mx-auto">
      {/* Form */}
      <PuzzleForm
        mode={mode}
        groups={groups}
        items={items}
        puzzles={puzzles}
        date={date}
        author={author}
        notes={notes}
        id={id}
        onUpdateCorrelation={updateCorrelation}
        onUpdateItem={updateItem}
        onReorderGroups={handleReorderGroups}
        onReorderItems={handleReorderItems}
        onDateChange={setDate}
        onAuthorChange={setAuthor}
        onNotesChange={setNotes}
        onIdChange={setId}
        onSave={handleSave}
        onSubmit={handleImport}
      />

      <div className="flex flex-col gap-5 w-full max-w-xl">
        {/* Tile Grid - Preview */}
        <div className="grid grid-cols-4 gap-2 w-full max-w-xl">
          {groups.flatMap((g) =>
            g.items.map((label, i) => {
              const url = getPageUrl(label);
              const image = getImage(label);

              return url ? (
                <a
                  key={`${g.id}-${i}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TileCard label={label} image={image} />
                </a>
              ) : (
                <TileCard
                  key={`${g.id}-${i}`}
                  label={label}
                  image={image}
                  disabled
                />
              );
            }),
          )}
        </div>

        {/* Lifetime puzzle groups */}
        {mode === "create" && puzzles && (
          <div className="flex flex-col gap-2 w-full">
            {puzzles.map((puzzle) => (
              <div
                key={puzzle.id}
                className="flex items-center justify-center align-middle gap-2 relative"
              >
                <div className="absolute -left-7 flex flex-col items-center gap-0.5">
                  <span className="text-[8px] shrink-0 text-gray-400">
                    {puzzle.date.slice(5)}
                  </span>
                  <button
                    type="button"
                    title="Edit puzzle"
                    onClick={() => {
                      handleImport(JSON.stringify(puzzle));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="cursor-pointer hover:opacity-80"
                  >
                    <Pencil size={10} />
                  </button>
                </div>

                {puzzle.groups.map((group, gi) => (
                  <div key={`${puzzle.id}-${gi}`} className="flex-1 min-w-0">
                    <SolvedGroup group={group} compact />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
