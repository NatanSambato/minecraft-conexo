'use client'

import { DayPicker } from 'react-day-picker'
import { useRouter } from 'next/navigation'
import { Puzzle, SavedProgress } from '@/types'
import { getProgress } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { buildKey } from '@/hooks/useProgress'

const toDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

interface CalendarProps {
  puzzles: Puzzle[]   // e.g. ['2026-04-17', '2026-04-18']
  initialDate?: string
}

export default function Calendar({ puzzles, initialDate }: CalendarProps) {
  const router = useRouter()

  const [progress, setProgress] = useState<Record<string, SavedProgress>>({})
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(getProgress())
  }, [])

  const puzzleDays = puzzles.map(p => toDate(p.date))

  const todayStr = new Date().toISOString().split('T')[0] // "2026-04-23"
  const defaultMonth = initialDate
    ? new Date(Number(initialDate.split('-')[0]), Number(initialDate.split('-')[1]) - 1) 
    : new Date(todayStr)
  ;

  const todayDate = toDate(todayStr)
  const firstPuzzleDate = puzzleDays[0]
  const lastPuzzleDate = puzzleDays.at(-1) ?? todayDate
  const puzzleDateStrs = puzzles.map(p => p.date)
  const availableStrs = puzzleDateStrs.filter(d => d <= todayStr)
  const futureStrs    = puzzleDateStrs.filter(d => d > todayStr)

  const wonDays     = puzzles.filter(p => progress[buildKey(p.id)]?.status === 'won').map(p => toDate(p.date))
  const playingDays = puzzles.filter(p => progress[buildKey(p.id)]?.status === 'playing').map(p => toDate(p.date))

  const handleDayClick = (day: Date) => {
    const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
    if (puzzles.some(p => p.date === dateStr)) {
      router.push(`/${dateStr}`)
    }
  }

  const showFuture = process.env.NEXT_PUBLIC_SHOW_UNRELEASED_PUZZLES  === 'true'
  
  return (
    <DayPicker
      mode="single"
      showOutsideDays={false}
      defaultMonth={defaultMonth}
      startMonth={firstPuzzleDate}
      endMonth={showFuture ? lastPuzzleDate : todayDate}
      modifiers={{
        available: availableStrs.map(toDate),
        future: futureStrs.map(toDate),
        won: wonDays,
        playing: playingDays,
        todayAvailable: puzzleDays.filter(d => 
          d.getDate()     === todayDate.getDate() &&
          d.getMonth()    === todayDate.getMonth() &&
          d.getFullYear() === todayDate.getFullYear()
        )
      }}
      modifiersClassNames={{
        available: 'font-bold text-white',
        won: '[&_button]:bg-green-500',
        playing: '[&_button]:bg-yellow-400',
        future: showFuture ? 'font-bold text-white' : '',
        outside:   '[&_button]:bg-transparent opacity-0 pointer-events-none',
      }}
      disabled={(date) => {
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        const isFuture = showFuture ? false : dateStr > todayStr
        return !puzzleDateStrs.includes(dateStr) || isFuture
      }}

      onDayClick={handleDayClick}
      classNames={{
        root:            'relative w-full px-4',
        months:          'w-full',
        month:           'w-full relative flex flex-col',
        month_caption:   'flex items-center justify-center h-10 mb-2 text-lg',
        caption_label:   'text-white font-bold',
        nav:             'absolute top-0 left-0 right-0 flex items-center justify-between h-10 z-10 mx-5 ',
        button_previous: 'p-2 hover:bg-white/10 rounded-full transition-colors [&_svg]:fill-white cursor-pointer aria-disabled:opacity-30 aria-disabled:hover:bg-transparent aria-disabled:cursor-default',
        button_next:     'p-2 hover:bg-white/10 rounded-full transition-colors [&_svg]:fill-white cursor-pointer aria-disabled:opacity-30 aria-disabled:hover:bg-transparent aria-disabled:cursor-default',
        month_grid:      'w-full table-fixed',
        weekdays:        'w-full',
        weekday:         'text-center font-bold text-white pb-2',
        week:            'w-full',
        day:             'text-center p-1 group',
        day_button:      'w-12 h-12 mx-auto flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer',
        selected:        '',
        disabled:        'pointer-events-none text-olive-400 opacity-60',
      }}
    />
  )
}