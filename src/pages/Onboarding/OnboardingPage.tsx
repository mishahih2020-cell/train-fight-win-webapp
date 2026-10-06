import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { useAppState } from '@/context/AppStateContext'
import { useT } from '@/i18n/useT'
import type { Lang } from '@/i18n/translations'

export function OnboardingPage() {
  const navigate = useNavigate()
  const { language, setLanguage } = useAppState()
  const { t } = useT()

  return (
    <div className="overscroll-none fixed inset-0 flex flex-col overflow-y-auto">
      <PlaceholderImage className="absolute inset-0 h-full w-full" rounded="rounded-none" darken src="/photos/hero.jpg" />
      <div className="safe-top relative z-10 flex justify-end px-5 pt-4">
        <div className="flex rounded-full border border-white/20 bg-black/30 p-1 backdrop-blur-sm">
          {(['ru', 'en'] as Lang[]).map((lng) => (
            <button
              key={lng}
              onClick={() => setLanguage(lng)}
              className={`press rounded-full px-3 py-1 text-sm font-semibold uppercase transition-colors ${
                language === lng ? 'bg-white text-black' : 'text-white/70'
              }`}
            >
              {lng}
            </button>
          ))}
        </div>
      </div>
      <div className="safe-bottom relative z-10 mt-auto flex flex-col gap-5 px-5 pt-16 pb-6">
        <div>
          <h1 className="text-[32px] leading-[40px] font-extrabold tracking-tight text-white uppercase">
            {t('onboarding.title1')}
            <br />
            {t('onboarding.title2')}
            <br />
            {t('onboarding.title3')}
          </h1>
          <p className="text-body-secondary mt-3 whitespace-pre-line text-[var(--color-text-secondary)]">
            {t('onboarding.subtitle')}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/profile-setup')}>
          {t('onboarding.start')}
        </Button>
      </div>
    </div>
  )
}
