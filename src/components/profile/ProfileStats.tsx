export function ProfileStats({
  courses,
  lessons,
  achievements,
}: {
  courses: number
  lessons: number
  achievements: number
}) {
  const items = [
    { value: courses, label: 'курсов' },
    { value: lessons, label: 'уроков' },
    { value: achievements, label: 'достижений' },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-border bg-graphite py-3 text-center">
          <p className="text-[20px] font-extrabold text-white">{item.value}</p>
          <p className="text-[11px] text-muted">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
