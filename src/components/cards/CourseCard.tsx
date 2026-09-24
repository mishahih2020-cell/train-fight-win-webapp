import type { Course } from '@/types'
import { Button } from '@/components/ui/Button'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { ProgressBar } from '@/components/ui/ProgressBar'

export function CourseCard({ course }: { course: Course }) {
  return (
    <div className="card-shadow relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-divider)]">
      <PlaceholderImage className="h-44 w-full" rounded="rounded-none" darken />
      {course.badge && (
        <span className="text-caption absolute top-3 right-3 rounded-[var(--radius-pill)] bg-black/60 px-2.5 py-1 font-semibold text-white backdrop-blur">
          {course.badge}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4">
        <div>
          <div className="text-h2 leading-tight text-white uppercase">{course.title}</div>
          <div className="text-caption mt-1 text-[var(--color-text-secondary)]">{course.subtitle}</div>
        </div>
        {typeof course.progress === 'number' && (
          <div className="flex items-center gap-2">
            <ProgressBar value={course.progress} className="flex-1" />
            <span className="text-caption font-semibold text-[var(--color-accent)]">{course.progress}%</span>
          </div>
        )}
        <Button variant="primary" fullWidth={false} className="self-start px-6">
          {course.cta}
        </Button>
      </div>
    </div>
  )
}
