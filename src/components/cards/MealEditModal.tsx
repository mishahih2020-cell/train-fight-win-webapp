import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useT } from '@/i18n/useT'
import { mealsRepo } from '@/db/repos'
import type { Meal } from '@/types'

type EditForm = { title: string; kcal: string; grams: string; protein: string; carbs: string; fats: string }

function mealToForm(m: Meal): EditForm {
  return {
    title: m.title,
    kcal: String(m.kcal),
    grams: m.grams != null ? String(m.grams) : '',
    protein: m.protein != null ? String(m.protein) : '',
    carbs: m.carbs != null ? String(m.carbs) : '',
    fats: m.fats != null ? String(m.fats) : '',
  }
}

/**
 * Manual kcal/macro/portion editing for a logged meal — shared by the
 * Nutrition "Today" list and the calendar's day view. Callers should pass
 * `key={meal?.id}` so switching to a different meal remounts this (and
 * resets `form`) instead of needing an effect to resync state from props.
 */
export function MealEditModal({ meal, unit, onClose, onChanged }: { meal: Meal | null; unit: string; onClose: () => void; onChanged: () => void }) {
  const { t } = useT()
  const [form, setForm] = useState<EditForm | null>(() => (meal ? mealToForm(meal) : null))

  const save = async () => {
    if (!meal || !form) return
    const num = (v: string) => (v.trim() ? Number(v.replace(',', '.')) : undefined)
    await mealsRepo.update(meal.id, {
      title: form.title.trim() || meal.title,
      kcal: num(form.kcal) ?? meal.kcal,
      grams: num(form.grams),
      protein: num(form.protein),
      carbs: num(form.carbs),
      fats: num(form.fats),
    })
    onChanged()
    onClose()
  }

  const remove = async () => {
    if (!meal) return
    await mealsRepo.remove(meal.id)
    onChanged()
    onClose()
  }

  return (
    <Modal open={!!meal} onClose={onClose}>
      {meal && form && (
        <>
          <div className="text-h2 mb-4 text-[var(--color-text)]">{t('nutrition.editMealTitle')}</div>
          {meal.photoUrl && <img src={meal.photoUrl} alt="" className="mb-4 h-40 w-full rounded-[var(--radius-card)] object-cover" />}
          <div className="flex flex-col gap-3">
            <Input label={t('createWorkout.name')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label={t('common.kcal')} type="number" value={form.kcal} onChange={(e) => setForm({ ...form, kcal: e.target.value })} />
              <Input label={t('nutrition.grams')} type="number" suffix={unit} value={form.grams} onChange={(e) => setForm({ ...form, grams: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label={t('nutrition.macro.protein')} type="number" suffix={unit} value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
              <Input label={t('nutrition.macro.carbs')} type="number" suffix={unit} value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} />
              <Input label={t('nutrition.macro.fats')} type="number" suffix={unit} value={form.fats} onChange={(e) => setForm({ ...form, fats: e.target.value })} />
            </div>
          </div>
          <Button variant="primary" className="mt-5" onClick={save}>
            {t('common.save')}
          </Button>
          <Button variant="ghost" className="mt-2" onClick={remove}>
            {t('common.delete')}
          </Button>
        </>
      )}
    </Modal>
  )
}
