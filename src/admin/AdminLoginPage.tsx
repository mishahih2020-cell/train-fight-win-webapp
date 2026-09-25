import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ADMIN_PASSWORD, setAdminAuthed } from './auth'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const submit = () => {
    if (password === ADMIN_PASSWORD) {
      setAdminAuthed()
      navigate('/admin/dashboard')
    } else {
      setError(true)
    }
  }

  return (
    <div className="safe-top safe-bottom overscroll-none fixed inset-0 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[320px]">
        <h1 className="text-h1 text-center text-[var(--color-text)]">Админ-панель</h1>
        <p className="text-body-secondary mt-2 text-center text-[var(--color-text-secondary)]">Marat Fight Club</p>

        <div className="mt-8">
          <label className="block">
            <span className="text-body-secondary mb-2 block text-[var(--color-text-secondary)]">Пароль</span>
            <input
              type="password"
              inputMode="numeric"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              className="text-body h-12 w-full rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4 text-[var(--color-text)] outline-none"
              autoFocus
            />
          </label>
          {error && <p className="text-caption mt-2 font-medium text-[var(--color-accent)]">Неверный пароль</p>}
        </div>

        <Button variant="primary" className="mt-6" onClick={submit}>
          Войти
        </Button>

        <p className="text-caption mt-6 text-center text-[var(--color-text-tertiary)]">
          Временная защита паролем на стороне клиента — не для реальных платёжных данных, пока нет сервера.
        </p>
      </div>
    </div>
  )
}
