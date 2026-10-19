import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDeleteButton } from '@/components/ui/ConfirmDeleteButton'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { coursesRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import type { Course } from '@/types'

const EMPTY: Omit<Course, 'id'> = { title: '', subtitle: '', description: '', price: 0, purchased: false }

export function CoursesPage() {
  const { items: courses, loaded, error, reload } = useRepoList(coursesRepo)
  const [editing, setEditing] = useState<Course | null>(null)
  const [draft, setDraft] = useState<Omit<Course, 'id'>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)

  const openNew = () => {
    setEditing({ id: '', ...EMPTY })
    setDraft(EMPTY)
    setSaveError(false)
  }

  const openEdit = (course: Course) => {
    setEditing(course)
    setDraft(course)
    setSaveError(false)
  }

  const save = async () => {
    if (!editing || saving || !draft.title.trim()) return
    setSaving(true)
    setSaveError(false)
    try {
      if (editing.id) {
        await coursesRepo.update(editing.id, draft)
      } else {
        await coursesRepo.add({ id: `c${Date.now()}`, ...draft })
      }
      setEditing(null)
      reload()
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    await coursesRepo.remove(id)
    reload()
  }

  if (!loaded) return null

  if (error) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-accent)] bg-[var(--color-card)] p-4 text-center">
        <p className="text-body-secondary text-[var(--color-text)]">Не получилось загрузить курсы.</p>
        <button onClick={reload} className="text-caption mt-2 font-medium text-[var(--color-accent)] underline underline-offset-4">
          Повторить
        </button>
      </div>
    )
  }

  return (
    <div>
      <Button variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={openNew}>
        Добавить курс
      </Button>

      <div className="mt-4 flex flex-col gap-3">
        {courses.map((c) => (
          <Card key={c.id} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-body-secondary font-semibold text-[var(--color-text)]">{c.title}</div>
              <div className="text-caption mt-0.5 text-[var(--color-text-secondary)]">{c.subtitle}</div>
              <div className="text-caption mt-1 text-[var(--color-accent)]">
                {c.price > 0 ? `${c.price.toLocaleString('ru-RU')} ₽` : 'Бесплатно'}
                {c.purchased ? ' · куплен на этом устройстве' : ''}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => openEdit(c)} aria-label="Редактировать" title="Редактировать" className="press">
                <Pencil className="h-4 w-4 text-[var(--color-text-secondary)]" />
              </button>
              <ConfirmDeleteButton label="Удалить курс" onConfirm={() => remove(c.id)} />
            </div>
          </Card>
        ))}
        {courses.length === 0 && (
          <p className="text-body-secondary mt-4 text-center text-[var(--color-text-secondary)]">Курсов пока нет</p>
        )}
      </div>

      <Modal open={!!editing} onClose={() => !saving && setEditing(null)}>
        <div className="text-h2 mb-4 text-[var(--color-text)]">{editing?.id ? 'Редактировать курс' : 'Новый курс'}</div>
        <div className="flex flex-col gap-3">
          <Input label="Название" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          <Input
            label="Подзаголовок"
            value={draft.subtitle}
            onChange={(e) => setDraft((d) => ({ ...d, subtitle: e.target.value }))}
          />
          <label className="block">
            <span className="text-body-secondary mb-2 block text-[var(--color-text-secondary)]">Описание</span>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              rows={3}
              className="text-body w-full rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] p-3 text-[var(--color-text)] outline-none"
            />
          </label>
          <Input
            label="Цена (₽, 0 = бесплатно)"
            type="number"
            min={0}
            value={draft.price}
            onChange={(e) => setDraft((d) => ({ ...d, price: Math.max(0, Number(e.target.value) || 0) }))}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.purchased}
              onChange={(e) => setDraft((d) => ({ ...d, purchased: e.target.checked }))}
              className="h-4 w-4 accent-[var(--color-accent)]"
            />
            <span className="text-body-secondary text-[var(--color-text-secondary)]">
              Куплен (для тестирования — сразу открывает доступ)
            </span>
          </label>
        </div>
        {saveError && <p className="text-caption mt-3 font-medium text-[var(--color-accent)]">Не получилось сохранить курс — попробуй ещё раз</p>}
        <Button variant="primary" className="mt-5" disabled={!draft.title.trim() || saving} onClick={save}>
          Сохранить
        </Button>
      </Modal>
    </div>
  )
}
