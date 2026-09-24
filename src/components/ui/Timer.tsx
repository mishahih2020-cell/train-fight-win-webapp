export function Timer({ label }: { label: string }) {
  return (
    <div className="text-center tracking-wide text-[var(--color-text)]" style={{ fontSize: 40, lineHeight: '48px', fontWeight: 700 }}>
      {label}
    </div>
  )
}
