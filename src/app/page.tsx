'use client'

import { getTodaysDate } from '@/lib/gameUtils'
import Link from 'next/link';

export default function page() {
  const today = getTodaysDate();

  return (
    <main className='flex flex-col items-center justify-center min-h-screen gap-8'>
      <h1 className='font-black text-2xl uppercase tracking-wide'>
        MINECRAFT CONEXO
      </h1>

      <div className='flex flex-col gap-4'>
        <Link href={`/${today}`} className="px-6 py-3 bg-green-600 text-white rounded">
          Daily Game
        </Link>

        <Link href="/archive" className='px-6 py-3 bg-gray-600 text-white text-center rounded'>
          Archive
        </Link>
      </div>
    </main>
  )
}
