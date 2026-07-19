import Header from "@/components/Header";
import PuzzleEditor from "@/components/PuzzleEditor";
import { getAllItems, loadRegistry } from "@/lib/registry";
import { notFound } from "next/navigation";

export default async function CreatePage() {
  if (process.env.NODE_ENV !== "development") notFound();
  await loadRegistry();
  const items = getAllItems();

  return (
    <div>
      <Header returnLink="/" />
      <div className="flex justify-center">
        <PuzzleEditor items={items} />
      </div>
    </div>
  );
}
