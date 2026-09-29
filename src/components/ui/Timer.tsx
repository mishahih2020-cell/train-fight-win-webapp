export function Timer({ label, color }: { label: string; color?: string }) {
  return (
    <div
      className="text-center tracking-wide"
      style={{ fontSize: 40, lineHeight: '48px', fontWeight: 700, color: color ?? 'var(--color-text)' }}
    >
      {label}
    </div>
  )
}
