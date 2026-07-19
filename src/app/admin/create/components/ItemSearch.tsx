"use client";

import { RegistryRow } from "@/types";
import Image from "next/image";
import { useMemo, useState } from "react";

interface ItemSearchProp {
  value: string;
  onChange: (v: string) => void;
  items: RegistryRow[];
  ii: number;
}

export function ItemSearch({ value, onChange, items, ii }: ItemSearchProp) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      query.length < 1
        ? []
        : items
            .filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 20),
    [query, items],
  );

  return (
    <div className="relative">
      {/* Input field */}
      <input
        className="w-full bg-stone-900 rounded px-2 py-1 text-sm"
        value={query}
        placeholder={`Item ${ii + 1}`}
        onChange={(e) => {
          const value = e.target.value;

          setQuery(value);
          setOpen(true);
          onChange(value);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {/* Registry dropdown */}
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-gray-800 border border-stone-800 rounded mt-1 max-h-48 overflow-y-auto">
          {filtered.map((item) => (
            <li
              key={item.name}
              className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 transition-colors cursor-pointer text-sm"
              onMouseDown={() => {
                onChange(item.name);
                setQuery(item.name);
                setOpen(false);
              }}
            >
              {item.image ? (
                <div className="relative w-6 h-6 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <span className="text-red-500 px-2">X</span>
              )}
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
