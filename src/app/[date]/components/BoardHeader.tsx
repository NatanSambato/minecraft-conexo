'use client'

import useGameStore from "@/store/gameStore"

export default function BoardHeader({ dateTitle } : {dateTitle: string}) {
  const attempts = useGameStore((state) => state.attempts)

  return (
    <div className="flex items-center gap-6 mb-2 w-full text-md">
      <span className="font-bold">{dateTitle}</span>
      <span>
        ATTEMPTS:
        <span className="font-bold"> {attempts}</span>
      </span> 
    </div>  
  )
}
