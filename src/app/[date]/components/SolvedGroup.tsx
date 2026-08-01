import { getGroupColor } from "@/lib/gameUtils";
import { getImage } from "@/lib/registry";
import type { Group } from "@/types";
import { SolvedGroupItem } from "./SolvedGroupItem";
import { memo } from "react";

export default memo(function SolvedGroup({
  group,
  compact,
}: {
  group: Group;
  compact?: boolean;
}) {
  const bgColor = getGroupColor(group.color);
  const images = group.items.map((item) => getImage(item));

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg ${bgColor}
        ${compact ? "p-0.5 px-1" : "p-1.5 h-20"}
      `}
    >
      <span
        className={`font-bold leading-tight truncate w-full block text-center ${compact ? "text-xs" : "text-base"}`}
        title={group.correlation}
      >
        {group.correlation}
      </span>
      <div
        className={`flex shrink-0 ${compact ? "gap-1 mt-0.5" : "gap-5 mt-1"}`}
      >
        {images.map((image, i) => (
          <SolvedGroupItem
            key={group.items[i] || i}
            image={image}
            label={group.items[i]}
            size={compact ? 27 : 35}
          />
        ))}
      </div>
    </div>
  );
});
