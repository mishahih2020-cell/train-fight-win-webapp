import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { coursesRepo } from '@/db/repos'
import { useRepoList } from '@/db/useRepo'
import type { Course } from '@/types'

const EMPTY: Omit<Course, 'id'> = { title: '', subtitle: '', description: '', price: 0, purchased: false }

export function CoursesPage() {
  const { items: courses, reload } = useRepoList(coursesRepo)
  const [editing, setEditing] = useState<Course | null>(null)
  const [draft, setDraft] = useState<Omit<Course, 'id'>>(EMPTY)

  const openNew = () => {
    setEditing({ id: '', ...EMPTY })
    setDraft(EMPTY)
  }

  const openEdit = (course: Course) => {
    setEditing(course)
    setDraft(course)
  }

  const save = async () => {
    if (!editing) return
    if (editing.id) {
      await coursesRepo.update(editing.id, draft)
    } else {
      await coursesRepo.add({ id: `c${Date.now()}`, ...draft })
    }
    setEditing(null)
    reload()
  }

  const remove = async (id: string) => {
    await coursesRepo.remove(id)
    reload()
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
              <button onClick={() => openEdit(c)} aria-label="Редактировать" className="press">
                <Pencil className="h-4 w-4 text-[var(--color-text-secondary)]" />
              </button>
              <button onClick={() => remove(c.id)} aria-label="Удалить" className="press">
                <Trash2 className="h-4 w-4 text-[var(--color-accent)]" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)}>
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
            value={draft.price}
            onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))}
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
        <Button variant="primary" className="mt-5" disabled={!draft.title.trim()} onClick={save}>
          Сохранить
        </Button>
      </Modal>
    </div>
  )
}
