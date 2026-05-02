import fs from 'fs'
import path from 'path'
import Calendar from './components/Calendar';
import Header from '@/components/Header';

export default async function ArchivePage( { searchParams } : { searchParams: Promise<{ date?: string }> } ) {
  const { date } = await searchParams
  const dir           = path.join(process.cwd(), 'src', 'app', 'data', 'puzzles')
  const availableDates = fs.readdirSync(dir)
                           .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
                           .map(f => f.replace('.json', ''))
                           .sort()
  return (
    <div className='flex flex-col items-center'>
        <div className='flex flex-col gap-2 w-full max-w-xl'>
            <Header returnLink='/' />

            <span className='flex justify-center font-bold text-xl tracking-wider'>ARCHIVE</span>

            <Calendar availableDates={availableDates} initialDate={date} />
        </div>
    </div>
  )
}
