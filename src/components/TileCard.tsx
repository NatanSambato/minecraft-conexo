import TileImage from "./TileImage";

interface Props {
  label: string;
  image: string | null;
  isSelected?: boolean;
  isHinted?: boolean;
  groupHex?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function TileCard({
  label,
  image,
  isSelected,
  isHinted,
  groupHex,
  disabled,
  onClick,
}: Props) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      disabled={disabled}
      className={`
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
