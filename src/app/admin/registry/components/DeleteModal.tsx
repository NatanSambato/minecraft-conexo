import React, { useState } from "react";

interface Props {
  name: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteModal({ name, onClose, onSuccess }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed.");

      onSuccess();
    } catch (err) {
      setError((err as Error).message);
      setDeleting(false);
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
        {/* Title */}
        <h2 className="font-black text-lg tracking-widest">Delete Entry</h2>

        <p className="">
          Are you sure you want to delete{" "}
          <span className="font-semibold underline">{name}</span> from the
          registry?
        </p>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 border border-red-300 bg-red-50 rounded px-3 py-2">
            {error}
          </p>
        )}

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
            disabled={deleting}
            onClick={handleDelete}
            className="p-2 px-4 border rounded bg-green-500 cursor-pointer hover:opacity-70"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
