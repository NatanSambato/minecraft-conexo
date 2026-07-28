import TileImage from "@/components/TileImage";
import Tooltip from "@/components/Tooltip";
import { useTooltip } from "@/hooks/useTooltip";
import { getPageUrl } from "@/lib/registry";

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
  const url = getPageUrl(label);

  return (
    <div
      {...handlers}
      style={{ width: size, height: size }}
      className="relative overflow-visible"
    >
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <TileImage
            image={image}
            label={label}
            loading="lazy"
            sizes={`${size}px`}
            compact
          />
        </a>
      ) : (
        <TileImage
          image={image}
          label={label}
          loading="lazy"
          sizes={`${size}px`}
          compact
        />
      )}

      <Tooltip x={position.x} y={position.y} label={label} visible={visible} />
    </div>
  );
}
