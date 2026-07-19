"use client";

import { useMemo, useState } from "react";
import type { Group, RegistryRow } from "@/types";
import TileCard from "./TileCard";
import PuzzleForm from "@/app/admin/create/components/PuzzleForm";

function emptyGroups(): Group[] {
  return [
    { id: 1, color: "yellow", correlation: "", items: ["", "", "", ""] },
    { id: 2, color: "green", correlation: "", items: ["", "", "", ""] },
    { id: 3, color: "blue", correlation: "", items: ["", "", "", ""] },
    { id: 4, color: "purple", correlation: "", items: ["", "", "", ""] },
  ];
}

export default function PuzzleEditor({ items }: { items: RegistryRow[] }) {
  const [groups, setGroups] = useState<Group[]>(emptyGroups());
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("");
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

  const imageMap = useMemo(
    () => new Map(items.map((item) => [item.name, item.image])),
    [items],
  );

  const previewTiles = groups.flatMap((g) =>
    g.items.map((label) => ({
      label,
      image: label ? (imageMap.get(label) ?? null) : null,
      color: g.color,
    })),
  );

  const handleSave = async () => {
    const res = await fetch("/api/admin/create-puzzle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, date, author, groups }),
    });

    if (res.ok) alert("Saved!");
    else alert("Error saving puzzle");
  };

  return (
    <div className="flex items-start justify-center gap-10 w-full max-w-7xl mx-auto">
      {/* Form */}
      <PuzzleForm
        groups={groups}
        items={items}
        date={date}
        author={author}
        id={id}
        onUpdateCorrelation={updateCorrelation}
        onUpdateItem={updateItem}
        onDateChange={setDate}
        onAuthorChange={setAuthor}
        onIdChange={setId}
        onSave={handleSave}
      />

      {/* Tile Grid - Preview */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-xl">
        {previewTiles.map((tile, i) => (
          <TileCard key={i} label={tile.label} image={tile.image} disabled />
        ))}
      </div>
    </div>
  );
}
