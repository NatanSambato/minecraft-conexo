"use client";

import PuzzleEditor from "@/components/PuzzleEditor";
import { RegistryRow } from "@/types";

export default function SuggestClient({ items }: { items: RegistryRow[] }) {
  return (
    <PuzzleEditor
      mode="suggest"
      items={items}
      onSave={({ author, groups }) => {
        const form = new FormData();
        form.append("entry.1759404553", JSON.stringify({ author, groups }));
        fetch(
          "https://docs.google.com/forms/d/e/1FAIpQLScC1ApKFLM8CTWbz5NX4K7_81Ybo7EcEap5PSkuY0IVnuXfSA/formResponse",
          {
            method: "POST",
            body: form,
            mode: "no-cors",
          },
        );
        alert("Suggestion submitted!");
      }}
    />
  );
}
