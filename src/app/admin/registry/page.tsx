import { loadRegistry, getAllItems } from "@/lib/registry";
import RegistryTable from "./components/RegistryTable";

export const dynamic = "force-dynamic";

export default async function RegistryAdminPage() {
  await loadRegistry();
  const items = getAllItems();

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Registry Audit</h1>
      <RegistryTable items={items} />
    </main>
  );
}
