"use client";

import PuzzleEditor from "@/components/PuzzleEditor";
import { RegistryRow } from "@/types";

export default function CreateClient({ items }: { items: RegistryRow[] }) {
  return (
    <PuzzleEditor
      mode="create"
      items={items}
      onSave={async ({ id, date, author, groups }) => {
        const res = await fetch("/api/admin/create-puzzle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, date, author, groups }),
        });
        if (res.ok) alert("Saved!");
        else alert("Error saving puzzle");
      }}
    />
  );
}
