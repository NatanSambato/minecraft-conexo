"use client";

import { RegistryRow } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const CHUNK_SIZE = 50;

type SortKey = "name" | "pt" | "es" | "image";
type Filter = "all" | "missingPt" | "missingEs" | "missingImage" | "manual";

export default function RegistryTable({ items }: { items: RegistryRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const filterSignature = `${filter}|${search}|${sortKey}|${sortAsc}`;
  const [prevSignature, setPrevSignature] = useState(filterSignature);
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const sentinelRef = useRef<HTMLTableRowElement>(null);

  const filtered = useMemo(() => {
    let rows = items;

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    }

    switch (filter) {
      case "missingPt":
        rows = rows.filter((r) => !r.pt);
        break;
      case "missingEs":
        rows = rows.filter((r) => !r.es);
        break;
      case "missingImage":
        rows = rows.filter((r) => !r.image);
        break;
      case "manual":
        rows = rows.filter((r) => r._manual);
        break;
    }

    rows = [...rows].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return rows;
  }, [items, filter, sortKey, sortAsc, search]);

  if (prevSignature !== filterSignature) {
    setPrevSignature(filterSignature);
    setVisibleCount(CHUNK_SIZE);
  }

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Grow visibleCount when the sentinel row scrolls into view
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => c + CHUNK_SIZE);
        }
      },
      { rootMargin: "200px" } // start loading a bit before it's fully on-screen
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc((a) => !a);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const counts = useMemo(
    () => ({
      total: items.length,
      missingPt: items.filter((r) => !r.pt).length,
      missingEs: items.filter((r) => !r.es).length,
      missingImage: items.filter((r) => !r.image).length,
      manual: items.filter((r) => r._manual).length,
    }),
    [items]
  );

  const filterOptions: [Filter, string][] = [
    ["all", `All (${counts.total})`],
    ["manual", `Manual (${counts.manual})`],
    ["missingPt", `Missing PT (${counts.missingPt})`],
    ["missingEs", `Missing ES (${counts.missingEs})`],
    ["missingImage", `Missing Image (${counts.missingImage})`],
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 items-center text-sm">
        <div className="relative inline-block">
          <input
            placeholder="Search entry…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 pr-12 w-56"
          />
          {search !== null && (
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              ({filtered.length})
            </span>
          )}          
        </div>
        {filterOptions.map(([key, label]) => {
          const selected = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded border cursor-pointer transition-colors ${
                selected
                  ? "bg-gray-700 text-white border-black hover:cursor-default"
                  : "bg-white text-black border-gray-300 hover:opacity-80"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <table className="w-full border-collapse text-sm table-fixed">
        <colgroup>
          <col className="w-[40%]" />
          <col className="w-[25%]" />
          <col className="w-[25%]" />
          <col className="w-[10%]" />
        </colgroup>
        <thead>
          <tr className="border-b">
            {(["name", "pt", "es", "image"] as SortKey[]).map((key) => (
              <th
                key={key}
                onClick={() => toggleSort(key)}
                className='text-left p-2 cursor-pointer select-none'
              >
                {key.toUpperCase()} {sortKey === key ? (sortAsc ? "▲" : "▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((row) => (
            <tr key={row.name} className="border-b">
              <td className="p-2">
                {row.url ? (
                  <Link href={row.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {row.name}
                  </Link>
                ) : (
                  row.name
                )}
              </td>
              <td className={`p-2 ${!row.pt ? "text-red-500" : ""}`}>
                {row.pt ?? <span className="inline-block translate-x-0.5">—</span>}
                </td>
              <td className={`p-2 ${!row.es ? "text-red-500" : ""}`}>
                {row.es ?? <span className="inline-block translate-x-0.5">—</span>}
              </td>
              <td className="p-2">
                {row.image ? (
                  <Image
                    src={row.image}
                    alt={row.name}
                    width={32}
                    height={32}
                    onClick={() => setLightboxSrc(row.image)}
                    unoptimized={row.image.endsWith(".gif") ?? false}
                    className="h-8 w-8 object-contain hover:cursor-pointer translate-x-1"
                  />
                ) : (
                  <span className="text-red-500 inline-block translate-x-3.5">—</span> 
                )}
              </td>
            </tr>
          ))}
          {hasMore && (
            <tr ref={sentinelRef}>
              <td colSpan={4} className="p-4 text-center text-gray-400">
                Loading more…
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {lightboxSrc && (
        <div
          onClick={() => setLightboxSrc(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-zoom-out"
        >
          <div className="relative h-[60vh] w-[60vw]">
            <Image
              src={lightboxSrc}
              alt=""
              fill
              sizes="90vw"
              unoptimized={lightboxSrc?.endsWith(".gif") ?? false}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}