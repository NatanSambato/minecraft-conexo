'use client'

import { DayPicker } from 'react-day-picker'
import { useRouter } from 'next/navigation'
import { Puzzle } from '@/types'
import { getAllProgress } from '@/lib/utils'

const toDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

interface CalendarProps {
  puzzles: Puzzle[]   // e.g. ['2025-04-17', '2025-04-18']
  initialDate?: string
}

export default function Calendar({ puzzles, initialDate }: CalendarProps) {
  const router = useRouter()
  const allProgress = getAllProgress()

  const puzzleDays = puzzles.map(p => toDate(p.date))

  const defaultMonth = initialDate
    ? new Date(Number(initialDate.split('-')[0]), Number(initialDate.split('-')[1]) - 1) 
    : puzzleDays.at(-1)
  ;

  const today = new Date()

  const wonDays     = puzzles.filter(p => allProgress[`puzzle_${p.id}`]?.status === 'won').map(p => toDate(p.date))
  const playingDays = puzzles.filter(p => allProgress[`puzzle_${p.id}`]?.status === 'playing').map(p => toDate(p.date))

  const handleDayClick = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0]
    if (puzzles.some(p => p.date === dateStr)) {
      router.push(`/${dateStr}`)
    }
  }

  const showFuture = process.env.NEXT_PUBLIC_SHOW_FUTURE === 'true'

  return (
    <DayPicker
      mode="single"
      showOutsideDays={false}
      defaultMonth={defaultMonth}
      startMonth={new Date(2026, 4)}
      endMonth={new Date()}
      modifiers={{
        available: puzzleDays.filter(d => d <= today),
        future: puzzleDays.filter(d => d > today),
        won: wonDays,
        playing: playingDays,
        todayAvailable: puzzleDays.filter(d => 
          d.getDate()     === today.getDate() &&
          d.getMonth()    === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        )
      }}
      modifiersClassNames={{
        available: 'font-bold text-white',
        won: '[&_button]:bg-green-500',
        playing: '[&_button]:bg-yellow-400',
        future: showFuture ? 'font-bold text-white' : '',
        outside:   '[&_button]:bg-transparent opacity-0 pointer-events-none',
        // todayAvailable: '[&_button]:bg-green-500 [&_button]:hover:bg-white/10 ',

      }}
      disabled={(date) => {
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        const isFuture = showFuture
          ? false 
          : date > today
        return !puzzles.some(p => p.date === dateString) || isFuture
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