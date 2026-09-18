import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@/components/ui/IconButton'
import type { ReactNode } from 'react'

export function Header({
  title,
  onBack,
  right,
  transparent = false,
}: {
  title: string
  onBack?: () => void
  right?: ReactNode
  transparent?: boolean
}) {
  const navigate = useNavigate()

  return (
    <header
      className={`safe-top sticky top-0 z-30 flex items-center gap-3 px-5 pb-3 pt-4 ${
        transparent ? 'bg-transparent' : 'border-b border-border bg-bg/92 backdrop-blur-lg'
      }`}
    >
      <IconButton icon={<ChevronLeft size={20} />} onClick={onBack ?? (() => navigate(-1))} aria-label="Назад" />
      <h1 className="flex-1 truncate text-[17px] font-extrabold tracking-tight">{title}</h1>
      {right}
    </header>
  )
}
