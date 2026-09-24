import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@/components/ui/IconButton'

interface HeaderProps {
  title: string
  onBack?: () => void
  trailing?: ReactNode
  children?: ReactNode
}

/** Back button + title header used on all drill-in / secondary screens. */
export function Header({ title, onBack, trailing, children }: HeaderProps) {
  const navigate = useNavigate()
  return (
    <div className="safe-top px-4 pt-4">
      <div className="flex h-10 items-center justify-between">
        <IconButton variant="card" onClick={onBack ?? (() => navigate(-1))} aria-label="Назад">
          <ChevronLeft className="h-5 w-5" />
        </IconButton>
        <h1 className="text-h2 text-[var(--color-text)]">{title}</h1>
        {trailing ?? <div className="h-10 w-10" />}
      </div>
      {children}
    </div>
  )
}
