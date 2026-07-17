import Board from "./components/Board";

import { notFound } from "next/navigation";
import { getPuzzleByDate } from "@/lib/puzzles";

export default async function GamePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const puzzle = getPuzzleByDate(date);

  if (!puzzle || !puzzle.groups) notFound();

  return <Board puzzle={puzzle} />;
}
