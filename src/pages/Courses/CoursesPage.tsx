import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { FilterChip } from '@/components/ui/FilterChip'
import { IconButton } from '@/components/ui/IconButton'
import { BrandMark } from '@/components/navigation/BrandMark'
import { CourseCard } from '@/components/courses/CourseCard'
import { courses } from '@/data/courses'
import { useAppState } from '@/context/AppStateContext'
import type { Direction } from '@/types'

type FilterId = 'all' | Direction | 'beginner'

const filters: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'muay-thai', label: 'Муай-тай' },
  { id: 'kickboxing', label: 'Кикбоксинг' },
  { id: 'beginner', label: 'Для новичков' },
]

export function CoursesPage() {
  const [filter, setFilter] = useState<FilterId>('all')
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { state } = useAppState()

  const filtered = useMemo(() => {
    let list = courses
    if (filter === 'beginner') list = list.filter((c) => c.level === 'beginner')
    else if (filter !== 'all') list = list.filter((c) => c.direction === filter)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((c) => c.shortTitle.toLowerCase().includes(q))
    }
    return list
  }, [filter, query])

  const closeSearch = () => {
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <div className="pb-28">
      <div className="flex items-center justify-between px-5 pt-[max(16px,env(safe-area-inset-top))]">
        <BrandMark />
        {searchOpen ? (
          <IconButton icon={<X size={18} />} onClick={closeSearch} aria-label="Закрыть поиск" />
        ) : (
          <IconButton icon={<Search size={18} />} onClick={() => setSearchOpen(true)} aria-label="Поиск" />
        )}
      </div>

      <div className="px-5 pt-3">
        {searchOpen ? (
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск курса..."
            className="h-11 w-full rounded-pill border border-border-strong bg-graphite px-4 text-[14px] text-white outline-none placeholder:text-muted-2"
          />
        ) : (
          <>
            <h1 className="text-[26px] font-extrabold uppercase tracking-tight">Курсы</h1>
            <p className="mt-1 text-[13px] text-muted">Профессиональные программы тренировок от профессионального бойца.</p>
          </>
        )}
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {filters.map((f) => (
          <FilterChip key={f.id} label={f.label} active={filter === f.id} onClick={() => setFilter(f.id)} />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 px-5">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} owned={state.purchasedCourses.includes(course.id)} />
        ))}
        {filtered.length === 0 && (
          <p className="mt-6 text-center text-[13px] text-muted">Ничего не найдено.</p>
        )}
      </div>
    </div>
  )
}
