import { Group, RegistryRow } from "@/types";
import { ItemSearch } from "@/components/ItemSearch";
import { getGroupColor } from "@/lib/gameUtils";
import { ClipboardPaste } from "lucide-react";

interface PuzzleFormProp {
  mode?: "create" | "suggest";
  groups: Group[];
  items: RegistryRow[];
  date: string;
  author?: string;
  id?: number | null;
  onUpdateCorrelation: (gi: number, v: string) => void;
  onUpdateItem: (gi: number, ii: number, v: string) => void;
  onDateChange: (v: string) => void;
  onAuthorChange: (v: string) => void;
  onIdChange: (v: number | null) => void;
  onSave: () => void;
  onSubmit: (puzzle: string) => void;
}

export default function PuzzleForm({
  mode,
  groups,
  items,
  date,
  author,
  id,
  onUpdateCorrelation,
  onUpdateItem,
  onDateChange,
  onAuthorChange,
  onIdChange,
  onSave,
  onSubmit,
}: PuzzleFormProp) {
  const inputStyle: string = "bg-stone-900 px-2 py-1 font-bold rounded";

  return (
    <div className="flex flex-col gap-4 w-96 relative">
      {/* Import button */}
      {mode === "create" && (
        <button
          type="button"
          title="Import from clipboard"
          onClick={async () => {
            const text = await navigator.clipboard.readText();
            onSubmit(text);
          }}
          className="absolute -left-8 top-0 flex items-center justify-center p-1 rounded text-white bg-amber-500 hover:opacity-80 cursor-pointer"
        >
          <ClipboardPaste size={14} />
        </button>
      )}

      <div className={`${inputStyle} flex flex-col gap-2`}>
        {/* Data input */}
        {mode === "create" && (
          <input
            type="date"
            value={date}
            className=""
            onChange={(e) => onDateChange(e.target.value)}
          />
        )}

        {/* Author input */}
        <input
          value={author}
          placeholder="Author..."
          className=""
          onChange={(e) => onAuthorChange(e.target.value)}
        />

        {/* Id input */}
        {mode === "create" && (
          <input
            type="number"
            value={id ?? ""}
            placeholder="Id..."
            className=""
            onChange={(e) =>
              onIdChange(e.target.value ? Number(e.target.value) : null)
            }
          />
        )}
      </div>

      {/* Groups input */}
      {groups.map((group, gi) => (
        <div
          key={group.id}
          className={`flex flex-col gap-2 p-4 rounded-lg ${getGroupColor(group.color)}`}
        >
          <input
            className="w-full bg-stone-900 rounded px-2 py-1 font-bold"
            placeholder={`Group ${gi + 1}`}
            value={group.correlation}
            onChange={(e) => onUpdateCorrelation(gi, e.target.value)}
          />
          <div className="flex flex-col gap-1">
            {group.items.map((item, ii) => (
              <ItemSearch
                key={ii}
                value={item}
                onChange={(v) => {
                  const match = items.find(
                    (item) => item.name.toLowerCase() === v.toLowerCase(),
                  );

                  onUpdateItem(gi, ii, match ? match.name : v);
                }}
                items={items}
                ii={ii}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Save/Suggest button  */}
      <button
        onClick={onSave}
        className="px-4 py-2 bg-green-600 rounded font-bold hover:bg-green-500"
      >
        {mode === "create" ? "Save " : "Suggest "} Puzzle
      </button>
    </div>
  );
}
