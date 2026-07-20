"use client";

import { getTodaysDate } from "@/lib/gameUtils";
import Link from "next/link";

export default function page() {
  const today = getTodaysDate();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8">
      {/* Title */}
      <h1 className="font-black text-2xl uppercase tracking-wide">
        MINECRAFT CONEXO
      </h1>

      <div className="flex flex-col gap-4">
        {/* Daily game button */}
        <Link
          href={`/${today}`}
          className="px-6 py-3 bg-green-600 text-white text-center rounded"
        >
          Daily Game
        </Link>

        {/* Archive button */}
        <Link
          href="/archive"
          className="px-6 py-3 bg-gray-600 text-white text-center rounded"
        >
          Archive
        </Link>

        {/* Suggest button */}
        <div className="relative">
          <Link
            href="/suggest"
            className="px-6 py-3 bg-amber-800 text-white text-center rounded block"
          >
            Suggest Puzzle
          </Link>
          <span className="absolute -top-2 -right-2 tracking-widest text-yellow-300 text-xs font-black px-1 rotate-14">
            NEW
          </span>
        </div>

        {/* Dev buttons */}
        <div className="flex gap-2 pt-6">
          {/* Create button */}
          <Link
            href="/admin/create"
            className="px-6 py-3 bg-amber-500 text-white text-center rounded"
          >
            Create Puzzle
          </Link>
          {/* Registry button */}
          <Link
            href="/admin/registry"
            className="px-6 py-3 bg-red-600 text-white text-center rounded"
          >
            Registry
          </Link>
        </div>
      </div>
    </main>
  );
}
