import { useState } from "react";

export function useTooltip() {
    const isTouchDevice = window.matchMedia('(hover: none)').matches

    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = () => !isTouchDevice && setVisible(true)
    const handleMouseLeave = () => setVisible(false)
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isTouchDevice) setPosition({ x: e.clientX, y: e.clientY, });
    };

    return {
        visible,
        position,
        handlers: {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onMouseMove: handleMouseMove,
        }
    }
}