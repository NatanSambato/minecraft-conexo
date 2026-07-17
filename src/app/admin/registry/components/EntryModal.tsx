"use client";

import type { EntryFields } from "../../../api/admin/registry/route";
import { useState } from "react";
import { RegistryRow } from "@/types";

type Mode = "add" | "copy" | "edit";

interface Props {
  mode: Mode;
  initial: EntryFields;
  onClose: () => void;
  onSuccess: () => void;
}

const TITLES: Record<Mode, string> = {
  add: "Add Entry",
  copy: "Copy Entry",
  edit: "Edit Entry",
};

const EMPTY: EntryFields = { name: "", pt: "", es: "", image: "", pageUrl: "" };

export default function EntryModal({
  mode,
  initial,
  onClose,
  onSuccess,
}: Props) {
  const [fields, setFields] = useState<EntryFields>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof EntryFields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!fields.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const body =
        mode === "edit"
          ? { action: "update", oldName: initial.name, entry: fields }
          : { action: "create", entry: fields };

      const res = await fetch("/api/admin/registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed.");

      onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black-60 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-[#1a1f2e] p-6 max-w-md w-full mx-4 flex flex-col gap-4 rounded-lg border-2"
        onClick={(e) => e.stopPropagation}
      >
        {/* Mode title */}
        <h2 className="font-black text-lg tracking-widest">{TITLES[mode]}</h2>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 border border-red-300 bg-red-50 rounded px-3 py-2">
            {error}
          </p>
        )}

        {/* Form fields */}
        {(
          [
            ["name", "Name (registry key)"],
            ["pt", "PT"],
            ["es", "ES"],
            ["image", "Image URL"],
            ["pageUrl", "Page URL"],
          ] as [keyof EntryFields, string][]
        ).map(([field, label]) => (
          <div key={field} className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <input
              value={fields[field]}
              onChange={(e) => update(field, e.target.value)}
              className={`border rounded px-2 py-1 text-sm
                ${field === "name" && mode === "copy" && initial.name === fields.name ? "text-red-400" : ""}
              `}
              placeholder={label}
            />
          </div>
        ))}

        {/* Buttons */}
        <div className="flex gap-4 mt-2 justify-center">
          <button
            type="button"
            onClick={onClose}
            className="p-2 border rounded bg-red-500 cursor-pointer hover:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="p-2 px-4 border rounded bg-green-500 cursor-pointer hover:opacity-70"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function initialForAdd(): EntryFields {
  return { ...EMPTY };
}

export function initialForCopy(row: RegistryRow): EntryFields {
  return {
    name: row.name,
    pt: row.pt ?? "",
    es: row.es ?? "",
    image: row.image ?? "",
    pageUrl: row.url ?? "",
  };
}

export function initialForEdit(row: RegistryRow): EntryFields {
  return {
    name: row.name,
    pt: row.pt ?? "",
    es: row.es ?? "",
    image: row.image ?? "",
    pageUrl: row.url ?? "",
  };
}
