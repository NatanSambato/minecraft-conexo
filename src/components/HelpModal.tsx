import { X } from "lucide-react";
import IconButton from "./IconButton";

export default function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1f2e] p-6 max-w-sm w-full mx-4 flex flex-col gap-4 rounded-lg border-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black tracking-widest">HOW TO PLAY</h2>

          <IconButton onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>

        <p className="text-sm leading-4 mb-2">
          Find the 4 groups of 4 tiles that share a common theme.
        </p>

        <ul className="text-sm flex flex-col gap-3 leading-4">
          <li className="">
            👆 <span className="ml-0.5">Tap 4 tiles to select a group</span>
          </li>
          <li>✅ A correct group is revealed immediately</li>
          <li className="ml-0.5">
            💡<span className="ml-1.5">Use hints if you get stuck</span>
          </li>
          <li>🎉 Win by finding all the 4 groups</li>
        </ul>
      </div>
    </div>
  );
}
