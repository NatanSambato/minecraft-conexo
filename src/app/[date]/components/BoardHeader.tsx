"use client";

import useGameStore from "@/store/gameStore";
import { Lightbulb } from "lucide-react";

export default function BoardHeader({ dateTitle }: { dateTitle: string }) {
  const attempts = useGameStore((state) => state.attempts);
  const hintsUsed = useGameStore((state) => state.hintsUsed);
  const canHint = useGameStore((state) => state.canHint());
  const activateHint = useGameStore((state) => state.activateHint);

  return (
    <div className="flex items-center justify-between mb-2 ml-1.5 w-full text-md">
      <div className="flex items-center gap-6">
        <span className="font-bold">{dateTitle}</span>

        <span>
          ATTEMPTS:
          <span className="font-bold"> {attempts}</span>
        </span>

        <span>
          HINTS:
          <span className=" font-bold"> {hintsUsed}</span>
        </span>
      </div>

      <button
        disabled={!canHint}
        onClick={activateHint}
        className="
          flex items-center gap-1 p-1.5 rounded-lg mr-3 cursor-pointer
          hover:bg-white/10 transition-colors 
          disabled:pointer-events-none disabled:opacity-40
        "
      >
        <Lightbulb size={22} />
        <span>Hint</span>
      </button>
    </div>
  );
}
