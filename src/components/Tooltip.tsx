interface Props {
  x: number;
  y: number;
  label: string;
  visible: boolean;
}

export default function Tooltip({ x, y, label, visible }: Props) {
  if (!visible) return null;

  const cleanLabel = label.replace(/\(.*?\)/g, "").trim();

  return (
    <div
      style={{
        position: "fixed",
        left: x + 12,
        top: y - 24,
      }}
      className="z-10 pointer-events-none whitespace-nowrap"
    >
      <div
        style={{
          border: "2px solid #2C0863",
          borderRadius: "2px",
          background: "rgba(16, 0, 16, 0.90)",
          boxShadow: "0 0 0 2px #000",
        }}
        className="px-1 py-1 [text-shadow:2px_2px_0_#3F3F3F]"
      >
        {cleanLabel}
      </div>
    </div>
  );
}
