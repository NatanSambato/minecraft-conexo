import TileImage from "@/components/TileImage";

export function SolvedGroupItem({
  image,
  label,
  size = 35,
}: {
  image: string | null;
  label: string;
  size?: number;
}) {
  return (
    <div
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
    </div>
  );
}
