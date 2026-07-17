"use client";

import Link from "next/link";
import { ArrowLeft, CircleQuestionMark } from "lucide-react";
import { useState } from "react";
import HelpModal from "./HelpModal";
import IconButton from "./IconButton";

export default function Header({ returnLink }: { returnLink: string }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <header className="w-full max-w-xl mx-auto flex items-center justify-between mb-5 mt-2.5">
      <Link
        href={returnLink}
        className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
      >
        <ArrowLeft size={22} />
      </Link>

      <span className="font-black uppercase text-2xl">Minecraft Conexo</span>

      <IconButton onClick={() => setIsHelpOpen(true)}>
        <CircleQuestionMark size={22} />
      </IconButton>

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </header>
  );
}
