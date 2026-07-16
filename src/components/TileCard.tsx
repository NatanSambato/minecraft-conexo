import { getEffectIcon } from "@/lib/effectIcons";
import Image from "next/image";

interface Props {
    label: string,
    image: string | null,
    isSelected?: boolean,
    isHinted?: boolean,
    groupHex?: string,
    disabled?: boolean,
    onClick?: () => void,
}

export default function TileCard({ label, image, isSelected, isHinted, groupHex, disabled, onClick }: Props) {
    const isWaxed = label.startsWith('Waxed ')
    const effectIcon = getEffectIcon(label)
    const isArrow = label.startsWith('Arrow of')

    const getFontSize = (label: string) => {
        if (label.length > 24) return 'text-xs'
        if (label.length > 14) return 'text-sm'
        if (label.length > 8) return 'text-md'
        return 'text-lg'
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                relative h-20 flex items-center justify-center rounded-sm p-4 text-center leading-5 font-bold uppercase
                ${isSelected ? 'bg-amber-600' : 'bg-stone-600'}
                ${disabled   ? '' : 'cursor-pointer'}
            `}
        >
            {/* Image */}
            {image &&
                <div className='absolute inset-1'>
                    <Image
                        src={image} 
                        alt={label}
                        fill
                        sizes="(max-width: 576px) 25vw, 144px"
                        unoptimized={image?.endsWith(".gif") ?? false}
                        className='object-contain'
                    />
                </div>
            }

            {/* Text Placeholder */}
            {label && !image && (
                <>
                    <span className={`${getFontSize(label)} leading-tight`}>{label}</span>
                    <span className={`absolute top-1 right-1 text-amber-400`}>⚠  </span>
                </>
            )}

            {/* Wax Overlay */}
            {isWaxed && (
                <Image
                    src='/images/tile-overlays/wax-effect-overlay.png'
                    alt='waxed'
                    fill
                    sizes="(max-width: 576px) 25vw, 144px"
                    className='object-contain pointer-events-none'
                />
            )}

            {/* Effect */}
            {effectIcon && (
                <div className={`absolute w-5 h-5 ${isArrow ? 'bottom-1.5 right-3.5' : 'top-1.5 right-3.5'}`}>
                    <Image
                        src={effectIcon}
                        alt=''
                        fill
                        sizes="(max-width: 576px) 25vw, 144px"
                        className='object-contain pointer-events-none'
                    />
                </div>
            )}

            {/* Hint Overlay*/}
            {isHinted && (
                <div
                    className='absolute top-0 right-0 w-0 h-0'
                    style={{
                        borderTop: `30px solid ${groupHex}`,
                        borderLeft: '30px solid transparent',
                    }}
                />
            )}
        </button>
    )
}
