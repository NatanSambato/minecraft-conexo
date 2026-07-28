import Board from "./components/Board";

import { notFound } from "next/navigation";
import { getPuzzleByDate } from "@/lib/puzzles";
import { getTodaysDate } from "@/lib/gameUtils";

export default async function GamePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const puzzle = getPuzzleByDate(date);

  if (!puzzle || !puzzle.groups) notFound();

  const today = getTodaysDate();
  if (
    date > today &&
    process.env.NEXT_PUBLIC_SHOW_UNRELEASED_PUZZLES !== "true"
  )
    notFound();

  return <Board puzzle={puzzle} />;
}
