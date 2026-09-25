import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'

export function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <div className="overscroll-none fixed inset-0 flex flex-col overflow-y-auto">
      <PlaceholderImage className="absolute inset-0 h-full w-full" rounded="rounded-none" darken src="/photos/hero.jpg" />
      <div className="safe-top relative z-10" />
      <div className="safe-bottom relative z-10 mt-auto flex flex-col gap-5 px-5 pt-16 pb-6">
        <div>
          <h1 className="text-[32px] leading-[40px] font-extrabold tracking-tight text-white uppercase">
            Discipline
            <br />
            Builds
            <br />
            Freedom
          </h1>
          <p className="text-body-secondary mt-3 text-[var(--color-text-secondary)]">
            Train. Learn. Track. Improve.
            <br />
            With Marat.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/profile-setup')}>
          Начать
        </Button>
      </div>
    </div>
  )
}
