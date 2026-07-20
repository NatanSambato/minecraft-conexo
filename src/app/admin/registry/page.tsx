import { loadRegistry, getAllItems } from "@/lib/registry";
import RegistryTable from "./components/RegistryTable";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

export default async function RegistryAdminPage() {
  await loadRegistry();
  const items = getAllItems();

  return (
    <main className="max-w-5xl mx-auto">
      <Header returnLink="/" />
      <h1 className="text-xl font-semibold p-2">Registry Audit</h1>
      <RegistryTable items={items} />
    </main>
  );
}
