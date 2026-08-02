"use client";

import PuzzleEditor from "@/components/PuzzleEditor";
import { Puzzle, RegistryRow } from "@/types";

interface Prop {
  items: RegistryRow[];
  puzzles: Puzzle[];
}

export default function CreateClient({ items, puzzles }: Prop) {
  return (
    <PuzzleEditor
      mode="create"
      items={items}
      puzzles={puzzles}
      onSave={async ({ id, date, author, groups, oldDate }) => {
        const body = oldDate
          ? { action: "update", oldDate, entry: { id, date, author, groups } }
          : { action: "create", entry: { id, date, author, groups } };

        const res = await fetch("/api/admin/create-puzzle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) alert("Saved!");
        else alert("Error saving puzzle");
      }}
    />
  );
}
