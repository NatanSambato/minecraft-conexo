import TileImage from "./TileImage";

interface Props {
  label: string;
  image: string | null;
  isSelected?: boolean;
  isHinted?: boolean;
  groupHex?: string;
  disabled?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
}

export default function TileCard({
  label,
  image,
  isSelected,
  isHinted,
  groupHex,
  disabled,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
}: Props) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
      disabled={disabled}
      className={`group
                relative h-20 flex items-center justify-center rounded-sm text-center leading-5 font-bold uppercase
                ${isSelected ? "bg-amber-600" : "bg-stone-600"}
                ${disabled ? "" : "cursor-pointer"}
            `}
    >
      <TileImage
        image={image}
        label={label}
        loading="eager"
        sizes="(max-width: 576px) 25vw, 144px"
      />

      {/* Hint Overlay*/}
      {isHinted && (
        <div
          className="absolute top-0 right-0 w-0 h-0"
          style={{
            borderTop: `30px solid ${groupHex}`,
            borderLeft: "30px solid transparent",
          }}
        />
      )}
    </Tag>
  );
}
