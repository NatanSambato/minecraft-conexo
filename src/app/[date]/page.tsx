import { notFound } from "next/navigation";
import { getPuzzleByDate } from "@/lib/puzzles";
import { getTodaysDate } from "@/lib/gameUtils";
import type { Metadata } from "next";
import Board from "./components/Board";

type Props = {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ key?: string }>;
};

function resolvePuzzle(date: string, key?: string) {
  const puzzle = getPuzzleByDate(date);
  if (!puzzle || !puzzle.groups) return null;

  const isFutureDate = date > getTodaysDate();
  const validKey =
    key !== undefined && decodeURIComponent(key) === process.env.PREVIEW_KEY;
  const accessible =
    !isFutureDate ||
    validKey ||
    process.env.NEXT_PUBLIC_SHOW_UNRELEASED_PUZZLES === "true";

  return accessible ? puzzle : null;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { date } = await params;
  const { key } = await searchParams;
  const puzzle = resolvePuzzle(date, key);

  if (!puzzle) return { title: "Puzzle not found" };

  return {
    title: `Minecraft Conexo — ${date}`,
    description: `Play the ${date} Minecraft Conexo puzzle. Find the 4 hidden groups of 4.`,
  };
}

export default async function GamePage({ params, searchParams }: Props) {
  const { date } = await params;
  const { key } = await searchParams;
  const puzzle = resolvePuzzle(date, key);

  if (!puzzle) notFound();

  return <Board puzzle={puzzle} />;
}
