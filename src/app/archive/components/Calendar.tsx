'use client'

import { DayPicker } from 'react-day-picker'
import { useRouter } from 'next/navigation'

interface CalendarProps {
  availableDates: string[]   // e.g. ['2025-04-17', '2025-04-18']
}

export default function Calendar({ availableDates }: CalendarProps) {
  const router = useRouter()

  const puzzleDays = availableDates.map(d => {
    const [year, month, day] = d.split('-').map(Number)
    return new Date(year, month - 1, day)  // local time, no UTC shift
  })

  const handleDayClick = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0]
    if (availableDates.includes(dateStr)) {
      router.push(`/${dateStr}`)
    }
  }

  const today = new Date()

  return (
    <DayPicker
      mode="single"
      showOutsideDays={false}
      modifiers={{
        available: puzzleDays,
        todayAvailable: puzzleDays.filter(d => 
          d.getDate()     === today.getDate() &&
          d.getMonth()    === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        )
      }}
      modifiersClassNames={{
        available: 'font-bold text-white',
        outside:   '[&_button]:bg-transparent opacity-0 pointer-events-none',
        todayAvailable: '[&_button]:bg-green-500 [&_button]:hover:bg-white/10 ',

      }}
      disabled={(date) => !availableDates.includes(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      )}
      onDayClick={handleDayClick}
      classNames={{
        root:            'relative w-full px-4',
        months:          'w-full',
        month:           'w-full relative flex flex-col',
        month_caption:   'flex items-center justify-center h-10 mb-2 text-lg',
        caption_label:   'text-white font-bold',
        nav:             'absolute top-0 left-0 right-0 flex items-center justify-between h-10 z-10 mx-5 ',
        button_previous: 'p-2 hover:bg-white/10 rounded-full transition-colors [&_svg]:fill-white cursor-pointer',
        button_next:     'p-2 hover:bg-white/10 rounded-full transition-colors [&_svg]:fill-white cursor-pointer',
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