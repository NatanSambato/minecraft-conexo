import Board from "./components/Board";

import { notFound } from "next/navigation";
import { getPuzzleByDate } from "@/lib/puzzles";
import { getTodaysDate } from "@/lib/gameUtils";

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { date } = await params;
  const { key } = await searchParams;

  const puzzle = getPuzzleByDate(date);
  if (!puzzle || !puzzle.groups) notFound();

  const isFutureDate = date > getTodaysDate();
  const validKey = key === process.env.PREVIEW_KEY;

  if (
    isFutureDate &&
    !validKey &&
    process.env.NEXT_PUBLIC_SHOW_UNRELEASED_PUZZLES !== "true"
  )
    notFound();

  return <Board puzzle={puzzle} />;
}
