import Header from "@/components/Header";
import { getAllItems, loadRegistry } from "@/lib/registry";
import SuggestClient from "./components/SuggestClient";

export default async function SuggestPage() {
  await loadRegistry();
  const items = getAllItems();
  return (
    <div>
      <Header returnLink="/" />
      <div className="flex justify-center">
        <SuggestClient items={items} />
      </div>
    </div>
  );
}
