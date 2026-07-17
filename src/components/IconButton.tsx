import React from "react";

export default function IconButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}
