import { Group, Puzzle, RegistryRow } from "@/types";
import { ItemSearch } from "@/components/ItemSearch";
import { getGroupColor } from "@/lib/gameUtils";
import { ClipboardPaste, Grip, GripVertical } from "lucide-react";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const GROUP_COLORS = ["yellow", "green", "blue", "purple"] as const;

interface PuzzleFormProp {
  mode?: "create" | "suggest";
  groups: Group[];
  items: RegistryRow[];
  puzzles?: Puzzle[];
  date: string;
  author?: string;
  notes?: string;
  id?: number | null;
  onUpdateCorrelation: (gi: number, v: string) => void;
  onUpdateItem: (gi: number, ii: number, v: string) => void;
  onReorderGroups: (newGroups: Group[]) => void;
  onReorderItems: (gi: number, newItems: string[]) => void;
  onDateChange: (v: string) => void;
  onAuthorChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  onIdChange: (v: number | null) => void;
  onSave: () => void;
  onSubmit: (puzzle: string) => void;
}

interface SortableGroupProps {
  group: Group;
  gi: number;
  items: RegistryRow[];
  onUpdateCorrelation: (gi: number, v: string) => void;
  onUpdateItem: (gi: number, ii: number, v: string) => void;
  onReorderItems: (gi: number, v: string[]) => void;
}

interface SortableItemProps {
  id: number;
  ii: number;
  gi: number;
  item: string;
  items: RegistryRow[];
  onUpdateItem: (gi: number, ii: number, v: string) => void;
}

// ─── Sortable item card ──────────────────────────────────────────────────────

function SortableItemCard({
  id,
  ii,
  gi,
  item,
  items,
  onUpdateItem,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 w-full"
    >
      <ItemSearch
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
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none text-white-70 hover:text-white"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>
    </div>
  );
}

// ─── Sortable group card ──────────────────────────────────────────────────────

function SortableGroupCard({
  group,
  gi,
  items,
  onUpdateCorrelation,
  onUpdateItem,
  onReorderItems,
}: SortableGroupProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const sensors = useSensors(useSensor(PointerSensor));

  function handleItemDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = active.id as number;
    const newIndex = over.id as number;

    const reordered = arrayMove(group.items, oldIndex, newIndex);
    onReorderItems(gi, reordered);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-2 p-4 rounded-lg ${getGroupColor(group.color)}`}
    >
      {/* Correlation input */}
      <div className="flex items-center justify-center gap-2">
        <input
          className="w-full bg-stone-900 rounded px-2 py-1 font-bold"
          placeholder={`Group ${gi + 1}`}
          value={group.correlation}
          onChange={(e) => onUpdateCorrelation(gi, e.target.value)}
        />
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none text-white-70 hover:text-white"
          aria-label="Drag to reorder"
        >
          <Grip size={18} />
        </button>
      </div>

      {/* Item input */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleItemDragEnd}
      >
        <SortableContext
          items={group.items.map((_, i) => i)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-4">
            {group.items.map((item, ii) => (
              <SortableItemCard
                key={ii}
                id={ii}
                ii={ii}
                gi={gi}
                item={item}
                items={items}
                onUpdateItem={onUpdateItem}
              ></SortableItemCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function PuzzleForm({
  mode,
  groups,
  items,
  puzzles,
  date,
  author,
  notes,
  id,
  onUpdateCorrelation,
  onUpdateItem,
  onReorderGroups,
  onReorderItems,
  onDateChange,
  onAuthorChange,
  onNotesChange,
  onIdChange,
  onSave,
  onSubmit,
}: PuzzleFormProp) {
  const inputStyle: string = "bg-stone-900 px-2 py-1 font-bold rounded";

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = groups.findIndex((g) => g.id === active.id);
    const newIndex = groups.findIndex((g) => g.id === over.id);

    const reordered = arrayMove(groups, oldIndex, newIndex).map((g, i) => ({
      ...g,
      id: i + 1,
      color: GROUP_COLORS[i],
    }));

    onReorderGroups(reordered);
  }

  const puzzleExists = puzzles && puzzles.some((p) => p.date === date);
  const idExists = puzzles && puzzles.some((p) => p.id === id);

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
          <div>
            {puzzleExists && (
              <span className="absolute pl-0.5 -top-5 text-sm text-red-400">
                Editing Puzzle
              </span>
            )}
            <input
              type="date"
              value={date}
              className={`${puzzleExists ? "text-red-400" : ""}`}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
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
            className={`${idExists ? "text-red-400" : ""}`}
            onChange={(e) =>
              onIdChange(e.target.value ? Number(e.target.value) : null)
            }
          />
        )}
      </div>

      {/* Groups input */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={groups.map((g) => g.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-4">
            {groups.map((group, gi) => (
              <SortableGroupCard
                key={group.id}
                group={group}
                gi={gi}
                items={items}
                onUpdateCorrelation={onUpdateCorrelation}
                onUpdateItem={onUpdateItem}
                onReorderItems={onReorderItems}
              ></SortableGroupCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Notes input */}
      <textarea
        value={notes}
        placeholder="Notes..."
        className={`${inputStyle}`}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={4}
      />

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
