import TileImage from "@/components/TileImage";
import Tooltip from "@/components/Tooltip";
import { useTooltip } from "@/hooks/useTooltip";

export function SolvedGroupItem({
  image,
  label,
  size = 35,
}: {
  image: string | null;
  label: string;
  size?: number;
}) {
  const { visible, position, handlers } = useTooltip();

  return (
    <div
      {...handlers}
      style={{ width: size, height: size }}
      className="relative overflow-visible"
    >
      <TileImage
        image={image}
        label={label}
        loading="lazy"
        sizes={`${size}px`}
        compact
      />
      <Tooltip x={position.x} y={position.y} label={label} visible={visible} />
    </div>
  );
}
