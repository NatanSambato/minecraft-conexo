import { getEffectIcon } from "@/lib/effectIcons";
import { isItemAnEnchantment } from "@/lib/enchantments";
import Image from "next/image";

interface Props {
  label: string;
  image: string | null;
  loading: "lazy" | "eager";
  sizes?: string;
  compact?: boolean;
}

export default function TileImage({
  label,
  image,
  loading,
  sizes,
  compact,
}: Props) {
  const isWaxed = label.startsWith("Waxed ");
  const effectIcon = getEffectIcon(label);
  const isArrow = label.startsWith("Arrow of");
  const isEnchantment = isItemAnEnchantment(label);

  const getFontSize = (label: string) => {
    if (label.length > 24) return compact ? "text-[8px]" : "text-xs";
    if (label.length > 14) return compact ? "text-[10px]" : "text-sm";
    if (label.length > 8) return compact ? "text-[12px]" : "text-md";
    return compact ? "text-[14px]" : "text-lg";
  };

  return (
    <>
      {/* Image */}
      {image && (
        <div className="absolute inset-1">
          <Image
            src={image}
            alt={label}
            fill
            sizes={sizes}
            unoptimized={image?.endsWith(".gif") ?? false}
            loading={loading}
            className="object-contain pointer-events-none"
          />
        </div>
      )}

      {/* Text Placeholder */}
      {label && !image && !isEnchantment && (
        <div
          className={`absolute inset-1 flex items-center justify-center ${getFontSize(label)}`}
        >
          <span className={`leading-tight text-center w-full`}>{label}</span>
          <span className={`absolute top-1 right-3 text-amber-400`}>⚠</span>
        </div>
      )}

      {/* Enchantments Overlay */}
      {isEnchantment && (
        <div className="absolute inset-0 flex flex-col items-center">
          <div className="relative w-full flex-1 min-h-0">
            <Image
              src="/images/tile-overlays/enchantments-overlay.gif"
              alt=""
              fill
              sizes={sizes}
              unoptimized
              className="object-contain pointer-events-none shrink-0 pt-0.5"
            />
          </div>
          <span
            className={`pointer-events-none whitespace-nowrap ${
              compact
                ? `${label.length >= 18 ? "text-[6px]" : "text-[8px]"}`
                : `${label.length >= 18 ? "text-[10px]" : "text-sm"}`
            } `}
          >
            {label}
          </span>
        </div>
      )}

      {/* Wax Overlay */}
      {isWaxed && (
        <Image
          src="/images/tile-overlays/wax-effect-overlay.png"
          alt="waxed"
          fill
          sizes={sizes}
          className="object-contain pointer-events-none"
        />
      )}

      {/* Potion && Arrows Effect Overlay */}
      {effectIcon && (
        <div
          className={`absolute ${
            compact
              ? `w-2.5 h-2.5 ${isArrow ? "bottom-0.5 right-0" : "top-1 left-6.5"}`
              : `w-5 h-5 ${isArrow ? "bottom-1.5 right-3.5" : "top-1.5 right-6"}`
          }`}
        >
          <Image
            src={effectIcon}
            alt=""
            fill
            sizes={sizes}
            className="object-contain pointer-events-none"
          />
        </div>
      )}
    </>
  );
}
