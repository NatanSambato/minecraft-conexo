import Header from "@/components/Header";
import { getAllItems, loadRegistry } from "@/lib/registry";
import { notFound } from "next/navigation";
import CreateClient from "./components/CreateClient";
import { getAllPuzzles } from "@/lib/puzzles";

export default async function CreatePage() {
  if (process.env.NODE_ENV !== "development") notFound();
  await loadRegistry();
  const items = getAllItems();
  const puzzles = getAllPuzzles();

  return (
    <div>
      <Header returnLink="/" />
      <div className="flex justify-center">
        <CreateClient items={items} puzzles={puzzles} />
      </div>
    </div>
  );
}
