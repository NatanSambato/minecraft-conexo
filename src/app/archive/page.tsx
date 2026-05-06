import Calendar from './components/Calendar';
import Header from '@/components/Header';
import { getAllPuzzles } from '@/lib/puzzles';

export default async function ArchivePage( { searchParams } : { searchParams: Promise<{ date?: string }> } ) {
  const { date } = await searchParams
  const puzzles = getAllPuzzles()

  return (
    <div className='flex flex-col items-center'>
        <div className='flex flex-col gap-2 w-full max-w-xl'>
            <Header returnLink='/' />

            <span className='flex justify-center font-bold text-xl tracking-wider'>ARCHIVE</span>

            <Calendar puzzles={puzzles} initialDate={date} />
        </div>
    </div>
  )
}
